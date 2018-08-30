'use strict';

var request = require('request');

exports.getCertifications = function (callback) {
  var options = {
    method: 'GET',
    url: 'https://api.trello.com/1/board/53a87acb01c8331fb6fa9a62/cards',
    headers: {
      'User-Agent': 'ezpaarse'
    }
  };

  request(options, function (error, response, body) {
    // eslint-disable-next-line
    if (error) console.error(error)

    var trelloCards = JSON.parse(body);

    var cards = [];
    trelloCards.forEach(function (card, index) {
      if (card.labels) {
        var certifications = [];
        card.labels.forEach(function (label) {
          if (label.name === 'certified: human') certifications.push('H');
          if (label.name === 'certified: publisher') certifications.push('P');
        });
        if (certifications.length > 0) {
          cards[card.id] = certifications;
        }
      }
    });

    callback(cards);
  });
};
