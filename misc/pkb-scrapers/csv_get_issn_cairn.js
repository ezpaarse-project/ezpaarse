var csv      = require('csv');
var request  = require('request');
//var request  = require('request').defaults({'proxy':'http://myproxy:8080'});
var jsdom    = require('jsdom');
var jquery   = require('jquery');
var async    = require('async');

var pause    = 1000; // in ms

// read csv line by line with pause between each line
var q = async.queue(function (task, callback) {
  request.get(task.data.url, function (error, response, body) {
    jsdom.env(
      { 
        html: body, 
        done: function (err, window) {
          var $ = jquery.create(window);
          task.data.issn =  $('div.h5Typ2:eq(0)').text().trim().replace('I.S.S.N. ', '') || "N/A";
          task.data.eissn =  $('div.h5Typ2:eq(1)').text().trim().replace('en ligne ', '') || "N/A";
          setTimeout(function () {
            task.tcallback(null, task.data);
            callback();
          }, pause);
        }
      }
    );
  });
}, 1);


csv()
.from('cairn.journals.20130919.csv', {
//.from('cairn.magazines.pkb.csv', {
  columns: true,
  delimiter: ";"
})
.to.stream(process.stdout, {
  columns: ['title', 'pid', 'url', 'issn', 'eissn'],
  end: false
})
.transform(function (data, index, callback) {
  q.push({ 'data': data, 'tcallback': callback });
});
