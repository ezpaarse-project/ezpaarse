'use strict';

let ObjectID = require('mongodb').ObjectID;
let mongo  = require('./mongo.js');
let cps   = {};

cps.getAll = function (callback) {
  mongo.getCollection('settings').find({}).toArray(callback);
};

cps.insert = function (settings, callback) {
  /* eslint-disable-next-line */
  mongo.getCollection('settings').findOne({ fullName: settings.fullName }, { limit: 1 }).then(result => {
    if (result) return callback(new Error('already_exists'));
    if (!result) mongo.getCollection('settings').insertOne({ settings }, callback);
  }).catch(err => callback(new Error('error')));
};

cps.updateOne = function (id, settings, callback) {
  if (!ObjectID.isValid(id)) return callback(new Error('id_invalid'));

  /* eslint-disable-next-line */
  mongo.getCollection('settings').findOneAndUpdate({ _id: new ObjectID(id) }, { $set: { settings } }, { upsert: false }, callback);
};

cps.delete = function (id, callback) {
  if (!ObjectID.isValid(id)) return callback(new Error('id_invalid'));

  mongo.getCollection('settings').deleteOne({ _id: new ObjectID(id) }, callback);
};

module.exports = cps;
