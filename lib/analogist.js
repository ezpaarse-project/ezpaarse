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

    const humanCertified = body.humanCertifications && body.humanCertifications.length > 0 ? body.humanCertifications[0].form.year : null;
    const publisherCertified = body.publisherCertifications && body.publisherCertifications.length > 0 ? body.humanCertifications[0].form.year : null;

    return resolve({ humanCertified, publisherCertified });
  });
});
