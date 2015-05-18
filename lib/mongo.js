'use strict';

var config = require('./config.js');
var MongoClient  = require('mongodb').MongoClient;

var mongo = {};

mongo.connect = function (callback) {
  if (mongo.db) { return callback(null, mongo.db); }

  var address = process.env.MONGODB_PORT_27017_TCP_ADDR;
  var port    = process.env.MONGODB_PORT_27017_TCP_PORT;

  if (address && port) {
    config.EZPAARSE_MONGO_URL = 'mongodb://' + address + ':' + port + '/ezpaarse';
  }

  MongoClient.connect(config.EZPAARSE_MONGO_URL, function (err, database) {
    mongo.db = database;
    callback(err, database);
  });
};

mongo.disconnect = function (callback) {
  if (mongo.db) {
    mongo.db.close(callback);
  } else {
    callback(null);
  }
};

module.exports = mongo;
