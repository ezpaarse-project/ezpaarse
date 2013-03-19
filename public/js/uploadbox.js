var host = $(location).attr('protocol') + '//' + $(location).attr('host');
var socket = io.connect(host);
var selectedFile;
var selectedLocalFile;
var FReader;

function fileDragHover(evnt) {
  evnt.stopPropagation();
  evnt.preventDefault();
  evnt.target.className = (evnt.type == "dragover" ? "hover" : "");
}

function fileChosen(evnt) {
  fileDragHover(evnt);
  var file;
  if (evnt.target.files) {
    file = evnt.target.files[0];
  } else {
    file = evnt.originalEvent.dataTransfer.files[0];
    $('#inputFile').val('');
  }
  
  if (file) {
    selectedFile = file;
    var isBig = false;
    var size  = file.size;
    var unit  = '';
    if (size < 1024) {
      unit = 'octets';
    } else if ((size /= 1024).toFixed(2) < 1024) {
      unit = 'Ko';
    } else if ((size /= 1024).toFixed(2) < 1024) {
      isBig = (size > 200);
      unit = 'Mo';
    } else if ((size /= 1024).toFixed(2) < 1024) {
      isBig = true;
      unit = 'Go';
    }

    if (isBig) {
      $('#uploadWarning').text('Le fichier est volumineux (>200Mo), le processus peut être long.').show();
    } else {
      $('#uploadWarning').hide().empty();
    }

    $('#fileInfo').html('Sélectionné :<br /><strong>' + file.name + ' (' + Math.floor(size * 100) / 100 + ' ' + unit + ')</strong>');
    $('#localFiles span.localFile').removeClass('selected');
    selectedLocalFile = false;
  }
}

function localFileChosen(evnt) {
  var target = $(evnt.target);
  file = {
    name: target.text(),
    location: target.attr('title')
  }
  selectedLocalFile = file;
  $('#localFiles span.localFile').removeClass('selected');
  target.addClass('selected');
  $('#fileInfo').html('Sélectionné :<br /><strong>' + file.name + ' (fichier local)</strong>');
  $('#inputFile').val('');
  selectedFile = false;
}

function setDragAndDrop() {
  var filedrag = $('#dropBox');
  filedrag.on("dragover", fileDragHover);
  filedrag.on("dragleave", fileDragHover);
  filedrag.on("drop", fileChosen);
}

function fillLocalFiles() {
  $.ajax({
    url: "http://127.0.0.1:59599/ws/datasets/",
    dataType: 'json'
  }).done(function (datasets) {
    var div = $('#localFiles');
    for (var filename in datasets) {
      var content = '<span class="localFile" title="' + datasets[filename].location + '">';
      content += filename + '</span>';
      content += ' <span>(' + datasets[filename].size + ')</span><br />';
      div.append(content);
    }
    $('#localFiles span.localFile').on("click", localFileChosen);
  }).error(function () {
    $('#localFiles').text('Le dossier local n\'a pas pu être parcouru.');
  });
}

window.addEventListener("load", ready);
function ready(){
   if (window.File && window.FileReader) { //These are the relevant HTML5 objects that we are going to use
      $('#uploadButton').on('click', startUpload);
      $('#inputFile').on('change', fileChosen);
      setDragAndDrop();
      fillLocalFiles();
   } else {
      $('#uploadArea').text("Your Browser Doesn't Support The File API Please Update Your Browser");
   }
}

