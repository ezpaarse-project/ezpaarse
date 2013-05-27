var jobid;
var host = $(location).attr('protocol') + '//' + $(location).attr('host');

$('#input-log-type').on('change', function() {
  if ($('#input-log-type').val()) {
    $('#input-log-format').prop("disabled", false);
  } else {
    $('#input-log-format').prop("disabled", true);
    $('#input-log-format').prop("value", null);
  }
});

$('#submit').on('click', function () {
  jobid = uuid.v1();
  logroute = host + '/' + jobid + '/';

  var headers = {};
  
  if ($('#input-log-type').val() && $('#input-log-format').val()) {
    headers['Log-Format-' + $('#input-log-type').val()] = $('#input-log-format').val();
  }

  if ($('#input-log-compression').val()) {
    headers['Content-Encoding'] = $('#input-log-compression').val();
  }

  if ($('#input-result-format').val()) {
    headers['Accept'] = $('#input-result-format').val();
  }

  if ($('#input-result-compression').val()) {
    headers['Accept-Encoding'] = $('#input-result-compression').val();
  }

  if ($('#input-traces').val()) {
    headers['Traces-Level'] = $('#input-traces').val();
  }

  if ($('#input-output-fields').val()) {
    headers['Output-Fields'] = $('#input-output-fields').val();
  }

  var data = new FormData(document.getElementById('form'));
  $.ajax({
    headers:     headers, 
    type:        'PUT',
    url:         '/' + jobid,
    xhr: function() {
      var myXhr = $.ajaxSettings.xhr();
      if(myXhr.upload){ // check if upload property exists
        myXhr.upload.addEventListener("progress", function (e) {
          if(e.lengthComputable){
            var percentComplete = ( e.loaded * 100 ) / e.total;
            $('.bar').width(percentComplete + "%");
          }
        });
      }
      return myXhr;
    },
    dataType:    'html',
    data:        data,
    cache:       false,
    contentType: false,
    processData: false,
    'beforeSend': function() {
      
    },
    'success': function(data) {
    },
    'error': function(jqXHR, textStatus, errorThrown) {
      var error;

      if (errorThrown) {
        error = textStatus + ", " + errorThrown;
      } else {
        error = textStatus;
      }

      $("#error").text(error);

      $('.alert-error').slideDown();
    },
    'complete': function(data) {
    }
  });

  $('#report-btn').prop("href", logroute + 'job-report.html');

  $('#content-form').slideUp(function () {
    $('#content-result').slideDown();
  });

});

$('#form').on('submit', function () {

  return false;
});