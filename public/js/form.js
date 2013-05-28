var jobid;
var socketID;
var host = $(location).attr('protocol') + '//' + $(location).attr('host');
var socket = io.connect(host);
var socketStarted = false;

socket.on('connected', function (id) {
  socketID = id;
});

socket.on('report', function (report) {
  if (!socketStarted) {
    socketStarted = true;
    $('#traces-btn').prop("href", report["URL-Traces"]);
    $('#link-lines-ignored-domains').prop("href", report["url-ignored-domains"]);
    $('#link-lines-unknown-domains').prop("href", report["url-unknown-domains"]);
    $('#link-lines-unknown-format').prop("href", report["url-unknown-format"]);
    $('#link-lines-unqualified-ecs').prop("href", report["url-unqualified-ecs"]);
    $('#link-lines-pkb-miss-ecs').prop("href", report["url-pkb-miss-ecs"]);
  }
  $('#nb-lines-input').text(report["nb-lines-input"]);
  $('#nb-ecs').text(report["nb-ecs"]);
  $('#rejection-rate').text(report["Rejection-Rate"]);
  $('#job-duration').text(report["Job-Duration"]);
  $('#nb-lines-ignored').text(report["nb-lines-ignored-domains"]);
  $('#nb-lines-ignored-domains').text(report["nb-lines-ignored-domains"]);
  $('#nb-lines-unknown-domains').text(report["nb-lines-unknown-domains"]);
  $('#nb-lines-unknown-format').text(report["nb-lines-unknown-format"]);
  $('#nb-lines-unqualified-ecs').text(report["nb-lines-unqualified-ecs"]);
  $('#nb-lines-pkb-miss-ecs').text(report["nb-lines-pkb-miss-ecs"]);
});

$('#input-log-type').on('change', function () {
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

  if (socketID) {
    headers['Socket-ID'] = socketID;
  }

  var data = new FormData(document.getElementById('form'));
  var test = false;
  


  $('input[type=file]').each(function () {
    // console.log($(this).val().split("\\").pop());
    if ($(this).val() != '') {
      test = true;
    }
  });

  if (!test) {
    $('#nofile-warn').slideDown();
    return false;
  }

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
            $('.bar').text(percentComplete.toFixed(0) + "%");
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
      var filename;
      $('input[type=file]').each(function () {
        filename = $(this).val().split("\\").pop();
        $('#submitted-files fieldset ul').append('<li>' + filename + '</li>');
      });
      $('#get-btn').prop('href', host + '/' + jobid);

      $('#report-btn').prop("href", logroute + 'job-report.html');

      $('#content-form').slideUp(function () {
        $('#content-result').slideDown();
      });
    },
    'success': function(data) {
      $('#reset-btn').text('Réinitialiser');
      $('.progress').addClass('progress-success');
      $('.progress').removeClass('active');
      $('#process-btns a').removeClass('btn-primary');
      $('#process-btns a').addClass('btn-success');
      $('#process-info').slideUp(function () {
        $('#process-success').slideDown();
      });
    },
    'error': function(jqXHR, textStatus, errorThrown) {
      var error;

      if (errorThrown) {
        error = textStatus + ", " + errorThrown;
      } else {
        error = textStatus;
      }

      $("#error").text(error);

      $('#process-info').slideUp(function () {
        $('.alert-error').slideDown();
      });
    },
    'complete': function(data) {
    }
  });
});

$('#form').on('submit', function () {

  return false;
});

$('#reset-btn').on('click', function () {
  location.reload();
});