function startUpload() {
    if (selectedFile || selectedLocalFile) {
      var accept          = $('#accept').val();
      var contentEncoding = $('#contentEncoding').val();
      var acceptEncoding  = $('#acceptEncoding').val();
      var proxyName       = $('#proxyName').val();
      var logFormat       = $('#logFormat').val();
      var streamRequest   = $('#streamRequest').is(':checked');
      var streamResponse  = $('#streamResponse').is(':checked');

      var headers = {};
      if (proxyName && logFormat) {
        headers['LogFormat-' + proxyName] = logFormat;
      }
      if (accept)          { headers['Accept'] = accept; }
      if (contentEncoding) { headers['Content-Encoding'] = contentEncoding; }
      if (acceptEncoding)  { headers['Accept-Encoding'] = acceptEncoding; }


      if (streamResponse) {
        var resultArea = '<div class="header">';
        resultArea += '<input type="button" value="Sélectionner tout" onClick="javascript:$(\'.text\').focus();$(\'.text\').select();">';
        resultArea += '<h3>Résultat</h3>';
        resultArea += '</div>';
        resultArea += '<textarea class="text" readOnly></textarea>';
        $('#resultBox').html(resultArea);
      }

      if (!selectedLocalFile) {
        var uploadArea = '<span id="NameArea">Envoi de ' + selectedFile.name + '</span>';
        uploadArea += '<div id="progressHolder"><div id="progressBar"></div></div>';
        uploadArea += '<span id="percent">0%</span>';
        uploadArea += '<span id="Uploaded"> - ';
        uploadArea += '<span id="MB">0</span>/';
        uploadArea += Math.round(selectedFile.size / 1048576) + 'Mo</span>';
      }
      $('#uploadArea').html(uploadArea);
      $('#uploadButton').prop('disabled', true);

      var options = {
        streamRequest: streamRequest,
        streamResponse: streamResponse,
        headers: headers
      }
      if (!selectedLocalFile) {
        FReader = new FileReader();
        FReader.onload = function(evnt){
          socket.emit('upload', evnt.target.result );
        }
        options.fileName = selectedFile.name;
        options.fileSize = selectedFile.size;
      } else {
        options.fileName = selectedLocalFile.name;
        options.location = selectedLocalFile.location;
      }
      socket.emit('start', options);
    } else {
      alert("Veuillez sélectionner un fichier");
    }
}

socket.on('moreData', function (data) {
  updateBar(data.percent);
  var place = data.place * 524288; //The Next Blocks Starting Position
  var newFile; //The Variable that will hold the new Block of Data
  if (selectedFile.slice) {
    newFile = selectedFile.slice(place, place + Math.min(524288, (selectedFile.size-place)));
  } if (selectedFile.webkitSlice) {
    newFile = selectedFile.webkitSlice(place, place + Math.min(524288, (selectedFile.size-place)));
  } else if (selectedFile.mozSlice) {
    newFile = selectedFile.mozSlice(place, place + Math.min(524288, (selectedFile.size-place)));
  }
  FReader.readAsBinaryString(newFile);
});

socket.on('error', function (message) {
  $('#infoArea img.loader').last().attr('src', '/img/fail.png');
  if (message)
    $('#infoArea').append('<br /><span class="error">' + message + '</span>');
});

socket.on('taskWarning', function (message) {
  if (message) {
    var warning = '<br />';
    warning += '<img src="/img/warning.png" class="warning" />';
    warning += ' <span class="warning">' + message + '</span>';
    $('#infoArea').append(warning);
  }
});

socket.on('taskStart', function (message) {
  if (message) {
    var task = '<br />';
    task += '<img src="/img/loader.gif" class="loader" />';
    task += ' <span>' + message + '</span>';
    $('#infoArea').append(task);
  }
});

socket.on('taskSuccess', function () {
  $('#infoArea img.loader').last().attr('src', '/img/success.png');
});

socket.on('downloaded', function () {
  updateBar(100);
});

socket.on('done', function (message, downloadPATH) {
  $('#infoArea').append('<br /><span class="success">' + message + '</span>');
  if (downloadPATH) {
    var downloadURL = host + downloadPATH;
    $('#resultBox').css('text-align', 'center').html('Résultat disponible ici : <a href="' + downloadURL + '">' + downloadURL + '</a>');
  }
  $('#uploadButton').prop('disabled', false);
});

function updateBar(percent) {
  $('#progressBar').width(percent + '%');
  $('#percent').text((Math.round(percent*100)/100) + '%');
  var MBDone = Math.round(((percent/100.0) * selectedFile.size) / 1048576);
  $('#MB').text(MBDone);
}

socket.on('resData', function (data) {
  $('#resultBox textarea').append(data);
});