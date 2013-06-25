// ##EZPAARSE

var jobid;
var socketID;
var host = $(location).attr('protocol') + '//' + $(location).attr('host');
var socket = io.connect(host);
var socketStarted = false;
var predefined;

$(document).on('ready' ,function () {

  if (typeof FormData === "undefined") {
    $("#content-form").addClass("ninja");
    $("#navigator-alert").removeClass("ninja");
  }

  /**
   * initialize advanced options
   */
  $.ajax({
    url: "/info/form-predefined",
    dataType: 'json'
  }).done(function(form_predefined) {
    predefined = form_predefined['advanced-options-predefined'];
    $.each(predefined, function (p_id) {
      $('#advanced-options-predefined').append('<option value="' + p_id + '">' + predefined[p_id].label + '</option>');
    });
    $('#advanced-options-predefined').change(function updatePredefined() {
      var id = document.getElementById('advanced-options-predefined').value;
      if (id) {
        if (predefined[id].hasOwnProperty('input-log-type')) {
          $('#input-log-type').val(predefined[id]['input-log-type']);
          $('#input-log-format').prop("disabled", false);
        } else {
          $('#input-log-type').val("");      
          $('#input-log-format').prop("disabled", true);
        }
        if (predefined[id].hasOwnProperty('input-log-format')) {
          $('#input-log-format').val(predefined[id]['input-log-format']);
        } else {
          $('#input-log-format').val("");      
        }
        if (predefined[id].hasOwnProperty('input-result-format')) {
          $('#input-result-format').val(predefined[id]['input-result-format']);
        } else {
          $('#input-result-format').val("");      
        }
        if (predefined[id].hasOwnProperty('input-traces')) {
          $('#input-traces').val(predefined[id]['input-traces']);
        } else {
          $('#input-traces').val("");      
        }
        if (predefined[id].hasOwnProperty('input-output-fields')) {
          $('#input-output-fields').val(predefined[id]['input-output-fields']);
        } else {
          $('#input-output-fields').val("");      
        }
      } else {
        $('#input-log-type').val("");      
        $('#input-log-format').val("");      
        $('#input-result-format').val("");
        $('#input-traces').val("");
        $('#input-output-fields').val("");
      }
    /**
     * When #input-log-type is not Auto, enable #input-log-format
     */
      if ($('#input-log-type').val()) {
        $('#input-log-format').prop("disabled", false);
      } else {
        $('#input-log-format').prop("disabled", true);
        $('#input-log-format').prop("value", null);
      }
    })
  }).error(function() {
    console.log("Erreur lors de la récupération des données prédéfinies");
  });


  socket.on('connected', function (id) {
    socketID = id;
  });

  /**
   * On report from the socket, generate links the first time then
   * display values of the report
   */
  socket.on('report', function (report) {
    var general = report.general;
    var stats   = report.stats;
    var rejets  = report.rejets;

    if (!socketStarted) {
      socketStarted = true;
      $('#traces-btn').prop("href", general["URL-Traces"]);
      $('.link-lines-ignored-domains').prop("href", rejets["url-ignored-domains"]);
      $('.link-lines-unknown-domains').prop("href", rejets["url-unknown-domains"]);
      $('.link-lines-unknown-format').prop("href", rejets["url-unknown-formats"]);
      $('.link-lines-unqualified-ecs').prop("href", rejets["url-unqualified-ecs"]);
      $('.link-lines-pkb-miss-ecs').prop("href", rejets["url-pkb-miss-ecs"]);
    }
    $('#nb-lines-input').text(general["nb-lines-input"]);
    $('#nb-ecs').text(general["nb-ecs"]);
    $('#platforms').text(stats["platforms"]);
    $('#mime-PDF').text(stats["mime-PDF"]);
    $('#mime-HTML').text(stats["mime-HTML"]);
    $('#rejection-rate').text(general["Rejection-Rate"]);
    $('#job-duration').text(general["Job-Duration"]);
    $('#nb-lines-ignored').text(rejets["nb-lines-ignored"]);
    $('#nb-lines-ignored-domains').text(rejets["nb-lines-ignored-domains"]);
    $('#nb-lines-unknown-domains').text(rejets["nb-lines-unknown-domains"]);
    $('#nb-lines-unknown-format').text(rejets["nb-lines-unknown-format"]);
    $('#nb-lines-unqualified-ecs').text(rejets["nb-lines-unqualified-ecs"]);
    $('#nb-lines-pkb-miss-ecs').text(rejets["nb-lines-pkb-miss-ecs"]);
    $('#process-speed').text(general["process-speed"]);
  });

  $("div[toggle-chevron]").on('show', function () {
    $($(this).attr('toggle-chevron'))
    .removeClass("icon-chevron-right")
    .addClass("icon-chevron-down");
  });

  $("div[toggle-chevron]").on('hide', function () {
    $($(this).attr('toggle-chevron'))
    .removeClass("icon-chevron-down")
    .addClass("icon-chevron-right");
  });

  /**
   * Drag and drop
   */
  function fileDragHover(e) {
    e.stopPropagation();
    e.preventDefault();
    e.target.className = (e.type == "dragover" ? "hover" : "");
    if (e.type == "dragover") {
      $(e.target).text("Déposer les fichiers");
    } else {
      $(e.target).text("Glissez vos fichiers ici");
    }
  }
  var filedrag = $('#dropbox');
  filedrag.on("dragover", fileDragHover);
  filedrag.on("dragleave", fileDragHover);
  filedrag.on("drop", function (e) {
    e.stopPropagation();
    e.preventDefault();
    e.target.className = "";
    $(e.target).text("Glisser vos fichiers ici");
    $('.file-input').last().prop('files', e.originalEvent.dataTransfer.files);
  });

  /**
   * On change in .file-input NOW and in the FUTUR
   * (if new .file-inputs are created it will works too),
   * delete all empty .file-inputs and create a new one.
   * There will always be one empty input only, and in last position.
   */
  $(document).on('change', '.file-input', function () {
    var totalSize = 0;
    $('input[type=file]').each(function (index, input) {
      if ($(this).val() == '') {
        $(this).parent().remove();
      } else {
        for(var i = 0; i < input.files.length; i++) {
          totalSize += input.files[i].size;
        }
      }
    });
    $('.btn-danger').removeClass('ninja');
    if (totalSize > 209715200) {
      $('#big-warn').slideDown();
    } else {
      $('#big-warn').slideUp();
    }

    var newInput = '<div class="single-input">';
    newInput    += '<button class="btn btn-danger btn-mini file-remove-button ninja" title="remove">';
    newInput    += '<i class="icon-remove icon-white"></i></button>';
    newInput    += '<input class="file-input" type="file" name="file" multiple/>';
    newInput    += '</div>';
    $('#classic-inputs').append(newInput);
  });

  /**
   * Recheck file inputs when clicking on a remove button
   */
  $(document).on('click', '.file-remove-button', function () {
    $(this).next().val('').change();
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

    if ($('#input-result-format').val()) {
      headers['Accept'] = $('#input-result-format').val();
      $("#result-format").text($('#input-result-format').val().split("/")[1]);
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
        $('input[type=file]').each(function (index, input) {
          for(var i = 0; i < input.files.length; i++) {
            filename = input.files[i].name;
            $('#submitted-files fieldset ul').append('<li>' + filename + '</li>');
          }
        });
        $('#get-btn').prop('href', host + '/' + jobid);

        $('#report-btn').prop("href", logroute + 'job-report.html');

        $('#content-form').slideUp(function () {
          $('#content-result').slideDown();
        });
      },
      // on success, display the success alert
      'success': function(data) {
        $('#cancel-btn').text('Réinitialiser');
        $('.progress').addClass('progress-success');
        $('.progress').removeClass('active');
        $('#process-btns a').removeClass('btn-primary');
        $('#get-btn').addClass('btn-success');
        $('#cancel-btn').addClass('ninja');
        $('#process-info').slideUp(function () {
          $('#process-success').slideDown();
        });
      },
      // on error, display the error alert
      'error': function(jqXHR, textStatus, errorThrown) {
        var error;
        var status = jqXHR.getResponseHeader("ezPAARSE-Status");
        var message = jqXHR.getResponseHeader("ezPAARSE-Status-Message");
        if (message) {
          error = status + ", " + message;
        } else {
          error = status;
        }

        if (status) {
          $("#error").text(error);
        } else {
          $("#error").text("500, Internal Server Error");
        }

        $('#process-info').slideUp(function () {
          $('.alert-error').slideDown();
        });

        $.getJSON(logroute + 'job-report.json', function (data) {
          if (data['nb-ecs'] == 0) {
            $('#get-btn').addClass('ninja');
          }
        });
        socket.disconnect();
        //jqHXR.abort();
      },
      // always display the report button at the end
      'complete': function(data) {
        $('#report-btn').removeClass('ninja');
        $('#reset-btn').removeClass('ninja');
      }
    });
  });

  // the navigator do nothing with the form
  $('#form').on('submit', function () {

    return false;
  });

  $('#cancel-btn').on('click', function () {
    location.reload();
  });
});