'use strict';

var request = require('request');

exports.getCertifications = (docurl) => new Promise((resolve, reject) => {
  docurl = docurl.replace('/platforms', '/api/platforms');

  var options = {
    method: 'GET',
    url: docurl,
    json: true,
    headers: {
      'User-Agent': 'ezpaarse',
      'Content-Type': 'application/json'
    }
  };

  request(options, function (error, response, body) {
    if (error) return reject(error);
    if (response.statusCode !== 200 || !body) return resolve({});

    let human = null;
    if (body.humanCertifications && body.humanCertifications.length > 0) {
      human = body.humanCertifications[0].form.year;
    }

    let publisher = null;
    if (body.publisherCertifications && body.publisherCertifications.length > 0) {
      publisher = body.humanCertifications[0].form.year;
    }

    return resolve({ human, publisher });
  });
});
