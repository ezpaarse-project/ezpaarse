'use strict';

const request = require('request');

exports.getCertifications = (docurl) => new Promise((resolve, reject) => {
  const requestOptions = {
    method: 'GET',
    url: 'http://analyses.ezpaarse.org/api/platforms',
    json: true,
    headers: {
      'User-Agent': 'ezpaarse',
      'Content-Type': 'application/json'
    }
  };

  return request(requestOptions, (error, response, body) => {
    if (error) { return reject(error); }
    if (response.statusCode !== 200 || !Array.isArray(body)) { return resolve(null); }

    const certifications = {};

    body.forEach((platform) => {
      if (!platform || !platform.cardID) { return; }

      const {
        humanCertifications,
        publisherCertifications,
      } = platform;

      let human = false;
      let publisher = false;

      if (Array.isArray(humanCertifications)) {
        human = humanCertifications.some((cert) => cert && cert.form && cert.form.year);
      }
      if (Array.isArray(publisherCertifications)) {
        publisher = publisherCertifications.some((cert) => cert && cert.form && cert.form.year);
      }

      certifications[platform.cardID] = { human, publisher };
    });

    return resolve(certifications);
  });
});
