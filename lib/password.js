'use strict';

const mongo  = require('./mongo.js');
const { v4: uuidv4 } = require('uuid');
let pwd = {};

pwd.genereateUniqId = function (username, callback) {
  const uuid = uuidv4();
  const expirationDate = Date.now() + (60 * 60 * 1000);
  /* eslint-disable-next-line */
  mongo.getCollection('users').findOneAndUpdate(
    { username: username },
    { $set: { uuid, expirationDate: expirationDate } },
    { upsert: false }
  )
    .then((v) => callback(undefined, v, uuid))
    .catch((e) => callback(e, undefined, undefined));
};

pwd.getUser = function (uuid, callback) {
  mongo.getCollection('users').findOne({ uuid })
    .then((v) => callback(undefined, v))
    .catch((e) => callback(e, undefined));
};

module.exports = pwd;