'use strict';

let ObjectID = require('mongodb').ObjectID;
let mongo  = require('./mongo.js');

module.exports = {
  getAll (callback) {
    mongo.getCollection('settings').find({}).toArray(callback);
  },

  insert (settings, callback) {
    const { fullName } = settings;

    mongo.getCollection('settings').findOne({ fullName }).then(result => {
      if (result) {
        return callback(new Error('already_exists'));
      }
      mongo.getCollection('settings').insertOne(settings, callback);
    }).catch(callback);
  },

  updateOne (id, settings, callback) {
    if (!ObjectID.isValid(id)) {
      return callback(new Error('id_invalid'));
    }

    const filter = { _id: new ObjectID(id) };
    mongo.getCollection('settings').findOneAndReplace(filter, settings, callback);
  },

  delete (id, callback) {
    if (!ObjectID.isValid(id)) {
      return callback(new Error('id_invalid'));
    }

    mongo.getCollection('settings').deleteOne({ _id: new ObjectID(id) }, callback);
  }
};
