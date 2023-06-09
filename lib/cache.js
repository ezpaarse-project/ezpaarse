'use strict';

const mongo = require('./mongo');

function cache(collectionName) {

  const collection = mongo.db.collection(collectionName);

  if (!collection) { return null; }

  let cacheObject = {
    collection
  };

  function createIndexes(ttl, callback) {
    collection.createIndex({ id: 1 }, { unique: 1 })
      .then(() => collection.indexes())
      .then((indexes) => {
        const index = indexes.find(index => index.name === 'date_1');
        if (index && index.expireAfterSeconds == ttl) {
          return callback();
        }

        if (!index) {
          return collection.createIndex({ date: 1 }, { expireAfterSeconds: ttl })
            .then((v) => callback(undefined, v));
        }

        return collection.dropIndex({ date: 1 })
          .then(() => collection.createIndex({ date: 1 }, { expireAfterSeconds: ttl }))
          .then((v) => callback(undefined, v));
      })
      .catch((err) => callback(err, undefined));
  }

  /**
   * Create an index on "id" and a ttl on "date"
   * @param  {Integer} ttl time to live in seconds
   */
  cacheObject.checkIndexes = function (ttl, callback) {
    createIndexes(ttl, (err) => {
      if (err) { return callback(err); }

      var threshold = new Date(Date.now() - ttl * 1000);
      collection.deleteMany({ date: { $lt: threshold } }, { multi: true })
        .then((v) => callback(undefined, v))
        .catch((err) => callback(err, undefined));
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
    ).then((v) => callback(undefined, v))
      .catch((err) => callback(err, undefined));
  };

  /**
   * Get cached document
   * @param {String}   id
   * @param {Function} callback(err, document)
   */
  cacheObject.get = function (id, callback) {
    collection.findOne({ 'id': id }, { data: 1 })
      .then((cachedDoc) => {
        if (!cachedDoc) { return callback(undefined, undefined); }

        callback(undefined, cachedDoc.data);
      })
      .catch((err) => callback(err, undefined));
  };

  return cacheObject;
}

module.exports = cache;
