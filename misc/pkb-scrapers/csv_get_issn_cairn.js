var csv      = require('csv');
var request  = require('request');
//var request  = require('request').defaults({'proxy':'http://myproxy:8080'});
var jsdom    = require('jsdom');
var jquery   = require('jquery');

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
  console.log("function data with: " + data.url);
  request.get(data.url, function (error, response, body) {
    
    jsdom.env({ html: body }, function (err, window) {
      var $ = jquery.create(window);
      data.issn =  $('div.h5Typ2:eq(0)').text().trim().replace('I.S.S.N. ', '');
      callback(null, data);
    });

  });
});
