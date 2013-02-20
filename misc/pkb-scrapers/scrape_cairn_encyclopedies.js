/*
Usage : node scrape_cairn_encyclopedies.js > cairn.pkb.encyclopedies.YYYYMMDD.csv
*/

var scraper = require('scraper');
console.log("title;pid;url")

scraper('http://www.cairn.info/encyclopedies-de-poche.php?TITRE=ALL', function(err, $) {
  if (err) {throw err;}

  $("div.review.borderTop > ul > li > a").each(function(){
    var url = $(this).attr('href');
    var title = $(this).attr('title');
    var pid = $(this).find("img").attr("src").match(/\.\/vign_rev\/(.*?)\/(.*?)_H138.jpg/)[2];
    console.log(title + ";" + pid + ";" + "http://www.cairn.info/" + url);
  });
});
