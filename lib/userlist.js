'use strict';

/**
 * UserList provides functions to handle users
 */

let crypto = require('crypto');
let mongo  = require('./mongo.js');
let list   = {};

/**
 * get the number of users
 * @return {Integer} userlist length
 */
list.length = function (callback) {
  mongo.getCollection('users').count(callback);
};

/**
 * Crypt a password
 * @return {String} userid    user mail
 * @return {String} password  user password
 * @return {String} crypted password
 */
list.crypt = function (userid, password) {
  return crypto.createHmac('sha1', 'ezgreatpwd0968')
                .update(userid + password)
                .digest('hex');
};

/**
 * get all users
 * @return {Array} users
 */
list.getAll = function (callback) {
  mongo.getCollection('users').find({}, { password: 0 }).toArray(callback);
};

/**
 * get a user with a given name
 * @param  {String} username
 * @return {Object} the user if found, otherwise null
 */
list.get = function (username, callback) {
  mongo.getCollection('users').findOne({ username: username }, callback);
};

/**
 * set a user with a given name
 * @param  {String} username
 * @return {Object} field  field to change OR object of changes
 * @return {Object} value  new value of the field OR callback
 * @return {Object} the user if found, otherwise null
 */
list.set = function (username, field, value, callback) {
  if (!username || !field) { return callback(new Error('missing required parameters')); }

  if (typeof value === 'function') { callback = value; }

  let change = {};
  if (typeof field === 'object') {
    change = field;
  } else {
    change[field] = value;
  }

  mongo.getCollection('users').findOneAndUpdate(
    { username: username },
    { $set: change },
    { returnOriginal: false },
    function (err, result) {
      callback(err, result.value);
    }
  );
};

/**
 * add a user to the list
 * @param {String} username
 * @param {Object} attributes password, group...
 * @return {Boolean} true if success, otherwise false
 */
list.add = function (user, callback) {
  list.length(function (err, length) {
    if (err) { return callback(err); }
    if (length === 0) { user.group = 'admin'; }

    mongo.getCollection('users').findOne({ username: user.username }, function (err, existingUser) {
      if (err) { return callback(err); }
      if (existingUser) { return callback(new Error('username already exists')); }

      mongo.getCollection('users').insert(user, function (err) {
        callback(err, user);
      });
    });
  });
};

/**
 * remove a user from the list
 * @param {String} username
 * @return {Object} the deleted user if success, otherwise null
 */
list.remove = function (username, callback) {
  mongo.getCollection('users').remove({ username: username }, callback);
};

module.exports = list;
