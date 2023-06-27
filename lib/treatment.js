'use strict';

const mongo  = require('./mongo.js');

module.exports = {
  insert (userId, jobId) {
    const treatmentData = {
      userId,
      jobId,
      createdAt: new Date(),
      status: 'started'
    };
    return mongo.getCollection('treatments').insertOne(treatmentData);
  },

  update (jobId, status) {
    return mongo.getCollection('treatments').updateOne({ jobId }, { $set: { status } });
  },

  findAllByUser (userId) {
    return mongo.getCollection('treatments').find({ userId }).sort({ createdAt: -1 }).toArray();
  },

  findAll () {
    return mongo.getCollection('treatments').find({}).sort({ createdAt: -1 }).toArray();
  }
};