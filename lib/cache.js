'use strict';

var mongo = require('./mongo');

function cache(collectionName) {
  var cacheObject = {};

  var collection = mongo.db.collection(collectionName);

  if (!collection) { return null; }

  function createIndexes(ttl, callback) {

    collection.ensureIndex({ id: 1 }, { unique: 1 }, function (err) {
      if (err) { return callback(err); }

      collection.indexes(function (err, indexes) {
        if (err) { return callback(err); }

        var dateIndex;
        if (indexes) {
          for (let i in indexes) {
            if (indexes[i].name === 'date_1') { dateIndex = indexes[i]; }
          }
        }

        if (dateIndex && dateIndex.expireAfterSeconds == ttl) {
          return callback();
        }

        if (!dateIndex) {
          return collection.ensureIndex({ date: 1 }, { expireAfterSeconds: ttl }, callback);
        }

        collection.dropIndex({ date: 1 }, function (err) {
          if (err) { return callback(err); }

          collection.ensureIndex({ date: 1 }, { expireAfterSeconds: ttl }, callback);
        });
      });
    });
  }

  /**
   * Create an index on "id" and a ttl on "date"
   * @param  {Integer} ttl time to live in seconds
   */
  cacheObject.checkIndexes = function (ttl, callback) {
    createIndexes(ttl, function (err) {
      if (err) { return callback(err); }

      var threshold = new Date(Date.now() - ttl * 1000);
      collection.remove({ date: { $lt: threshold } }, { multi: true }, callback);
    });
  };

  /**
   * Cache a document
   * @param {String}  id
   * @param {Object}  doc
   */
  cacheObject.set = function (id, doc, callback) {
    collection.updateOne({ id: id },
      {
        date: new Date(),
        id: id,
        data: doc
      },
    { upsert: true }, callback);
  };

  /**
   * Get cached document
   * @param {String}   id
   * @param {Function} callback(err, document)
   */
  cacheObject.get = function (id, callback) {
    collection.findOne({ 'id': id }, { data: 1 }, function (err, cachedDoc) {
      if (err || !cachedDoc) { return callback(err); }

      callback(null, cachedDoc.data);
    });
  };

  return cacheObject;
}

module.exports = cache;
