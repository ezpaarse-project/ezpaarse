'use strict';

const mongo = require('./mongo');
const ms = require('tmp-reaper/ms');

exports.createIndex = async function (ttl) {
  const realTtl = ms(ttl);

  const collection = mongo.db.collection('treatments');
  await collection.createIndex({ jobId: 1 }, { unique: 1 });

  const indexes = await collection.indexes();
  const index = indexes.find(index => index.name === 'createdAt_1');

  if (index && index.expireAfterSeconds === realTtl) { return; }

  if (!index) {
    await collection.createIndex({ createdAt: 1 }, { expireAfterSeconds: realTtl });
  }

  await collection.dropIndex({ createdAt: 1 });
  return collection.createIndex({ createdAt: 1 }, { expireAfterSeconds: realTtl });
};
