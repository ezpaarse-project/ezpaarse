'use strict';

const mongo = require('./mongo');

exports.createIndex = async function (ttl) {
  const collection = mongo.db.collection('treatments');
  await collection.createIndex({ jobId: 1 }, { unique: 1 });

  const indexes = await collection.indexes();
  const index = indexes.find(index => index.name === 'createdAt_1');

  if (index && index.expireAfterSeconds === ttl) { return; }

  if (!index) {
    await collection.createIndex({ createdAt: 1 }, { expireAfterSeconds: ttl });
  }

  await collection.dropIndex({ createdAt: 1 });
  return collection.createIndex({ createdAt: 1 }, { expireAfterSeconds: ttl });
};
