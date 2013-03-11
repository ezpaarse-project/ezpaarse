/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var fs          = require('fs');
var http        = require('http');
var statusCodes = require('../statuscodes.json');

/*
* sets socket.io in order to handle uploads
*/

/*
* Checks if the upload directory exists.
* If not, tries to create it.
*/
function checkStorageDir(storageDir) {
  var dirIsAvailable = true;
  if (fs.existsSync(storageDir)) {
    if (!fs.statSync(storageDir).isDirectory()) {
      dirIsAvailable = false;
    }
  } else {
    fs.mkdirSync(storageDir);
  }
  return dirIsAvailable;
}

function startUploadStreaming(file, options) {
  var socket = options.socket;
  var resultStream;
  var reqOptions = {
    hostname: 'localhost',
    port: options.port,
    path: '/ws/',
    method: 'POST',
    headers: options.headers
  };
  
  var req = http.request(reqOptions, function (res) {
    res.setEncoding('utf8');
    if (res.statusCode != 200) {
      var error  = 'Erreur: code ' + res.statusCode;
      var status = res.headers['ezpaarse-status'];
      if (status && statusCodes[status]) {
        error = status + ': ' + statusCodes[status];
      }
      socket.emit('error', error);
      socket.disconnect();
      return;
    }

    if (!options.streamResponse) {
      resultStream = fs.createWriteStream(options.resultFile);
    }

    res.on('data', function (chunk) {
      if (options.streamResponse) {
        socket.emit('resData', chunk);
      } else {
        resultStream.write(chunk);
      }
    });

    res.on('end', function () {
      if (!options.streamResponse && resultStream) {
        resultStream.end();
      }
      var downloadPATH = false;
      if (!options.streamResponse) {
        downloadPATH = '/ws/results/' + file.fileName + '.result';
      }
      socket.emit('taskSuccess');
      socket.emit('done', 'Traitement terminé !', downloadPATH);
    });
  });
  
  req.on('error', function (e) {
    socket.emit('error', e.message);
    socket.disconnect();
  });

  socket.emit('taskStart', 'En cours de traitement...');
  socket.emit('moreData', { place: 0, percent: 0 });

  return req;
}

function startUpload(file, options) {
  var socket = options.socket;
  var place  = 0;

  if (!checkStorageDir(options.storageDir)) {
    socket.emit('error', 'impossible de stocker le fichier.');
    socket.disconnect();
    return;
  };

  try {
    var stat = fs.statSync(options.logFile);
    if(stat.isFile()) {
      file.downloaded = stat.size;
      place = stat.size / 524288;
    }
  } catch(er) {} //It's a New File

  fs.open(options.logFile, 'a', parseInt('0755'), function(err, fd) {
    if (err) {
      console.error(err);
    } else {
      file.handler = fd; //We store the file handler so we can write to it later
      socket.emit('taskStart', 'Téléchargement du fichier...');
      socket.emit('moreData', { place: place, percent: 0 });
    }
  });
}

function processFile(file, options) {
  var socket = options.socket;
  socket.emit('taskStart', 'Traitement du fichier...');

  if (!fs.existsSync(options.logFile)) {
    socket.emit('error', 'le fichier n\'a pas été reçu correctement.');
    socket.disconnect();
    return;
  }

  fs.write(file.handler, file.data, null, 'Binary', function(err, writen) {
    var reqOptions = {
      hostname: 'localhost',
      port: options.port,
      path: '/ws/',
      method: 'POST',
      headers: options.headers
    };
    var req = http.request(reqOptions, function (res) {
      var resultStream;
      res.setEncoding('utf8');
      if (res.statusCode != 200) {
        socket.emit('error', 'code ' + res.statusCode);
        socket.disconnect();
        return;
      }

      if (!options.streamResponse) {
        resultStream = fs.createWriteStream(options.resultFile);
      }

      res.on('data', function (chunk) {
        if (options.streamResponse) {
          socket.emit('resData', chunk);
        } else {
          resultStream.write(chunk);
        }
      });

      res.on('end', function () {
        var downloadPATH = false;
        if (!options.streamResponse && resultStream) {
          resultStream.end();
          downloadPATH = '/ws/results/' + file.fileName + '.result';
        }
        socket.emit('taskSuccess');
        socket.emit('done', 'Traitement terminé !', downloadPATH);
      });
    });
    req.on('error', function (e) {
      socket.emit('error', e.message);
      socket.disconnect();
    });
    fs.createReadStream(options.logFile).pipe(req);
  });
}

function handleChunkStreaming(chunk, file, req, options) {
  var socket = options.socket;
  req.write(chunk);
  if (file.downloaded == file.fileSize) { //If File is Fully Uploaded
    req.end();
    socket.emit('downloaded');
  } else {
    var place = file.downloaded / 524288;
    var percent = (file.downloaded / file.fileSize) * 100;
    socket.emit('moreData', { place : place, percent:  percent});
  }
}

function handleChunk(chunk, file, options) {
  var socket = options.socket;
  file.data += chunk;
  if (file.downloaded == file.fileSize) { //If File is Fully Uploaded
    socket.emit('downloaded');
    socket.emit('taskSuccess');
    processFile(file, options);
  } else if (file.data.length > 10485760) { //If the Data Buffer reaches 10MB
    fs.write(file.handler, file.data, null, 'Binary', function(err, writen) {
      file.data = ""; //Reset The Buffer
      var place = file.downloaded / 524288;
      var percent = (file.downloaded / file.fileSize) * 100;
      socket.emit('moreData', { place: place, percent: percent});
    });
  } else {
    var place = file.downloaded / 524288;
    var percent = (file.downloaded / file.fileSize) * 100;
    socket.emit('moreData', { place : place, percent:  percent});
  }
}

module.exports = function (server, port, showLog) {
  var io = require('socket.io').listen(server, { log: showLog || false });

  io.sockets.on('connection', function (socket) {
    var file = {};
    var options;
    var req;

    socket.on('start', function (formOptions) {
      options             = formOptions;
      options.storageDir  = 'temp';
      options.logFile     = options.storageDir + '/' +  options.fileName;
      options.resultFile  = options.logFile + '.result';
      options.port        = port;
      options.socket      = socket;

      file = {
        fileName: options.fileName,
        fileSize: options.fileSize,
        data: "",
        downloaded: 0,
      }

      // If size over 200MB
      if (file.fileSize > 209715200) {
        socket.emit('taskWarning', 'Le fichier est volumineux, le processus peut être long.');
      }

      if (options.streamRequest) {
        req = startUploadStreaming(file, options);
      } else {
        startUpload(file, options);
      }
    });

    // TODO include into startUpload()
    socket.on('upload', function (data) {
      file.downloaded += data.length;

      if (options.streamRequest) {
        handleChunkStreaming(data, file, req, options);
      } else {
        handleChunk(data, file, options);
      }
   });
  });
};