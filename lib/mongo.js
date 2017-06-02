'use strict';

var MongoClient  = require('mongodb').MongoClient;
var mongo = {};

mongo.connect = function (mongoUrl, callback) {
  if (mongo.db) { return callback(null, mongo.db); }

  MongoClient.connect(mongoUrl, function (err, database) {
    mongo.db = database;
    callback(err, database);
  });
};

mongo.getCollection = function (name) {
  return mongo.db && mongo.db.collection(name);
};

mongo.disconnect = function (callback) {
  if (!mongo.db) { return callback(null); }
  mongo.db.close(callback);
};

module.exports = mongo;
