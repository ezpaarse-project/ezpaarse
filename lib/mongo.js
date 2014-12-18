'use strict';

var config = require('./config.js');
var MongoClient  = require('mongodb').MongoClient;

var mongo = {};

mongo.connect = function (callback) {
  MongoClient.connect(config.EZPAARSE_MONGO_URL, function (err, database) {
    mongo.db = database;
    callback();
  });
};

module.exports = mongo;
