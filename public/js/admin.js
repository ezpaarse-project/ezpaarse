// ##EZPAARSE

$(document).on('ready' ,function () {

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