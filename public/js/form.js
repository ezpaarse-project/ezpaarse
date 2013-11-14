// ##EZPAARSE

var jobid;
var socketID;
var host = $(location).attr('protocol') + '//' + $(location).attr('host');
var socket = io.connect(host);
var predefined;
var config;

$(document).on('ready' ,function () {

  // do not show the Form if using an obsolete browser (ex: Internet Explorer)
  if (typeof FormData === "undefined") {
    $("#content-form").addClass("ninja");
    $("#navigator-alert").removeClass("ninja");
  }

  $.getJSON('/info/config', function (cfg) {
    config = cfg;
  });

  /**
   * load first user-field using the template at the end of the page
   */
  $('#user-fields').append($('#user-field-template').html());

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
   * On headers reception.
   * We can only get headers with XHR when the whole request is sent.
   * As we are streaming request and response at the same time,
   * it's not possible to get headers at start time.
   */
  socket.on('headers', function (headers) {
    $('#traces-btn').prop("href", headers["Job-Traces"]);
    $('.link-lines-ignored-domains').prop("href", headers["Lines-Ignored-Domains"]);
    $('.link-lines-unknown-domains').prop("href", headers["Lines-Unknown-Domains"]);
    $('.link-lines-unknown-format').prop("href", headers["Lines-Unknown-Formats"]);
    $('.link-lines-unqualified-ecs').prop("href", headers["Lines-Unqualified-ECs"]);
    $('.link-lines-pkb-miss-ecs').prop("href", headers["Lines-PKB-Miss-ECs"]);
    $('.link-lines-duplicate-ecs').prop("href", headers["Lines-Duplicate-ECs"]);
    $('.link-lines-unordered-ecs').prop("href", headers["Lines-Unordered-ECs"]);
  });

  /**
   * On report from the socket, generate links the first time then
   * display values of the report
   */
  socket.on('report', function (report) {
    var general = report.general;
    var stats   = report.stats;
    var rejets  = report.rejets;

    $('#nb-lines-input').text(general["nb-lines-input"]);
    $('#nb-ecs').text(general["nb-ecs"]);
    $('#platforms').text(stats["platforms"]);
    $('#mime-PDF').text(stats["mime-PDF"]);
    $('#mime-HTML').text(stats["mime-HTML"]);
    $('#rejection-rate').text(general["Rejection-Rate"]);
    $('#job-duration').text(general["Job-Duration"]);
    $('#nb-lines-ignored').text(rejets["nb-lines-ignored"]);
    $('#nb-lines-duplicate-ecs').text(rejets["nb-lines-duplicate-ecs"]);
    $('#nb-lines-ignored-domains').text(rejets["nb-lines-ignored-domains"]);
    $('#nb-lines-unknown-domains').text(rejets["nb-lines-unknown-domains"]);
    $('#nb-lines-unknown-format').text(rejets["nb-lines-unknown-format"]);
    $('#nb-lines-unqualified-ecs').text(rejets["nb-lines-unqualified-ecs"]);
    $('#nb-lines-pkb-miss-ecs').text(rejets["nb-lines-pkb-miss-ecs"]);
    $('#nb-lines-unordered-ecs').text(rejets["nb-lines-unordered-ecs"]);
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
    e.target.className = (e.type === "dragover" ? "hover" : "");
    if (e.type === "dragover") {
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
    // alert(e.originalEvent.dataTransfer.files.item(0).name);
    // doesn't work on FF !
    $('.file-input').last().prop('files', e.originalEvent.dataTransfer.files);
  });

  function generateCurl() {
    var curldiv = $('#curl-request');
    var cmd = 'curl -X POST';
    if (config && config.EZPAARSE_REQUIRE_AUTH) {
      cmd += ' -u "username:password"'
    }
    var nb = 1;
    $('input[type=file]').each(function (index, input) {
      var files = $(this).prop('files') || [];
      for (var i = 0, l = files.length; i < l; i++) {
        var file = files[i];
        cmd += ' -F "file' + (nb++) + '=@' + file.name + (file.type ? ';type=' + file.type : '') + '"';
      }
    });

    if ($('#input-log-type').val() && $('#input-log-format').val()) {
      cmd += ' -H "Log-Format-' + $('#input-log-type').val() + ': ' + $('#input-log-format').val().replace(/"/g, '\\"') + '"';
    }

    if ($('#input-result-format').val()) {
      cmd += ' -H "Accept: ' + $('#input-result-format').val() + '"';
    }

    if ($('#input-traces').val()) {
      cmd += ' -H "Traces-Level: ' + $('#input-traces').val() + '"';
    }

    $('div.user-field').each(function (i) {
      var fieldGroup = $(this);
      var src      = fieldGroup.find('.input-user-field-src').val();
      var sep      = fieldGroup.find('.input-user-field-sep').val();
      var residual = fieldGroup.find('.input-user-field-residual').val();
      var dests    = fieldGroup.find('.dest');

      if (src) {
        cmd += ' -H "User-Field' + i + '-src: ' + src + '"';
      }
      if (sep) {
        cmd += ' -H "User-Field' + i + '-sep: ' + sep + '"';
      }
      if (residual) {
        cmd += ' -H "User-Field' + i + '-residual: ' + residual + '"';
      }
      dests.each(function () {
        var dest   = $(this);
        var name   = dest.find('.input-user-field-dest-name').val();
        var regexp = dest.find('.input-user-field-dest-regexp').val();
        if (name && regexp) {
          cmd += ' -H "User-Field' + i + '-dest-' + name + ': ' + regexp.replace(/"/g, '\\"') + '"';
        }
      });
    });

    if ($('#input-output-fields').val()) {
      cmd += ' -H "Output-Fields: ' + $('#input-output-fields').val() + '"';
    }

    cmd += ' ' + host;
    curldiv.val(cmd);
  }
  generateCurl();

  $(document).on('change', 'input, select, #advanced-options textarea', generateCurl);

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

  $('#user-fields').on('blur', 'input', function () {

    var lastField  = $('div#user-fields').find('div.user-field').last();

    var src      = lastField.find('.input-user-field-src').val();
    var sep      = lastField.find('.input-user-field-sep').val();
    var residual = lastField.find('.input-user-field-residual').val();
    var dests    = lastField.find('.user-field-dest');
    if (src && sep) {
      dests.each(function () {
        var dest   = $(this);
        var name   = dest.find('.input-user-field-dest-name').val();
        var regexp = dest.find('.input-user-field-dest-regexp').val();
        if (name && regexp) {
          $('#user-fields').append('<hr/>');
          $('#user-fields').append($('#user-field-template').html());
          return;
        }
      });
    }
  });

  $('#user-fields').on('keyup', '.user-field-dest input', function () {

    var destsDiv    = $(this).parents('.user-field-dest');
    var dests       = destsDiv.find('.dest');
    var nbDests     = dests.length;
    var allFilled = true;
    dests.each(function (i) {
      var dest   = $(this);
      var name   = dest.find('.input-user-field-dest-name').val();
      var regexp = dest.find('.input-user-field-dest-regexp').val();
      if (!name && !regexp && (i + 1 < nbDests)) {
        dest.next().find('input').first().focus();
        dest.remove();
      } else if (!name || !regexp) {
        allFilled = false;
        return;
      }
    });
    if (allFilled) {
      destsDiv.append($('#dest-template').html());
    }
  });

  function handleError(status, message) {
    var reportLink = '/' + jobid + '/job-report.html';
    if (status == '4003') { reportLink += '#first-line'; }

    if (message) {
      error = status + ", " + message;
    } else {
      error = status;
    }

    error += '<br/>(more details can be found in the ' +
             '<a href="' + reportLink + '" target="_blank">job report</a>)';

    if (status) {
      $("#error").html(error);
    } else {
      $("#error").text("500, Internal Server Error");
    }

    $('#process-info').slideUp(function () {
      $('.alert-error').slideDown();
    });
  }

  /**
   * On click on the submit button, generates jobid, headers with advanced options,
   * then test if files are submitted. If not, display an error and do nothing.
   * Else, PUT the files with the headers.
   */
  $('#submit').on('click', function () {

    jobid = uuid.v1();
    logroute = '/' + jobid + '/';

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

    $('div.user-field').each(function (i) {
      var fieldGroup = $(this);
      var src      = fieldGroup.find('.input-user-field-src').val();
      var sep      = fieldGroup.find('.input-user-field-sep').val();
      var residual = fieldGroup.find('.input-user-field-residual').val();
      var dests    = fieldGroup.find('.dest');

      if (src) {
        headers['User-Field' + i + '-src'] = src;
      }
      if (sep) {
        headers['User-Field' + i + '-sep'] = sep;
      }
      if (residual) {
        headers['User-Field' + i + '-residual'] = residual;
      }
      dests.each(function () {
        var dest   = $(this);
        var name   = dest.find('.input-user-field-dest-name').val();
        var regexp = dest.find('.input-user-field-dest-regexp').val();
        if (name && regexp) {
          headers['User-Field' + i + '-dest-' + name] = regexp;
        }
      });
    });

    if ($('#input-output-fields').val()) {
      headers['Output-Fields'] = $('#input-output-fields').val();
    }

    if ($('#input-request-charset').val()) {
      headers['Request-Charset'] = $('#input-request-charset').val();
    }

    if ($('#input-response-charset').val()) {
      headers['Response-Charset'] = $('#input-response-charset').val();
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

    var xhr = $.ajax({
      headers: headers,
      type:    'PUT',
      url:     '/' + jobid,
      xhr: function() {
        var myXhr = $.ajaxSettings.xhr();
        if(myXhr.upload) { // check if upload property exists
          myXhr.upload.addEventListener('progress', function (e) {
            if(e.lengthComputable){
              var percentComplete = ( e.loaded * 100 ) / e.total;
              $('.bar').width(percentComplete + "%");
              $('.bar').text(percentComplete.toFixed(0) + "%");
            }
          });
          myXhr.upload.addEventListener('load', function (e) {
            $('.bar').width("100%");
            $('.bar').text("100%");
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
        $('#get-btn').prop('href', '/' + jobid);

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
        if (textStatus != 'abort') {
          var status  = jqXHR.getResponseHeader("ezPAARSE-Status");
          var message = jqXHR.getResponseHeader("ezPAARSE-Status-Message");
          handleError(status, message);
        }

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

    socket.on('joberror', function (status, message) {
      xhr.abort();
      handleError(status, message);
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