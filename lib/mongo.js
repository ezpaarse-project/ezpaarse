'use strict';

var config = require('./config.js');
var MongoClient  = require('mongodb').MongoClient;

var mongo = {};

mongo.connect = function (callback) {
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
