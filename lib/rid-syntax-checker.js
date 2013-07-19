/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';



/*
* check validity of identifier
*/
exports.ISSN = function (issn) {
  console.log("Checking ISSN " + issn);
  var P, R, Cle, control;
  if (issn.length === 9) {
    P = issn.substr(0, 1) * 8;
    P += issn.substr(1, 1) * 7;
    P += issn.substr(2, 1) * 6;
    P += issn.substr(3, 1) * 5;
    // char 5 is - and ignored et
    P += issn.substr(5, 1) * 4;
    P += issn.substr(6, 1) * 3;
    P += issn.substr(7, 1) * 2;
    R = P % 11;
    Cle = 11 - R;
    if (Cle === 11) {
      Cle = 0;
    } else if (Cle === 10) {
      Cle = "X";
    }
    control = issn.substr(8, 1);
    console.log(issn,control, Cle);
    if (Cle.toString() === control) { return true; }
    else { return false; }
  } else if (issn.length === 8) {
    P = issn.substr(0, 1) * 8;
    P += issn.substr(1, 1) * 7;
    P += issn.substr(2, 1) * 6;
    P += issn.substr(3, 1) * 5;
    P += issn.substr(4, 1) * 4;
    P += issn.substr(5, 1) * 3;
    P += issn.substr(6, 1) * 2;
    R = P % 11;
    Cle = 11 - R;
    if (Cle === 11) {
      Cle = 0;
    } else if (Cle === 10) {
      Cle = "X";
    }
    control = issn.substr(7, 1);
    console.log(issn,control, Cle);
    if (Cle.toString() === control) { return true; }
    else { return false; }
    return true;
  } else {
    return false;
  }
};

exports.ISBN = function (id) {
    console.log("Checking ISBN " + id);
    return true
};

exports.DOI = function (id) {
    console.log("Checking DOI " + id);
    return true
};



