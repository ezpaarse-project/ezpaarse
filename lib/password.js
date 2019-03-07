'use strict';

const mongo  = require('./mongo.js');
const uuidv4 = require('uuid/v4');
let pwd = {};

pwd.genereateUniqId = function (username, callback) {
  const uuid = uuidv4();
  const expirationDate = Date.now() + (60 * 60 * 1000);
  /* eslint-disable-next-line */
  mongo.getCollection('users').findOneAndUpdate({ username: username }, { $set: { uuid, expiration_date: expirationDate } }, { upsert: false }, function (err, result) {
    if (err) return callback(err);

    return callback(err, result, uuid);
  });
};

pwd.getUser = function (uuid, callback) {
  mongo.getCollection('users').findOne({ uuid }, callback);
};

module.exports = pwd;