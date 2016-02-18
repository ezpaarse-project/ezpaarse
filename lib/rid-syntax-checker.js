'use strict';

/*
* check validity of identifier
*/
var ridChecker = function () {
  var self = this;
  var DoNotCheckPattern = new RegExp('^#');
  var ISSNPattern = new RegExp('[0-9]{4}\\-[0-9]{3}([0-9Xx])?');
  var ISBNPattern = new RegExp('((978[-– ])?[0-9][0-9-– ]{10}[-– ][0-9xX])|((978)?[0-9]{9}[0-9])');
  var DOIPattern  = new RegExp('(10[.][0-9]{4,}[^\\s"/<>]*/[^\\s"<>]+)');
  var blocSep     = /[\- –]/g;

  /*
  * get controled issn from string
  * default is with '-' on char 5
  */
  self.getISSN = function (rid) {
    var issn = rid;
    var product, rest, calculatedKey;
    var result = {
      'rid': rid,        // identifier value
      'isValid': false, // true if control character match
      'checkable': true // ignore control if rid begins with DoNotCheckPattern
    };

    if (DoNotCheckPattern.test(issn)) {
      result.checkable = false;
    } else if (ISSNPattern.test(issn)) {
      if (issn.length === 9) {
        product =  issn.substr(0, 1) * 8;
        product += issn.substr(1, 1) * 7;
        product += issn.substr(2, 1) * 6;
        product += issn.substr(3, 1) * 5;
        // char 5 is - and ignored
        product += issn.substr(5, 1) * 4;
        product += issn.substr(6, 1) * 3;
        product += issn.substr(7, 1) * 2;
        rest = product % 11;
        calculatedKey = 11 - rest;
        if (calculatedKey === 11) {
          calculatedKey = 0;
        } else if (calculatedKey === 10) {
          calculatedKey = 'X';
        }
        result.calculatedKey = calculatedKey.toString();
        result.control = issn.substr(8, 1).toUpperCase();
      } else if (issn.length === 8 && issn.substr(4, 1) !== '-') {
        product =  issn.substr(0, 1) * 8;
        product += issn.substr(1, 1) * 7;
        product += issn.substr(2, 1) * 6;
        product += issn.substr(3, 1) * 5;
        product += issn.substr(4, 1) * 4;
        product += issn.substr(5, 1) * 3;
        product += issn.substr(6, 1) * 2;
        rest = product % 11;
        calculatedKey = 11 - rest;
        if (calculatedKey === 11) {
          calculatedKey = 0;
        } else if (calculatedKey === 10) {
          calculatedKey = 'X';
        }
        result.calculatedKey = calculatedKey.toString();
        result.control = issn.substr(7, 1).toUpperCase();
      }
      if (result.calculatedKey === result.control) {
        result.isValid = true;
      } else {
        result.isValid = false;
      }
    } else if (issn === 'N/A' || issn === 'en cours') {
      // issn is not available
      result.checkable = false;
    }
    return result;
  };

  /*
  * get controled issn from string
  * default is with '-' on char 5
  */

  self.getISBN = function (rid) {
    var product, rest, calculatedKey;

    var isbn = rid.replace(blocSep, '');
    var result = {
      'rid': rid,        // identifier value
      'isValid': false, // true if control character match
      'checkable': true // ignore control if rid begins with DoNotCheckPattern
    };

    if (DoNotCheckPattern.test(rid)) {
      result.checkable = false;
    } else if (ISBNPattern.test(rid)) {
      if (isbn.length === 10) {
        product =  isbn.substr(0, 1) * 10;
        product += isbn.substr(1, 1) * 9;
        product += isbn.substr(2, 1) * 8;
        product += isbn.substr(3, 1) * 7;
        product += isbn.substr(4, 1) * 6;
        product += isbn.substr(5, 1) * 5;
        product += isbn.substr(6, 1) * 4;
        product += isbn.substr(7, 1) * 3;
        product += isbn.substr(8, 1) * 2;
        rest = product % 11;
        calculatedKey = 11 - rest;
        if (rest === 0) {
          calculatedKey = 0;
        } else if (rest === 1) {
          calculatedKey = 'X';
        }
        result.control = isbn.substr(9, 1).toUpperCase();
        result.calculatedKey = calculatedKey.toString();
        if (result.control === result.calculatedKey) { result.isValid = true; }
        else { result.isValid = false; }
      } else if (isbn.length === 13) {
        product =  isbn.substr(0, 1) * 1;
        product += isbn.substr(1, 1) * 3;
        product += isbn.substr(2, 1) * 1;
        product += isbn.substr(3, 1) * 3;
        product += isbn.substr(4, 1) * 1;
        product += isbn.substr(5, 1) * 3;
        product += isbn.substr(6, 1) * 1;
        product += isbn.substr(7, 1) * 3;
        product += isbn.substr(8, 1) * 1;
        product += isbn.substr(9, 1) * 3;
        product += isbn.substr(10, 1) * 1;
        product += isbn.substr(11, 1) * 3;
        calculatedKey = (10 - (product % 10)) % 10;
        result.control = isbn.substr(12, 1).toUpperCase();
        result.calculatedKey = calculatedKey.toString();
        if (result.control === result.calculatedKey) { result.isValid = true; }
        else { result.isValid = false; }
      } else {
        result.isValid = false;
      }
    } else {
      result.isValid = false;
    }
    return result;
  };

  self.getDOI = function (rid) {
    var result = {
      'rid': rid,        // identifier value
      'isValid': false, // true if control character match
      'checkable': true // ignore control if rid begins with DoNotCheckPattern
    };

    if (DoNotCheckPattern.test(rid)) {
      result.checkable = false;
    } else if (DOIPattern.test(rid)) {
      result.isValid = true;
    } else {
      result.isValid = false;
    }
    return result;
  };
};

module.exports = new ridChecker();