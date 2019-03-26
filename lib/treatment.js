'use strict';

const mongo  = require('./mongo.js');
let treatment = {};

treatment.insert = function (userId, jobId, callback) {
  const treatmentData = {
    userId,
    jobId,
    createdAt: new Date(),
  };
  mongo.getCollection('treatments').insertOne(treatmentData, (err) => {
    return callback(err, treatmentData);
  });
};

treatment.findAllByUser = function (userId, callback) {
  mongo.getCollection('treatments').find({ userId }).toArray(callback);
};

treatment.findAll = function (callback) {
  mongo.getCollection('treatments').find({}).sort({ createdAt: -1 }).toArray(callback);
};

module.exports = treatment;