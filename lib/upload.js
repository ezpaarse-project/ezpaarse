/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var fs            = require('fs');
var http          = require('http');
var statusCodes   = require('../statuscodes.json');
var crypto        = require('crypto');
var cookie        = require('express/node_modules/cookie');
var connect       = require('express/node_modules/connect');
var folderChecker = require('./folderchecker.js');
var config        = require('../config.json');

/*
* sets socket.io in order to handle uploads
*/

function startUploadStreaming(file, options) {
  var socket = options.socket;

  if (!options.streamResponse) {
    if (!folderChecker.check(options.storageDir)) {
      socket.emit('error', 'Erreur: impossible de stocker le(s) fichier(s).');
      socket.disconnect();
      return;
    }
  }

  var resultStream;
  var reqOptions = {
    hostname: '127.0.0.1',
    port: options.port,
    path: '/ws/',
    method: 'POST',
    headers: options.headers
  };
  
  var req = http.request(reqOptions, function (res) {
    res.setEncoding('binary');
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
        resultStream.write(chunk, 'binary');
      }
    });

    res.on('end', function () {
      if (!options.streamResponse && resultStream) {
        resultStream.end();
      }
      var downloadPATH = false;
      if (!options.streamResponse) {
        downloadPATH = '/ws/results/' + options.hashedID + '/' + file.resultName;
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

  if (!folderChecker.check(options.storageDir)) {
    socket.emit('error', 'Erreur: impossible de stocker le(s) fichier(s).');
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
  if (!folderChecker.check(options.storageDir)) {
    socket.emit('error', 'Erreur: impossible de stocker le(s) fichier(s).');
    socket.disconnect();
    return;
  }
  socket.emit('taskStart', 'Traitement du fichier...');

  if (!fs.existsSync(options.logFile)) {
    socket.emit('error', 'Erreur: le fichier n\'a pas été reçu correctement.');
    socket.disconnect();
    return;
  }
  var reqOptions = {
    hostname: '127.0.0.1',
    port: options.port,
    path: '/ws/',
    method: 'POST',
    headers: options.headers
  };
  var req = http.request(reqOptions, function (res) {
    var resultStream;
    res.setEncoding('binary');
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
        resultStream.write(chunk, 'binary');
      }
    });

    res.on('end', function () {
      var downloadPATH = false;
      if (!options.streamResponse && resultStream) {
        resultStream.end();
        downloadPATH = '/ws/results/' + options.hashedID + '/' + file.resultName;
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
}

function handleChunkStreaming(chunk, file, req, options) {
  var socket = options.socket;
  req.write(chunk, 'binary');
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
    fs.write(file.handler, file.data, null, 'Binary', function(err, writen) {
      processFile(file, options);
    });
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
    if (moreData) {
      socket.emit('moreData', { place : place, percent:  percent});
    }
  }
}

module.exports = function (server, port, showLog) {
  var io = require('socket.io').listen(server, { log: showLog || false });
  io.set('transports', [
    'websocket',
    'flashsocket',
    'htmlfile',
    //'xhr-polling',
    'jsonp-polling'
  ]);

  io.set('authorization', function (handshake, accept) {
    if (handshake.headers.cookie) {
      // Read cookies
      var cookies = cookie.parse(handshake.headers.cookie);
      if (cookies['ezpaarse.sid']) {
        // Unsign sessionID cookie and store it in the socket
        handshake.sessionID = connect.utils.parseSignedCookie(cookies['ezpaarse.sid'], 'ezpaarse');
      } else {
        // if no sessionID in cookies, turn down the connection with a message
        return accept('No session ID in cookies.', false);
      }
    } else {
      // if no cookies, turn down the connection with a message
      return accept('No cookie transmitted.', false);
    }
    // accept the incoming connection
    accept(null, true);
  });

  io.sockets.on('connection', function (socket) {
    var sessionID = socket.handshake.sessionID;
    var file = {};
    var options;
    var req;
    
    socket.on('start', function (formOptions) {
      options = formOptions;
      if (sessionID) {
        options.hashedID   = crypto.createHash('sha1').update(sessionID).digest("hex");
        options.storageDir = __dirname + '/../tmp/' + options.hashedID;
      } else {
        socket.emit('error', 'Error: session not found');
        socket.disconnect();
        return;
      }
      
      file = {
        fileName: options.fileName,
        resultName: options.fileName + '.result',
        data: "",
        downloaded: 0
      }
      if (options.fileSize) {
        file.fileSize = options.fileSize;
      }
      if (options.location) {
        file.location = options.location;
      }
      if (options.headers && options.headers['Accept'] == 'text/csv') {
        file.resultName += '.csv';
      } else if (options.headers && options.headers['Accept'] == 'application/json') {
        file.resultName += '.json';
      }
      if (options.headers && options.headers['Accept-Encoding'] == 'gzip') {
        file.resultName += '.gz';
      }
      if (file.location) {
        if (config.EZPAARSE_LOG_FOLDER) {
          options.logdir  = __dirname + '/../' + config.EZPAARSE_LOG_FOLDER;
          options.logFile = options.logdir + '/' + file.location;
        } else {
          socket.emit('error', 'Erreur: le dossier des logs locaux ' +
            'n\'est pas renseigné dans le fichier de configuration');
          socket.disconnect();
          return;
        }
      } else {
        options.logFile = options.storageDir + '/' +  file.fileName;
      }
      options.resultFile  = options.storageDir + '/' +  file.resultName;
      options.port        = port;
      options.socket      = socket;

      if (file.location) {
        processFile(file, options);
      } else {
        // If size over 200MB
        if (file.fileSize > 209715200) {
          socket.emit('taskWarning', 'Le fichier est volumineux, le processus peut être long.');
        }

        if (options.streamRequest) {
          req = startUploadStreaming(file, options);
        } else {
          startUpload(file, options);
        }
      }
    });

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