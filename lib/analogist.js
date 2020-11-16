'use strict';

const request = require('request');

exports.getCertifications = (docurl) => new Promise((resolve, reject) => {
  return request(
    {
      method: 'GET',
      url: 'http://analyses.ezpaarse.org/api/platforms',
      json: true,
      headers: {
        'User-Agent': 'ezpaarse',
        'Content-Type': 'application/json'
      }
    }, (error, response, body) => {
      if (error) return reject(error);
      if (response.statusCode !== 200 || !body) return resolve(null);

      let certifications = {};

      body.forEach(({
        cardID,
        humanCertifications: humanCert,
        publisherCertifications: publisherCert
      }) => {
        let human = null;
        if (humanCert && humanCert.length && humanCert[0].form) {
          human = humanCert[0].form.year;
        }

        let publisher = null;
        if (publisherCert && publisherCert.length && humanCert[0].form) {
          publisher = publisherCert[0].form.year;
        }

        certifications = {
          ...certifications,
          [cardID]: {
            human,
            publisher,
          }
        };
      });

      return resolve(certifications);
    });
});
