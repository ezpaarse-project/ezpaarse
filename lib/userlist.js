/* eslint no-sync: 0 */
'use strict';

/**
 * UserList provides functions to handle credential.json
 */

var fs     = require('graceful-fs');
var path   = require('path');
var crypto = require('crypto');
var mongo  = require('./mongo.js');

function userList() {
  var list = {
    file:  path.join(__dirname, '../credentials.json'),
    users: []
  };
  var collection;

  list.init = function (callback) {
    if (typeof callback !== 'function') { callback = function () {}; }

    mongo.connect(function (err, database) {
      if (database) { collection = database.collection('users'); }

      fs.readFile(list.file, function (err, content) {
        if (err) { return callback(); }

        try {
          list.users = JSON.parse(content);
        } catch (e) {
          list.users = {};
        }

        var firstUsername = Object.keys(list.users)[0];

        if (typeof list.users[firstUsername] == 'string') {
          var userlist  = [];
          var adminFlag = true;

          for (var name in list.users) {
            userlist.push({
              username: name,
              password: list.users[name],
              createdAt: new Date(),
              group: adminFlag ? 'admin' : 'user'
            });
            adminFlag = false;
          }
          list.users = userlist;
          if (!collection) { list.save(); }
        }

        if (!collection) { return callback(); }

        var i = 0;
        (function insertUser() {
          var user = list.users[i++];
          if (!user) {
            fs.unlink(list.file);
            return callback();
          }

          list.add(user, insertUser);
        })();
      });
    });

    return this;
  };

  /**
   * get the number of users
   * @return {Integer} userlist length
   */
  list.length = function (callback) {
    if (collection) {
      return collection.count(callback);
    }

    callback(null, this.users.length);
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
    if (collection) {
      return collection.find({}, { password: 0 }).toArray(callback);
    }

    callback(null, this.users.map(function (user) {
      var copy = {};
      for (var prop in user) {
        if (prop != 'password') { copy[prop] = user[prop]; }
      }
      return copy;
    }));
  };

  /**
   * get a user with a given name
   * @param  {String} username
   * @return {Object} the user if found, otherwise null
   */
  list.get = function (username, callback) {
    if (collection) {
      return collection.findOne({ username: username }, callback);
    }

    for (var i = this.users.length - 1; i >= 0; i--) {
      if (this.users[i].username == username) {
        var copy = {};
        for (var prop in this.users[i]) {
          copy[prop] = this.users[i][prop];
        }
        return callback(null, copy);
      }
    }

    callback(null);
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

    if (typeof value == 'function') { callback = value; }

    if (collection) {
      var change = {};
      if (typeof field == 'object') {
        change = field;
      } else {
        change[field] = value;
      }
      return collection.findOneAndUpdate(
        { username: username },
        { $set: change },
        { returnOriginal: false },
        function (err, result) {
          callback(err, result.value);
        }
      );
    }

    for (var i = this.users.length - 1; i >= 0; i--) {
      var user = this.users[i];
      if (user.username == username) {

        if (typeof field == 'object') {
          for (var p in field) { user[p] = field[p]; }
        } else {
          user[field] = value;
        }

        this.save();
        return callback(null, user);
      }
    }
    callback();
  };

  /**
   * Save the userlist on disk
   */
  list.save = function () {
    if (!collection) {
      fs.writeFileSync(this.file, JSON.stringify(this.users, null, 2));
    }
  };

  /**
   * add a user to the list and update credentials.json
   * @param {String} username
   * @param {Object} attributes password, group...
   * @return {Boolean} true if success, otherwise false
   */
  list.add = function (user, callback) {
    var perform = function () {
      if (collection) {
        collection.findOne({ username: user.username }, function (err, existingUser) {
          if (err) { return callback(err); }
          if (existingUser) { return callback(new Error('username already exists')); }

          collection.insert(user, function (err) {
            callback(err, user);
          });
        });
      } else {
        list.get(user.username, function (err, existingUser) {
          if (err) { return callback(err); }
          if (existingUser) { return callback(new Error('username already exists')); }

          list.users.push(user);
          list.save();
          callback(null, user);
        });
      }
    };

    if (user.group) {
      perform();
    } else {
      list.length(function (err, length) {
        if (err) { return callback(err); }
        user.group = length === 0 ? 'admin' : 'user';
        perform();
      });
    }
  };

  /**
   * remove a user from the list and update credentials.json
   * @param {String} username
   * @return {Object} the deleted user if success, otherwise null
   */
  list.remove = function (username, callback) {
    if (collection) {
      collection.remove({ username: username }, callback);
    } else {
      for (var i = this.users.length - 1; i >= 0; i--) {
        if (this.users[i].username == username) {
          var user = this.users.splice(i, 1);
          this.save();
          return callback(null, user);
        }
      }
      return null;
    }
  };

  return list;
}

module.exports = userList().init();
