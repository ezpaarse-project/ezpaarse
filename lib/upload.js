/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var fs = require('fs');
var http = require('http');

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

function startUploadStreaming(headers, socket, port) {
  var options = {
    hostname: 'localhost',
    port: port,
    path: '/ws/',
    method: 'POST',
    headers: headers
  };
  
  var req = http.request(options, function (res) {
    res.setEncoding('utf8');
    if (res.statusCode != 200) {
      socket.emit('error', 'code ' + res.statusCode);
    }
    res.on('data', function (chunk) {
      socket.emit('resData', chunk);
    });

    res.on('end', function () {
      socket.emit('done', 'Traitement terminé !');
    });
  });
  
  req.on('error', function (e) {
    socket.emit('error', e.message);
  });

  socket.emit('info', 'En cours de traitement...');
  socket.emit('moreData', { place: 0, percent: 0 });

  return req;
}

function startUpload(file, storageDir, socket) {
  var place = 0;
  try {
    var stat = fs.statSync(storageDir + '/' +  file.fileName);
    if(stat.isFile()) {
      file.downloaded = stat.size;
      place = stat.size / 524288;
    }
  } catch(er) {} //It's a New File

  if (!checkStorageDir(storageDir)) {
    socket.emit('error', 'impossible de stocker le fichier');
    return;
  };

  fs.open(storageDir + "/" + file.fileName, "a", parseInt("0755"), function(err, fd) {
    if (err) {
      console.error(err);
    } else {
      file.handler = fd; //We store the file handler so we can write to it later
      socket.emit('info', 'Réception du fichier...');
      socket.emit('moreData', { place: place, percent: 0 });
    }
  });
}

function processFile(file, headers, storageDir, socket, port) {
  if (!fs.existsSync(storageDir + '/' + file.fileName)) {
    socket.emit('error', 'le fichier n\'a pas été reçu correctement');
    return;
  }
  fs.write(file.handler, file.data, null, 'Binary', function(err, writen) {
    var options = {
      hostname: 'localhost',
      port: port,
      path: '/ws/',
      method: 'POST',
      headers: headers
    };
    var req = http.request(options, function (res) {
      res.setEncoding('utf8');
      if (res.statusCode != 200) {
        socket.emit('error', 'code ' + res.statusCode);
      }
      res.on('data', function (chunk) {
        socket.emit('resData', chunk);
      });
      res.on('end', function () {
        socket.emit('done', 'Traitement terminé !');
      });
    });
    req.on('error', function (e) {
      socket.emit('error', e.message);
    });
    fs.createReadStream(storageDir + '/' + file.fileName).pipe(req);
  });
}

function handleChunkStreaming(chunk, file, socket, req) {
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

function handleChunk(chunk, file, storageDir, headers, socket, port) {
  file.data += chunk;
  if (file.downloaded == file.fileSize) { //If File is Fully Uploaded
    socket.emit('downloaded', 'Fichier reçu, en cours de traitement...');
    processFile(file, headers, storageDir, socket, port);
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
    var storageDir = 'temp';
    var file = {};
    var streaming = true;
    var req;
    var headers;

    //data contains the variables that we passed through in the html file
    socket.on('start', function (streamingRequest, filename, filesize, reqHeaders) {
      streaming = streamingRequest;
      headers = reqHeaders;
      file = {
        fileName: filename,
        fileSize: filesize,
        data: "",
        downloaded: 0,
      }

      if (streaming) {
        req = startUploadStreaming(headers, socket, port);
      } else {
        startUpload(file, storageDir, socket);
      }
    });

    socket.on('upload', function (data) {
      file.downloaded += data.length;

      if (streaming) {
        handleChunkStreaming(data, file, socket, req);
      } else {
        handleChunk(data, file, storageDir, headers, socket, port);
      }
   });
  });
};