// ##EZPAARSE

window.onload = function () {
  var pkbStatus      = $('#pkb-status');
  var pkbRefresh     = $('#pkb-status-refresh');
  var parsersStatus  = $('#parsers-status');
  var parsersRefresh = $('#parsers-status-refresh');

  function setButtonStatus(button, status, message) {
    button.find('span').text(message);
    switch (status) {
      case 'error':
        button.attr('class', 'btn btn-danger');
        button.find('i').attr('class', 'icon-warning-sign icon-white');
        break;
      case 'success':
        button.attr('class', 'btn btn-success');
        button.find('i').attr('class', 'icon-ok icon-white');
        break;
      case 'warning':
        button.attr('class', 'btn btn-warning');
        button.find('i').attr('class', 'icon-warning-sign icon-white');
        break;
      case 'refresh':
        button.attr('class', 'btn');
        button.find('i').attr('class', 'icon-refresh');
        break;
    }
  }

  function setLoading(button, loading) {
    if (loading) {
      button.find('.loader').show();
      button.find('i').hide();
    } else {
      button.find('.loader').hide();
      button.find('i').show();
    }
  }

  function updatePkbStatus() {
    $.ajax({
      type:     'GET',
      url:      '/pkb/status',
      dataType: 'html',
      'beforeSend': function () {
        setButtonStatus(pkbStatus, 'refresh', 'rafraichissement...');
        setLoading(pkbRefresh, true);
      },
      'success': function(data) {
        if (data.trim() == 'uptodate') {
          setButtonStatus(pkbStatus, 'success', 'la base est à jour');
        } else {
          setButtonStatus(pkbStatus, 'warning', 'des mises à jour sont disponibles, cliquez pour les installer');
        }
      },
      'error': function(jqXHR, textStatus, errorThrown) {
        setButtonStatus(pkbStatus, 'error', 'une erreur s\'est produite');
      },
      'complete': function () {
        setLoading(pkbRefresh, false);
      }
    });
  }

  function updateParsersStatus() {
    $.ajax({
      type:     'GET',
      url:      '/parsers/status',
      dataType: 'html',
      'beforeSend': function () {
        setButtonStatus(parsersStatus, 'refresh', 'rafraichissement...');
        setLoading(parsersRefresh, true);
      },
      'success': function(data) {
        if (data.trim() == 'uptodate') {
          setButtonStatus(parsersStatus, 'success', 'les parseurs sont à jour');
        } else {
          setButtonStatus(parsersStatus, 'warning', 'des mises à jour sont disponibles, cliquez pour les installer');
        }
      },
      'error': function(jqXHR, textStatus, errorThrown) {
        setButtonStatus(parsersStatus, 'error', 'une erreur s\'est produite');
      },
      'complete': function () {
        setLoading(parsersRefresh, false);
      }
    });
  }

  pkbStatus.on('click', function () {
    $.ajax({
      type:     'PUT',
      url:      '/pkb/status',
      dataType: 'html',
      data:     'uptodate',
      'beforeSend': function () {
        setButtonStatus(pkbStatus, 'refresh', 'mise à jour...')
        setLoading(pkbRefresh, true);
      },
      'success': function(data) {
        setButtonStatus(pkbStatus, 'success', 'la base est à jour');
      },
      'error': function(jqXHR, textStatus, errorThrown) {
        setButtonStatus(pkbStatus, 'error', 'la mise à jour a échoué');
      },
      'complete': function () {
        setLoading(pkbRefresh, false);
      }
    });
  });

  parsersStatus.on('click', function () {
    $.ajax({
      type:     'PUT',
      url:      '/parsers/status',
      dataType: 'html',
      data:     'uptodate',
      'beforeSend': function () {
        setButtonStatus(parsersStatus, 'refresh', 'mise à jour...')
        setLoading(parsersRefresh, true);
      },
      'success': function(data) {
        setButtonStatus(parsersStatus, 'success', 'les parseurs sont à jour');
      },
      'error': function(jqXHR, textStatus, errorThrown) {
        setButtonStatus(parsersStatus, 'error', 'la mise à jour a échoué');
      },
      'complete': function () {
        setLoading(parsersRefresh, false);
      }
    });
  });
  $('#pkb-status-refresh').on('click', updatePkbStatus);
  $('#parsers-status-refresh').on('click', updateParsersStatus);
  updatePkbStatus();
  updateParsersStatus();

  var usersDiv   = $('#users-list');
  var usersTable = usersDiv.find('#users-table');

  function addUser(user) {
    var row = $('<tr>', { class: 'ninja' });
    $('<td>', { text: user.username }).appendTo(row);
    $('<td>', { text: user.group }).appendTo(row);

    var deleteButton = $('<button>', {
      class: 'btn btn-danger btn-mini',
      title: 'supprimer',
      text: ' Supprimer'
    });
    $('<i>', { class: 'icon icon-white icon-trash' }).prependTo(deleteButton);
    $('<img>', {
      class: 'loader ninja',
      src: '/img/loader.gif',
      width: 14
    }).prependTo(deleteButton);

    deleteButton.on('click', function () {
      var self = $(this);
      $.ajax({
        type:     'DELETE',
        url:      '/users/' + user.username || '',
        dataType: 'html',
        'beforeSend': function () {
          usersDiv.find('.refresh-error').hide();
          setLoading(self, true);
        },
        'success': function(data) {
          row.fadeOut(function () { row.remove(); });
        },
        'error': function(jqXHR, textStatus, errorThrown) {
          usersDiv.find('.refresh-error').text("la suppression a échoué").show();
        },
        'complete': function () {
          setLoading(self, false);
        }
      });
    });

    $('<td>').append(deleteButton).appendTo(row);
    usersTable.append(row);
    row.fadeIn();
  }

  function refreshUsers() {
    $.ajax({
      type:     'GET',
      url:      '/users',
      dataType: 'json',
      'beforeSend': function () {
        usersDiv.find('.refresh-error').hide();
        usersDiv.find('.refresh-loader').show();
      },
      'success': function(users) {
        usersTable.find('tr:not(:first)').remove();
        users.forEach(function (user) {
          addUser(user);
        });
      },
      'error': function(jqXHR, textStatus, errorThrown) {
        usersDiv.find('.refresh-error').text("la liste n'a pas pu être actualisée").show();
      },
      'complete': function () {
        usersDiv.find('.refresh-loader').hide();
      }
    });
  }
  refreshUsers();

  /**
   * On click on the submit button, serialize and send form
   */
  $('#user-form #submit').on('click', function () {
    var form = $('#user-form');

    $.ajax({
      type:     form.attr('method'),
      url:      form.attr('action'),
      dataType: 'json',
      data:     form.serialize(),
      'beforeSend': function () {
        form.find('.loader').show();
        form.find('.success-img, .form-success, .form-error, #submit').hide();
      },
      'success': function(user) {
        form.find('.success-img, .form-success').show();
        addUser(user);
      },
      'error': function(jqXHR, textStatus, errorThrown) {
        var message = jqXHR.getResponseHeader("ezPAARSE-Status-Message");
        form.find('.form-error').text(message || errorThrown || 'Unknown error').show();
      },
      'complete': function () {
        form.find('.loader').hide();
        form.find('#submit').show();
      }
    });
  });

  // the navigator do nothing with the form
  $('#user-form').on('submit', function () {
    return false;
  });
};