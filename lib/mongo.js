'use strict';

var MongoClient  = require('mongodb').MongoClient;
var mongo = {};

mongo.connect = function (mongoUrl, callback) {
  if (mongo.db) { return callback(null, mongo.db); }

  MongoClient.connect(mongoUrl, { useNewUrlParser: true }, function (err, client) {
    mongo.client = client;
    mongo.db = client && client.db();
    callback(err, mongo.db);
  });
};

mongo.getCollection = function (name) {
  return mongo.db && mongo.db.collection(name);
};

mongo.disconnect = function (callback) {
  if (!mongo.client) { return callback(null); }
  mongo.client.close(callback);
};

module.exports = mongo;
