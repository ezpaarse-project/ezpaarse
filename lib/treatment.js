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

treatment.findAll = function (userId, callback) {
  mongo.getCollection('treatments').find({ userId }).toArray(callback);
};

module.exports = treatment;