var jobid;
var socketID;
var host = $(location).attr('protocol') + '//' + $(location).attr('host');
var socket = io.connect(host);
var socketStarted = false;

socket.on('connected', function (id) {
  socketID = id;
});

/**
 * On report from the socket, generate links the first time then
 * display values of the report
 */
socket.on('report', function (report) {
  if (!socketStarted) {
    socketStarted = true;
    $('#traces-btn').prop("href", report["URL-Traces"]);
    $('#link-lines-ignored-domains').prop("href", report["url-ignored-domains"]);
    $('#link-lines-unknown-domains').prop("href", report["url-unknown-domains"]);
    $('#link-lines-unknown-format').prop("href", report["url-unknown-formats"]);
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
  $('#process-speed').text(report["process-speed"]);
});

/**
 * On change in .file-input NOW and in the FUTUR
 * (if new .file-inputs are created it will works too),
 * delete all empty .file-inputs and create a new one.
 * There will always be one empty input only, and in last position.
 */
$(document).on('change', '.file-input', function () {
  
  $('input[type=file]').each(function () {
    if ($(this).val() == '') {
      $(this).remove();
    }
  });

  $('#classic-inputs').append('<input class="file-input" type="file" name="file" />');
});

/**
 * When #input-log-type is not Auto, enable #input-log-format
 */
$('#input-log-type').on('change', function () {
  if ($('#input-log-type').val()) {
    $('#input-log-format').prop("disabled", false);
  } else {
    $('#input-log-format').prop("disabled", true);
    $('#input-log-format').prop("value", null);
  }
});

/**
 * On click on the submit button, generates jobid, headers with advanced options,
 * then test if files are submitted. If not, display an error and do nothing.
 * Else, PUT the files with the headers.
 */
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
    // before send, display filenames, generate buttons' links then display the result view
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
    // on success, display the success alert
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
    // on error, display the error alert
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

      $.getJSON(logroute + 'job-report.json', function (data) {
        if (data['nb-ecs'] == 0) {
          $('#get-btn').addClass('ninja');
        }
      });
      //jqHXR.abort();
    },
    // always display the report button at the end
    'complete': function(data) {
      $('#report-btn').removeClass('ninja');
    }
  });
});

// the navigator do nothing with the form
$('#form').on('submit', function () {

  return false;
});

$('#reset-btn').on('click', function () {
  location.reload();
});