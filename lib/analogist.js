'use strict';

var request = require('request');

exports.getCertifications = (docurl) => new Promise((resolve, reject) => {
  docurl = docurl.replace('/platforms', '/api/platforms');

  var options = {
    method: 'GET',
    url: docurl,
    headers: {
      'User-Agent': 'ezpaarse'
    }
  };

  request(options, function (error, response, body) {
    if (error) return reject(error);
    if (response.statusCode !== 200 || !body) return resolve({});

    const data = JSON.parse(body);
    return resolve(data.certifications);
  });
});
