'use strict';

/**
 * UserList provides functions to handle credential.json
 */

var fs   = require('graceful-fs');
var path = require('path');

function UserList() {
  this.file  = path.join(__dirname, '../credentials.json');
  this.users = [];

  if (fs.existsSync(this.file)) {
    try {
      this.users = JSON.parse(fs.readFileSync(this.file));
    } catch (e) {}
  } else {
    fs.writeFileSync(this.file, JSON.stringify(this.users, null, 2));
  }

  var firstUsername = Object.keys(this.users)[0];
  if (firstUsername && typeof this.users[firstUsername] == 'string') {
    var userlist  = [];
    var adminFlag = true;

    for (var name in this.users) {
      userlist.push({
        username: name,
        password: this.users[name],
        group: adminFlag ? 'admin' : 'user'
      });
      adminFlag   = false;
    }
    this.users = userlist;
    fs.writeFileSync(this.file, JSON.stringify(this.users, null, 2));
  }
}
module.exports = new UserList();

/**
 * get the number of users
 * @return {Integer} userlist length
 */
UserList.prototype.length = function () {
  return this.users.length;
};

/**
 * get all users
 * @return {Array} users
 */
UserList.prototype.getAll = function () {
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
UserList.prototype.get = function (username) {
  for (var i = this.users.length - 1; i >= 0; i--) {
    if (this.users[i].username == username) {
      return this.users[i];
    }
  }
  return null;
};

/**
 * add a user to the list and update credentials.json
 * @param {String} username
 * @param {Object} attributes password, group...
 * @return {Boolean} true if success, otherwise false
 */
UserList.prototype.add = function (user) {
  if (!user.group) {
    user.group = this.users.length === 0 ? 'admin' : 'user';
  }
  if (!this.get(user.username)) {
    this.users.push(user);
    fs.writeFileSync(this.file, JSON.stringify(this.users, null, 2));
    return user;
  }
  return null;
};

/**
 * remove a user from the list and update credentials.json
 * @param {String} username
 * @return {Object} the deleted user if success, otherwise null
 */
UserList.prototype.remove = function (username) {
  for (var i = this.users.length - 1; i >= 0; i--) {
    if (this.users[i].username == username) {
      var user = this.users.splice(i, 1);
      fs.writeFileSync(this.file, JSON.stringify(this.users, null, 2));
      return user;
    }
  }
  return null;
};
