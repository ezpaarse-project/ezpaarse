'use strict';

/**
 * UserList provides functions to handle credential.json
 */

var fs     = require('graceful-fs');
var path   = require('path');
var crypto = require('crypto');

function userList() {
  var list = {
    file:  path.join(__dirname, '../credentials.json'),
    users: []
  };

  list.init = function () {
    if (fs.existsSync(list.file)) {
      try {
        list.users = JSON.parse(fs.readFileSync(list.file));
      } catch (e) {}
    } else {
      list.save();
    }

    var firstUsername = Object.keys(list.users)[0];
    if (firstUsername && typeof list.users[firstUsername] == 'string') {
      var userlist  = [];
      var adminFlag = true;

      for (var name in list.users) {
        userlist.push({
          username: name,
          password: list.users[name],
          group: adminFlag ? 'admin' : 'user'
        });
        adminFlag   = false;
      }
      list.users = userlist;
      list.save();
    }

    return this;
  };

  /**
   * get the number of users
   * @return {Integer} userlist length
   */
  list.length = function () {
    return this.users.length;
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
  list.getAll = function () {
    return this.users.map(function (user) {
      var copy = {};
      for (var prop in user) {
        if (prop != 'password') { copy[prop] = user[prop]; }
      }
      return copy;
    });
  };

  /**
   * get a user with a given name
   * @param  {String} username
   * @return {Object} the user if found, otherwise null
   */
  list.get = function (username) {
    for (var i = this.users.length - 1; i >= 0; i--) {
      if (this.users[i].username == username) {
        return this.users[i];
      }
    }
    return null;
  };

  /**
   * set a user with a given name
   * @param  {String} username
   * @return {Object} field  field to change
   * @return {Object} value  new value of the field
   * @return {Object} the user if found, otherwise null
   */
  list.set = function (username, field, value) {
    if (!username || !field) { return false; }

    for (var i = this.users.length - 1; i >= 0; i--) {
      if (this.users[i].username == username) {
        this.users[i][field] = value;
        this.save();
        return true;
      }
    }
    return false;
  };

  /**
   * Save the userlist on disk
   */
  list.save = function () {
    fs.writeFileSync(this.file, JSON.stringify(this.users, null, 2));
  };

  /**
   * add a user to the list and update credentials.json
   * @param {String} username
   * @param {Object} attributes password, group...
   * @return {Boolean} true if success, otherwise false
   */
  list.add = function (user) {
    if (!user.group) {
      user.group = this.users.length === 0 ? 'admin' : 'user';
    }
    if (!this.get(user.username)) {
      this.users.push(user);
      this.save();
      return user;
    }
    return null;
  };

  /**
   * remove a user from the list and update credentials.json
   * @param {String} username
   * @return {Object} the deleted user if success, otherwise null
   */
  list.remove = function (username) {
    for (var i = this.users.length - 1; i >= 0; i--) {
      if (this.users[i].username == username) {
        var user = this.users.splice(i, 1);
        this.save();
        return user;
      }
    }
    return null;
  };

  return list;
}

module.exports = userList().init();
