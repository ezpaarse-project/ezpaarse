'use strict';

const mongo = require('./mongo');

function cache(collectionName) {

  const collection = mongo.db.collection(collectionName);

  if (!collection) { return null; }

  let cacheObject = {
    collection
  };

  function createIndexes(ttl, callback) {

    collection.createIndex({ id: 1 }, { unique: 1 }, (err) => {
      if (err) { return callback(err); }

      collection.indexes((err, indexes) => {
        if (err) { return callback(err); }

        const index = indexes.find(index => index.name === 'date_1');

        if (index && index.expireAfterSeconds == ttl) {
          return callback();
        }

        if (!index) {
          return collection.createIndex({ date: 1 }, { expireAfterSeconds: ttl }, callback);
        }

        collection.dropIndex({ date: 1 }, (err) => {
          if (err) { return callback(err); }

          collection.createIndex({ date: 1 }, { expireAfterSeconds: ttl }, callback);
        });
      });
    });
  }

  /**
   * Create an index on "id" and a ttl on "date"
   * @param  {Integer} ttl time to live in seconds
   */
  cacheObject.checkIndexes = function (ttl, callback) {
    createIndexes(ttl, (err) => {
      if (err) { return callback(err); }

      var threshold = new Date(Date.now() - ttl * 1000);
      collection.deleteMany({ date: { $lt: threshold } }, { multi: true }, callback);
    });
  };

  /**
   * Cache a document
   * @param {String}  id
   * @param {Object}  doc
   */
  cacheObject.set = function (id, doc, callback) {
    collection.findOneAndReplace({ id: id },
      {
        date: new Date(),
        id: id,
        data: doc
      },
      {
        upsert: true
      },
      callback
    );
  };

  /**
   * Get cached document
   * @param {String}   id
   * @param {Function} callback(err, document)
   */
  cacheObject.get = function (id, callback) {
    collection.findOne({ 'id': id }, { data: 1 }, (err, cachedDoc) => {
      if (err || !cachedDoc) { return callback(err); }

      callback(null, cachedDoc.data);
    });
  };

  return cacheObject;
}

module.exports = cache;
