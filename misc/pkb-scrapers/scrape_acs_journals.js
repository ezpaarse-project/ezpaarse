#!/usr/bin/env node

// Write on stdout the ACS journals PKB
// Write on stderr the progression
// Usage : ./scrape_acs_journals.js > acs.pkb.csv

var async       = require('async');
var request     = require('request').defaults({'proxy':'http://proxyout.inist.fr:8080', 'jar': true});
//var request     = require('request');
var cheerio     = require('cheerio');

// entry point: a big search on all springer journals
var journalsUrl = 'http://pubs.acs.org/';
// browse springer journals page by page
var pageUrl     = 'http://pubs.acs.org/';

// extract number of pages to browse for springer journals
getNbPages(function (err, nbPages) {
  if (err) throw err;

  // loop on pages
  var i = 1;
  async.until(
    function () {
      console.error('Browsing page ' + i + '/' + nbPages);
      return i > nbPages;
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
  var journalInfo = { pid: '', pissn: '', eissn: '', title: '' };
  request(journalUrl, function (err, resp, body) {
    if (err) return cb(err, journalInfo);
    $ = cheerio.load(body);
    journalInfo.title  = $('#journalLogo img').attr('alt');

    $('.fullBox div').each(function () {
      var divText = $(this).text().trim();
      if (divText.indexOf('Print Edition ISSN:') != -1) {
        journalInfo.pissn = divText.slice(-9);
      }
      if (divText.indexOf('Web Edition ISSN:') != -1) {
        journalInfo.eissn = divText.slice(-9);
      }
//      console.log($(this).text());
    });
    journalInfo.pid    = journalUrl.split('/').slice(-2, -1).pop();
    journalInfo.pidurl = journalUrl;
    writeCSV(journalInfo);
    //console.log(journalInfo)
    cb(err, journalInfo);
  });
}

function getNbPages(cb) {
  cb(null, 1);
/*  request(journalsUrl, function (err, resp, body) {
    if (err) return cb(err);
    $ = cheerio.load(body);
    cb(err, $('.number-of-pages').first().text());
  });*/
}

function getPage(pageIdx, cb) {
  var journalsInPage = [];
  var url = pageUrl;
  request(url, function(err, resp, body) {
    if (err) return cb(err);
    $ = cheerio.load(body);
    $('#azView li > a').each(function () {
      var href = $(this).attr('href');
      // keep only journals
      if (new RegExp('^/journal/').test(href)) {
        // skip http://pubs.acs.org/journal/jpchax.1 http://pubs.acs.org/journal/jpchax.2 ...
        if (!new RegExp('\\.[0-9]$').test(href)) {
          var pid = href.split('/').pop();
          journalsInPage.push('http://pubs.acs.org/page/' + pid + '/about.html');        
        } else {
          console.error('Skiping (archives) ' + href);
        }
      } else {
        console.error('Skiping (not a journal) ' + href);
      }
    });
    // deduplicate array content
    var journalsInPage2 = journalsInPage.filter(function(elem, pos, self) {
      return self.indexOf(elem) == pos;
    })    
    //console.log(journalsInPage2);
    cb(null, journalsInPage2);
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
