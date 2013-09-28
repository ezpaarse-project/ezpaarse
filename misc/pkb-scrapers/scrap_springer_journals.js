#!/usr/bin/env node

// Write on stdout the springer journals PKB
// Usage : ./scrape_springer_journals.js > springer.pkb.csv

var async       = require('async');
var request     = require('request');
var cheerio     = require('cheerio');

// entry point: a big search on all springer journals
var journalsUrl = 'http://link.springer.com/search?facet-content-type=%22Journal%22';
// browse springer journals page by page
var pageUrl     = 'http://link.springer.com/search/page/%pageIdx%?facet-content-type=%22Journal%22';

// extract number of pages to browse for springer journals
getNbPages(function (err, nbPages) {
  if (err) throw err;

  // loop on pages
  var i = 1;
  async.until(
    function () {
      return i >= nbPages;
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
    // called when a page is finished
    function (err) {
      if (err) throw err;
    }
  );

});

function getJournalInfo(journalUrl, cb) {
  var journalInfo = {};
  request(journalUrl, function (err, resp, body) {
    if (err) return cb(err, journalInfo);
    $ = cheerio.load(body);
    journalInfo.title = $('#title').text();
    journalInfo.pissn = $('.pissn').first().text().replace(' (Print)', '');
    journalInfo.eissn = $('.eissn').first().text().replace(' (Online)', '');
    journalInfo.pid   = journalUrl.split('/').pop();
    journalInfo.url   = journalUrl;
    writeCSV(journalInfo);
    //console.log(journalInfo)
    cb(err, journalInfo);
  });
}

function getNbPages(cb) {
  request(journalsUrl, function (err, resp, body) {
    if (err) return cb(err);
    $ = cheerio.load(body);
    cb(err, $('.number-of-pages').first().text());
  });
}

function getPage(pageIdx, cb) {
  var journalsInPage = [];
  var url = pageUrl.replace("%pageIdx%", pageIdx);
  request(url, function(err, resp, body) {
    if (err) return cb(err);
    $ = cheerio.load(body);
    $('#results-list a.title').each(function () {
      journalsInPage.push('http://link.springer.com' + $(this).attr('href'));
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