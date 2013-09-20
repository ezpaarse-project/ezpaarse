/*
Usage : node scrape_cairn_books.js > cairn.pkb.ebooks.YYYYMMDD.csv
*/
var request = require('request');
var cheerio = require('cheerio');
var url = 'http://www.cairn.info/ouvrages-collectifs.php?TITRE=ALL';

console.log("title;pid;url");
request(url, function(err, resp, body) {
    if (err) throw err;
    $ = cheerio.load(body);
    $('div.review.borderTop > ul > li > a').each(function(){
      var url = $(this).attr('href');
      var title = $(this).attr('title');
      var pid = $(this).find('img').attr('src').match(/\.\/vign_rev\/(.*?)\/(.*?)_H138.jpg/)[2];
      console.log(title + ";" + pid + ";" + "http://www.cairn.info/" + url);
    });
});
