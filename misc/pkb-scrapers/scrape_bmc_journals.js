#!/usr/bin/env node

// Write on stdout the BMC journals PKB
// TODO ne distingue pas les titres springeropen et chemistrycentral
// possible (?) avec h3 > a.parent.parent > a.tooltip : attrib(href) permet identifieri http://www.springeropen.com ou http://www.chemistrycentral.com
// Write on stderr the progression
// Usage : ./scrape_bmc.js > bmc.pkb.csv

var async       = require('async');
var request     = require('request').defaults({'proxy':'http://proxyout.inist.fr:8080'});
//var request     = require('request').defaults({'proxy':'http://cache.univ-st-etienne.fr:3128'});
//var request     = require('request');
var cheerio     = require('cheerio');

var PkbRows     = require('./pkbrows.js');
var pkb         = new PkbRows();

// entry point: a big search on all springer journals
var journalsUrl = 'http://www.biomedcentral.com/journals';
// browse springer journals page by page
var pageUrl = 'http://www.biomedcentral.com/journals';

//console.log(pageUrl);

getNbPages(function (err, nbPages) {
  if (err) throw err;

  // loop on pages
  var i = 1;
  async.until(
    function () {
      if (i > nbPages) {
        console.error('Browsing page ' + i + '/' + nbPages);
        return true;
      } else {
        return false;
      }
    },
    function (callbackPage) {
      // extracte the journals url from the current page
      getPage(i++, function (err, journalsInPage) {
        if (err) return callbackPage(err);
        // loop on the journals url and extract information about journals
        async.mapLimit(
          journalsInPage,
          5, // number of download in parallel
          function (journalUrl, callbackJournal) {
            // extract info about the journal (title, eissn, pissn, pid, url)
            getJournalInfo(journalUrl, callbackJournal);
          },
          callbackPage
        );
      });

    },
    // called when all pages are browsed
    function (err) {
      if (err) throw err;
      pkb.writeCSV(process.stdout);
      console.error('BMC journals scraping finished.');
    }
  );
});
function getJournalInfo(journalUrl, cb) {
  var journalInfo = {};
  request(journalUrl, function (err, resp, body) {
    if (err) return cb(err, journalInfo);
    $ = cheerio.load(body);
// pas bon car parfois seulement des initiales ex AGP pour annals-general-psychiatry
//    journalInfo.title = $('div.branding-inner div.logo a img').attr('alt');
    journalInfo.title = $('title').text().trim();
    journalInfo.pid   = journalUrl.split('/').pop();
    journalInfo.issn = '';
    journalInfo.eissn = $('span#issn').text().replace('ISSN: ', '');
    journalInfo.piddomain   = journalInfo.pid;
//    journalInfo.url   = journalUrl;
    pkb.addRow(journalInfo);
//    console.log(journalInfo);
    cb(err, journalInfo);
  });
}

function getNbPages(cb) {
    cb(null, 1);
}

function getPage(pageIdx, cb) {
  var journalsInPage = [];
  request(pageUrl, function(err, resp, body) {
    if (err) return cb(err);
    $ = cheerio.load(body);
//    $('ul > li > h3 > a').each(function () {
// ok sauf que pour les titres bmc on a
//<li><h3 class="core-journal-heading"><a href="/authors/bmcseries">BMC Series</a></h3><h3 class="core-journal"><a href="http://www.biomedcentral.com/bmcanesthesiol">BMC Anesthesiology</a></h3>
// qui va generer une erreur Error: Invalid URI "/authors/bmcseries" et pas traiter toute la sous liste <h3 class="core-journal">
//console.log($(this));
      $('h3 > a[href^="http://"]').each(function () {
      journalsInPage.push($(this).attr('href'));
    });
    cb(null, journalsInPage);
  });
}

var firstLine = true;
var fields    = [];
function writeCSV(row) {
  if (firstLine) {
    firstLine = false;
    fields = Object.keys(row);
    fields.forEach(function (field, idx) {
      process.stdout.write(field + (idx < fields.length - 1 ? ';' : ''));
    });
    process.stdout.write('\n');
  }
  fields.forEach(function (field, idx) {
    if (/;/.test(row[field])) {
      process.stdout.write('"' + row[field].replace('"', '""') + '"');
    } else {
      process.stdout.write(row[field]);
    }
    process.stdout.write(idx < fields.length - 1 ? ';' : '');
  });
  process.stdout.write('\n');
}
