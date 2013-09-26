// ##EZPAARSE

$(document).on('ready' ,function () {

  function sendAuthRequest(username, password) {
    $.ajax({
      headers: {
        Authorization: 'Basic ' + Base64.encode(username + ':' + password)
      },
      type:     'GET',
      url:      '/?auth=local',
      dataType: 'html',
      'complete': function(data) {
        window.location.href = '/';
      }
    });
  }

  /**
   * On click on the submit button, serialize and send form
   */
  $('#register-form #submit').on('click', function () {
    var form = $('#register-form');

    $.ajax({
      type:     form.attr('method'),
      url:      form.attr('action'),
      dataType: 'html',
      data:     form.serialize(),
      'beforeSend': function () {
        $('#register-form .loader').show();
        $('#register-form #submit').hide();
        $('#register-form-error').hide();
        $('#register-form input').prop('disabled', true);
      },
      'success': function(data) {
        $('#register-form .loader').hide();
        $('#register-form .success').show();
        sendAuthRequest($('#username').val(), $('#password').val());
      },
      'error': function(jqXHR, textStatus, errorThrown) {
        var message = jqXHR.getResponseHeader("ezPAARSE-Status-Message");
        $('#register-form .loader').hide();
        $('#register-form #submit').show();
        $('#register-form-error').text(message || errorThrown || 'Unknown error').show();
        $('#register-form input').prop('disabled', false);
      }
    });
  });

  // the navigator do nothing with the form
  $('#register-form').on('submit', function () {
    return false;
  });
});