/**
 * Api key utilisée pour pouvoir interroger
 * en AJAX l'API REST de Trello
 */
function getTrelloApiKey() {
  return '7fa507c389612aa4ca03f781cf2a8242';
}

/**
 * Retourne l'id du board d'ezPAARSE sur Trello
 *
 */
function getTrelloBoardId() {
  return 'wEaLnz8d';
}

/**
 * Retourne les listes présentes dans un board Trello
 * https://trello.com/docs/api/board/index.html#get-1-boards-board-id-lists
 */
function getTrelloBoardLists(cb) {
  var boardId   = getTrelloBoardId();
  var platforms = [];
  var boardUrl  = 'https://api.trello.com/1/boards/'
    + boardId
    + '/lists?key='
    + getTrelloApiKey();

  $.get(boardUrl, function (lists) {
    cb(null, lists);
  });
}

function getTrelloPlatformsList(cb) {
  var boardID    = getTrelloBoardId();
  var listsURL   = 'https://api.trello.com/1/boards/' + boardID + '/lists?cards=all&key=' + getTrelloApiKey();
  var membersURL = 'https://api.trello.com/1/boards/' + boardID + '/members?key=' + getTrelloApiKey();

  $.get(listsURL)
  .fail(function () {
    cb(new Error('failed to get board lists'));
  })
  .done(function (lists) {
    if (!Array.isArray(lists) || lists.length === 0) { return cb(null, []); }

    $.get(membersURL)
    .fail(function () {
      cb(new Error('failed to get board members'));
    })
    .done(function (members) {
      var indexedMembers = {};
      members.forEach(function (m) { indexedMembers[m.id] = m.fullName; });

      var platforms = [];

      lists.forEach(function (list) {
        list.cards.forEach(function (card) {
          if (!Array.isArray(card.idMembers)) { card.idMembers = []; }

          card.members = card.idMembers.map(function (member) {
            return indexedMembers[member];
          });

          // exclut la carte modèle
          if (card.id !== '53fc86672dbb930194716829') {
            platforms.push(createPlatform(card, list));
          }
        });
      });

      platforms = platforms.sort(function (p1, p2) {
        return p1.platformName.toLowerCase() > p2.platformName.toLowerCase() ? 1: -1;
      });

      cb(null, platforms);
    });
  });
}

/**
 * Retourne les détails d'une plateforme depuis une carte Trello
 */
function createPlatform(card, list) {
  var platform = {
    platformStatus:     list.name.replace(/\s*\([^\)]+\)/, ''),
    platformContact:    card.members.join(', '),
    platformName:       card.name,
    platformTrelloCard: card.url,
    platformTrelloUrl:  card.shortUrl,
    platformDate:       new Date(card.dateLastActivity).toLocaleDateString(),
    card:               card
  };


  var regexpAnalyseUrl     = new RegExp('(http://analogist.couperin.org/platforms/[^ $\n]+)');
  var regexpGitHubPlatform = new RegExp('(https://github.com/ezpaarse-project/ezpaarse-platforms/[^ $\n]+)');
  var match;
  if (match = card.desc.match(regexpAnalyseUrl)) {
    platform.platformAnalysisUrl = match[1];
  }
  if (match = card.desc.match(regexpGitHubPlatform)) {
    platform.platformGitHubUrl = match[1];
  }

  return platform;
}
