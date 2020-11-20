'use strict';

const mongo  = require('./mongo');

const collection = 'config';

module.exports = {
  update: (id, data) => mongo.getCollection(collection).findOneAndUpdate({
    _id: id
  }, {
    $set: { data }
  }, {
    upsert: true,
    returnNewDocument: true
  }),

  getConfig: (config) => mongo.getCollection(collection).findOne({ _id: config }),
};