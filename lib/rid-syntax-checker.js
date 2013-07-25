/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';


/*
* check validity of identifier
*/
var ridChecker = function (rid) {
  var self = this;

  /*
  * get controled issn from string
  * default is with '-' on char 5
  */
  self.getISSN = function (rid) {
    var issn = rid;
    var product, rest, calculatedKey, result = "";

    if (issn.match(/[0-9\-X]+/)) {
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
          calculatedKey = "X";
        }
        result = issn.substr(0, 8) +  calculatedKey;
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
          calculatedKey = "X";
        }
        result = issn.substr(0, 4) + '-' + issn.substr(4, 3) + calculatedKey;
      }
    }
    return result;
  };

  self.checkISSN = function (rid) {
    var issn = rid;
    var controled = self.getISSN(issn);
    if (controled  === issn) { return true; }
    else { return false; }
  }

  self.checkISBN = function (rid) {
    console.log("Checking ISBN " + rid);
    return true;
  };

  self.checkDOI = function (rid) {
    var DOIpattern = '(10[.][0-9]{4,}[^\\s"/<>]*/[^\\s"<>]+)';
    if (rid.match(DOIpattern)) {
      return true;
    } else {
      return false;
    }
  };
}
module.exports = new ridChecker();



