'use strict';

const { MongoClient } = require('mongodb');

const mongo = {};

mongo.ObjectID = require('mongodb').ObjectId;

mongo.connect = async function connect(mongoUrl, options = {}) {
  if (mongo.db) { return mongo.db; }

  const client = new MongoClient(mongoUrl, options);

  await client.connect();

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
