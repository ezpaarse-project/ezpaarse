'use strict';

const mongo = require('./mongo');

exports.createIndex = (ttl) => {
  const collection = mongo.db.collection('treatments');
  return collection.indexes((err, indexes) => {
    if (err) throw err;

    const index = indexes.find(index => index.name === 'createdAt_1');
    
    if (index) {
      return collection.dropIndex({ createdAt: 1 }, (err) => {
        if (err) throw err;

        return collection.createIndex({ createdAt: 1 }, { expireAfterSeconds: ttl }, (err) => {
          if (err) throw err;
        });
      });
    }
    
    return collection.createIndex({ createdAt: 1 }, { expireAfterSeconds: ttl }, (err) => {
      if (err) throw err;
    });
  });
};
