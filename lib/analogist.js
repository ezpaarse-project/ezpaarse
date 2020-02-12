'use strict';

const request = require('request');

exports.getCertifications = (docurl) => new Promise((resolve, reject) => {
  docurl = docurl.replace('/platforms', '/api/platforms');

  const options = {
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
    const humanCertifications = body.humanCertifications;
    if (humanCertifications && humanCertifications.length && humanCertifications[0].form) {
      human = humanCertifications[0].form.year;
    }

    let publisher = null;
    const publisherCertifications = body.publisherCertifications;
    if (publisherCertifications && publisherCertifications.length && humanCertifications[0].form) {
      publisher = publisherCertifications[0].form.year;
    }

    return resolve({ human, publisher });
  });
});
