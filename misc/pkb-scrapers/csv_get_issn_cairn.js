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
    jsdom.env({ html: body }, function (err, window) {
      var $ = jquery.create(window);
      task.data.issn =  $('div.h5Typ2:eq(0)').text().trim().replace('I.S.S.N. ', '');
      setTimeout(function () {
        task.tcallback(null, task.data);
        callback();
      }, pause);
    });
  });
}, 1);

csv()
.from('cairn.20130213.csv', {
  columns: true,
  delimiter: ";"
})
.to.stream(process.stdout, {
  columns: ['title', 'pid', 'url', 'issn'],
  end: false
})
.transform(function (data, index, callback) {
  q.push({ 'data': data, 'tcallback': callback });
});
