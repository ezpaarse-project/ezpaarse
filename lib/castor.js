/* eslint no-console: 0 */
'use strict';

var path      = require('path');
var crypto    = require('crypto');
var os        = require('os');
var Loader    = require('castor-load');
var csvLoader = require('castor-load-csv')({ separator: '\t' });
var io        = require('./socketio.js').io;
var config    = require('./config.js');

var options = {
  connexionURI: config.EZPAARSE_MONGO_URL,
  collectionName: 'pkbs',
  ignore: ['**/*.miss.txt', '**/*.json', '**/*.csv', '**/*.js', '.git', '.lib'],
  writeConcern: 0,
  concurrency: os.cpus().length,
  modifier: function (doc) {
    var splitedPath = doc.location.split(path.sep);
    var index = splitedPath.indexOf('platforms');

    if (index >= 0 && ++index < splitedPath.length) {
      var partialPath = splitedPath.slice(index).join(path.sep);
      doc.fid         = crypto.createHash('sha1').update(partialPath).digest('hex');
      doc._platform   = splitedPath[index];
    }
  }
};

var loader = new Loader(path.join(__dirname, '../platforms'), options);
loader.use('**/*.txt', csvLoader);

var status = {
  state: 'synchronizing',
  remaining: []
};

var throttleID;

var update = function (state) {
  if (state)      { status.state = state; }
  if (throttleID) { clearTimeout(throttleID); }
  throttleID = setTimeout(function() {
    if (io()) { io().emit('castor:update', status); }
  }, 500);
};

loader.syncr.connect(function (err, collection) {
  if (err) {
    return update('unavailable');
  }

  var preProcessHandler = function (doc) {
    var index = status.remaining.indexOf(doc.filename);
    if (index === -1) {
      status.remaining.push(doc.filename);
    }
    update('synchronizing');
  };
  var postProcessHandler = function (err, doc) {
    var index = status.remaining.indexOf(doc.filename);
    if (index >= 0) {
      status.remaining.splice(index, 1);
    }
    update(status.remaining.length > 0 ? 'synchronizing' : 'synchronized');
  };
  update();

  loader.on('preCheck',   preProcessHandler);
  loader.on('preCancel',  preProcessHandler);
  loader.on('preDrop',    preProcessHandler);

  loader.on('checked',    postProcessHandler);
  loader.on('cancelled',  postProcessHandler);
  loader.on('added',      postProcessHandler);
  loader.on('changed',    postProcessHandler);
  loader.on('dropped',    postProcessHandler);

  var indexed = [
    { 'content.json.title_id': 1 },
    { 'content.json.print_identifier': 1 },
    { 'content.json.online_identifier': 1 },
    { 'content.json.doi': 1 }
  ];

  var i = 0;
  (function nextIndex() {
    var index = indexed[i++];
    if (!index) { return loader.sync(); }

    collection.ensureIndex(index, { sparse: true }, function (err) {
      if (err) { return console.error(err); }

      nextIndex();
    });
  })();
});

module.exports = function (app) {
  app.get('/castor/status', function (req, res) {
    res.status(200).send(status);
  });
};
