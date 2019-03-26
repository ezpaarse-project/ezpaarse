'use strict';

const mongo  = require('./mongo.js');
let treatment = {};

treatment.insert = function (userId, jobId) {
  const treatmentData = {
    userId,
    jobId,
    createdAt: new Date(),
    status: 'started'
  };
  return mongo.getCollection('treatments').insertOne(treatmentData);
};

treatment.update = function (jobId, status) {
  return mongo.getCollection('treatments').updateOne({ jobId }, { $set: { status } });
};

treatment.findAllByUser = function (userId, callback) {
  mongo.getCollection('treatments').find({ userId }).toArray(callback);
};

treatment.findAll = function (callback) {
  mongo.getCollection('treatments').find({}).sort({ createdAt: -1 }).toArray(callback);
};

module.exports = treatment;