// ##EZPAARSE

$(document).on('ready', function () {

  function updatePkbStatus() {
    var pkbStatus  = $('#pkb-status');
    var pkbRefresh = $('#pkb-status-refresh');

    $.ajax({
      type:     'GET',
      url:      '/pkb/status',
      dataType: 'html',
      'beforeSend': function () {
        pkbStatus.attr('class', 'btn');
        pkbStatus.find('span').text('rafraichissement...');
        pkbStatus.find('i').attr('class', 'icon-refresh');
        pkbRefresh.find('.loader').show();
        pkbRefresh.find('i').hide();
      },
      'success': function(data) {
        if (data.trim() == 'uptodate') {
          pkbStatus.attr('class', 'btn btn-success');
          pkbStatus.find('span').text('la base est à jour');
          pkbStatus.find('i').attr('class', 'icon-ok icon-white');
        } else {
          pkbStatus.attr('class', 'btn btn-warning');
          pkbStatus.find('span').text('des mises à jour sont disponibles');
          pkbStatus.find('i').attr('class', 'icon-warning-sign icon-white');
        }
      },
      'error': function(jqXHR, textStatus, errorThrown) {
        pkbStatus.attr('class', 'btn btn-danger');
        pkbStatus.find('span').text('une erreur s\'est produite');
        pkbStatus.find('i').attr('class', 'icon-warning-sign icon-white');
      },
      'complete': function () {
        pkbRefresh.find('i').show();
        pkbRefresh.find('.loader').hide();
      }
    });
  }
  
  $('#pkb-status-refresh').on('click', updatePkbStatus);
  updatePkbStatus();

  /**
   * On click on the submit button, serialize and send form
   */
  $('#user-form #submit').on('click', function () {
    var form = $('#user-form');

    $.ajax({
      type:     form.attr('method'),
      url:      form.attr('action'),
      dataType: 'html',
      data:     form.serialize(),
      'beforeSend': function () {
        form.find('.loader').show();
        form.find('.success-img, .form-success, .form-error, #submit').hide();
      },
      'success': function(data) {
        form.find('.success-img, .form-success').show();
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
});