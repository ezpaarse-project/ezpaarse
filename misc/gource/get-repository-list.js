#!/usr/bin/env node
/**
 * Get the ezpaarse repository list from the github RESTful API
 * (need to run "npm install" before use)
 */

var request     = require('request').defaults({
  proxy: process.env.http_proxy ||
         process.env.HTTP_PROXY ||
         process.env.https_proxy ||
         process.env.HTTPS_PROXY
});

request
  .get(
    { url: 'https://api.github.com/orgs/ezpaarse-project/repos',
      json: true,
      headers: {
        'User-Agent': 'Awesome-Octocat-App'
      }
    },
    function (err, res, body) {
      if (!err && res.statusCode == 200) {
        body.forEach(function (repository, idx) {
          console.log(repository.name);
        });
      } else {
        console.error('Oh no! error ' + res.text);
        process.exit(1);
      }
    });
