
    /**
     * Parse les détails d'une plateforme
     * depuis la description d'une carte Trello
     */
    function getPlatformDataFromTrelloCard(cardId, cb) {
      var cardUrl = 'https://api.trello.com/1/cards/' + cardId + '?fields=desc&key=' + getTrelloApiKey();
      $.get(cardUrl, function (card) {
        var res = {};
        var regexpAnalyseUrl = new RegExp('(http://analogist.couperin.org/platforms/[^ $\n]+)');
        var regexpGitHubPlatform = new RegExp('(https://github.com/ezpaarse-project/ezpaarse-platforms/[^ $\n]+)');
        var match;
        if (match = card.desc.match(regexpAnalyseUrl)) {
          res.analysisUrl = match[1];
        }
        if (match = card.desc.match(regexpGitHubPlatform)) {
          res.gitHubUrl = match[1];
        }
        cb(null, res);
      });
    }

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
    function getTrelloBoardLists(boardId, cb) {
      var platforms = [];
      var boardUrl = 'https://api.trello.com/1/boards/'
        + boardId
        + '/lists?key='
        + getTrelloApiKey();

      $.get(boardUrl, function (lists) {
        cb(null, lists);
      });
    }

    function getTrelloPlatformsList(cb) {
      var platformsList = {};
      getTrelloBoardLists(getTrelloBoardId(), function (err, lists) {
        var nbList = lists.length;
        if (nbList === 0) { return cb({}) };
        $.each(lists, function (idX, trelloList) {
          // puis la liste des plateformes présentes
          // dans chaque listes du trello
          getPlatformsFromTrelloList(trelloList,
            function (err, platforms) {
              nbList--;
              platformsList[trelloList.pos] = platforms;
              if (nbList === 0) {
                cb(platformsList);
              }
            }
          );
        });
      });
    }


    /**
     * Retourne la liste des plateformes présentes
     * dans une liste Trello
     */
    function getPlatformsFromTrelloList(trelloList, cb) {
      var platforms = [];
      var listUrl = 'https://api.trello.com/1/lists/'
        + trelloList.id
        + '/cards?fields=url,name,dateLastActivity,idMembers&key='
        + getTrelloApiKey();
      $.get(listUrl, function (cards) {
        if (cards.length === 0) cb(null, []);
        getUsersFromTrelloCards(cards, function (err, users) {
          var nbCbCalled = 0;
          var platforms = [];
          $.each(cards, function (idx, trelloCard) {
            nbCbCalled++;
            getPlatformFromTrelloCard(trelloCard, users, function (err, platform) {
              // retire  le contenu des parenthèses dans le nom des colonnes
              platform.platformStatus = trelloList.name.replace(new RegExp(' *\\([^)]+\\)'), '');
              // n'affiche pas la carte modèle
              // https://trello.com/c/rlb3YezS/3-nom-pltfrme-modele-a-copier
              if (platform.card.id !== '53fc86672dbb930194716829') {
                platforms.push(platform);
              }
              nbCbCalled--;
              if (nbCbCalled === 0) {
                // tri des plateformes par dates
                //platforms = platforms.sort(function (p1, p2) {
                //  return p1.card.dateLastActivity < p2.card.dateLastActivity;
                //});
                platforms = platforms.sort(function (p1, p2) {
                  return p1.card.name > p2.card.name ? 1: -1;
                });
                return cb(null, platforms);
              }
            });
          });
        });
      });
    }

    /**
     * Retourne la liste des plateformes présentes
     * dans une liste Trello
     */
    function getPlatformsFromTrelloBoard(cb) {
      var platforms = [];
      var listUrl = 'https://api.trello.com/1/boards/'
        + getTrelloBoardId()
        + '/cards?fields=url,shortUrl,name,dateLastActivity,idMembers&key='
        + getTrelloApiKey();
      $.get(listUrl, function (cards) {
        if (cards.length === 0) cb(null, []);
        getUsersFromTrelloCards(cards, function (err, users) {
          var nbCbCalled = 0;
          var platforms = [];
          $.each(cards, function (idx, trelloCard) {
            nbCbCalled++;
            console.log(trelloCard);
            getPlatformFromTrelloCard(trelloCard, users, function (err, platform) {

              // retire  le contenu des parenthèses dans le nom des colonnes
              //platform.platformStatus = trelloList.name.replace(new RegExp(' *\\([^)]+\\)'), '');
              // n'affiche pas la carte modèle
              // https://trello.com/c/rlb3YezS/3-nom-pltfrme-modele-a-copier
              if (platform.card.id !== '53fc86672dbb930194716829') {
                platforms.push(platform);
              }
              nbCbCalled--;
              if (nbCbCalled === 0) {
                // tri des plateformes par dates
                //platforms = platforms.sort(function (p1, p2) {
                //  return p1.card.dateLastActivity < p2.card.dateLastActivity;
                //});
                platforms = platforms.sort(function (p1, p2) {
                  return p1.card.name > p2.card.name ? 1: -1;
                });
                return cb(null, platforms);
              }
            });
          });
        });
      });
    }



    /**
     * Retourne les détails d'une plateforme depuis une carte Trello
     */
    function getPlatformFromTrelloCard(card, users, cb) {
      var platform = {};
      var itemMembers = [];
      $.each(card.idMembers, function (idx2, memberId) {
        itemMembers.push(users[memberId].fullName);
      });
      platform.platformContact = itemMembers.join (', ');
      platform.platformName = card.name;
      platform.platformTrelloCard = card.url;
      platform.platformTrelloUrl = card.shortUrl;
      platform.platformDate = new Date(card.dateLastActivity).toLocaleDateString();
      platform.card = card;

      getPlatformDataFromTrelloCard(card.id, function (err, cardData) {
        platform.platformAnalysisUrl = cardData.analysisUrl;
        platform.platformGitHubUrl   = cardData.gitHubUrl;
        cb(null, platform);
      });
    }

    /**
     * Retoure la liste des détails des utilisateurs 
     * assignés à une carte Trello
     */
    function getUsersFromTrelloCards(cards, cb) {
      // dédoublonnage de tous les users a récupérer
      var userIds = [];
      $.each(cards, function (idx, card) {
        $.each(card.idMembers, function (idx2, userId) {
          if (userIds.indexOf(userId) === -1) {
            userIds.push(userId);
          }
        });
      });
      // récupération des info de chaque users
      var users = {};
      var nbCbCalled = 0;
      if (userIds.length === 0) return cb(null, users);
      $.each(userIds, function (idx, userId) {
        var trelloUserUrl = 'https://api.trello.com/1/members/' + userId + '?key='+getTrelloApiKey();
        nbCbCalled++;
        $.get(trelloUserUrl, function (user) {
          users[userId] = user;
          nbCbCalled--;
          if (nbCbCalled == 0) return cb(null, users);
        });
      });
    }
