'use strict';

var path      = require('path');
var Loader    = require('castor-load');
var csvLoader = require('castor-load-csv')({ separator: '\t' });
var io        = require('./socketio.js');
var config    = require('./config.js');

var options = {
  connexionURI: config.EZPAARSE_MONGO_URL,
  collectionName: 'pkbs',
  ignore: ['**/*.miss.txt', '**/*.json', '**/*.csv', '**/*.js', '.git'],
  writeConcern: 0,
  concurrency: 10
};

var loader = new Loader(path.join(__dirname, '../platforms'), options);
loader.use(function (doc, next) {
  var splitedPath = doc.location.split(path.sep);
  var index = splitedPath.indexOf('platforms');
  if (index >= 0 && index < splitedPath.length - 1) {
    doc._platform = splitedPath[++index];
  }
  next(null, doc);
});
loader.use('**/*.txt', csvLoader);

var status = {
  state: 'synchronizing',
  progress: 0
};

var totalSize   = 0;
var checkedSize = 0;
var throttleID;

var update = function () {
  if (throttleID) { clearTimeout(throttleID); }
  throttleID = setTimeout(function() {
    status.progress = Math.floor(checkedSize / totalSize * 100);
    io.emit('castor:update', status);
  }, 500);
};
var preCheckHandler = function (doc) {
  totalSize += doc.filesize || 0;
  update();
};
var postCheckHandler = function (err, doc) {
  checkedSize += doc ? doc.filesize || 0 : 0;
  update();
};
update();

loader.on('preCheck', preCheckHandler);
loader.on('checked', postCheckHandler);

loader.syncr.connect(function (err, collection) {
  if (err) { return console.error(err); }

  collection.ensureIndex({ 'content.json.title_id': 1, '_platform': 1 }, { sparse: true, unique: true, dropDups: true }, function (err) {
    if (err) { return console.error(err); }

    loader.sync(function (o) {
      status.state = 'synchronized';
      loader.removeListener('preCheck', preCheckHandler);
      loader.removeListener('checked', postCheckHandler);
      update();
    });
  });
});

module.exports = function (app) {
  app.get('/castor/status', function (req, res) {
    res.status(200).send(status);
  });
};
