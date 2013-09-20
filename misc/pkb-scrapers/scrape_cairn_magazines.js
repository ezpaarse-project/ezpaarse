/*
Usage : node scrape_cairn_magazines.js > cairn.pkb.journals.YYYYMMDD.csv
*/
var request = require('request');
var cheerio = require('cheerio');
var url = 'http://www.cairn.info/magazines.php';

console.log("title;pid;url");
request(url, function(err, resp, body) {
    if (err) throw err;
    $ = cheerio.load(body);
    var anchors = $('div.boxHome > ul.listMagCovers > li > a[class!=arrow]');
    anchors.each(function() {
      var url = $(this).attr('href');
      var title = $(this).find('img.visu').attr('alt');
      var pid = $(this).find("img").attr("src").match(/\.\/vign_rev\/(.*?)\/.*?jpg/)[1];
      console.log(title + ";" + pid + ";" + "http://www.cairn.info/" + url);
    });
});
