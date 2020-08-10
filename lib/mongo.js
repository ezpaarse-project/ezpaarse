'use strict';

var MongoClient  = require('mongodb').MongoClient;
var mongo = {};

mongo.ObjectID = require('mongodb').ObjectID;

mongo.connect = async function (mongoUrl) {
  if (mongo.db) { return mongo.db; }

  const client = await MongoClient.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  mongo.client = client;
  mongo.db = client && client.db();
  return mongo.db;
};

mongo.serverStatus = function () {
  return mongo.db.admin().serverStatus();
};

mongo.getCollection = function (name) {
  return mongo.db && mongo.db.collection(name);
};

mongo.disconnect = function () {
  if (!mongo.client) { return; }
  return mongo.client.close();
};

module.exports = mongo;
