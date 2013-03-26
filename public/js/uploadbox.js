var host = $(location).attr('protocol') + '//' + $(location).attr('host');
var socket = io.connect(host);
var selectedFile;
var selectedLocalFile;
var FReader;
var grid;
var dataView;

var rowObject = {};
var rowKey    = '';
var rowNumber = 1;
var parser = clarinet.parser();
parser.onvalue = function (value) {
  rowObject[rowKey] = value;
};
parser.onopenobject = function (key) {
  rowKey = key;
}
parser.onkey = function (key) {
  rowKey = key;
}
parser.oncloseobject = function () {
  rowObject.id = rowNumber;
  dataView.beginUpdate();
  dataView.insertItem(rowNumber, rowObject);
  dataView.endUpdate();
  rowObject = {};
  grid.scrollRowIntoView(rowNumber);
  rowNumber++;
};

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
    if (/\.gz$/.test(file.name)) {
      $('#contentEncoding').val('gzip');
    } else {
      $('#contentEncoding').val('');
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
  if (/\.gz$/.test(file.name)) {
    $('#contentEncoding').val('gzip');
  } else {
    $('#contentEncoding').val('');
  }
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
    url: "/ws/datasets/",
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
      $('#acceptEncoding').on('change', function () {
        if ($(this).val() !== '') {
          $('#streamResponse').prop('disabled', true);
          $('#streamResponse').prop('checked', false);
          $('label[for=streamResponse]').css('color', '#C0C0C0');
          $('#streamResponse').change();
        } else {
          $('#streamResponse').prop('disabled', false);
          $('label[for=streamResponse]').css('color', 'inherit');
        }
      });
      $('#streamResponse').on('change', function () {
        if ($(this).is(':checked')) {
          $('#accept').prop('disabled', true);
          $('label[for=accept]').css('color', '#C0C0C0');
        } else {
          $('#accept').prop('disabled', false);
          $('label[for=accept]').css('color', 'inherit');
        }
      });
      $('#accept').prop('disabled', true);
      $('label[for=accept]').css('color', '#C0C0C0');
   } else {
      $('#uploadArea').text("Your Browser Doesn't Support The File API Please Update Your Browser");
   }
}

function exportCSV() {
  var fieldSeparator = ';';
  var textSeparator  = '\"';
  var data           = grid.getData().getItems();
  var columns        = grid.getColumns();
  var csvContent     = '';
  var index          = 0;
  var length         = data.length;
  var line           = '';
  var filename       = selectedFile.name || selectedLocalFile.name;
  if (filename) {
    filename += '.result.csv';
  } else {
    filename = 'result.csv';
  }

  var resultArea = '<div class="progressHolder"><div class="progressBar"></div></div>';
  resultArea += '<img src="/img/loader.gif"/> Génération du fichier CSV';
  resultArea += '<br /><strong><span id="processedLines">0</span> / ' + length + '</strong> lignes générées.';
  $('#export').html(resultArea);
  var processedLines = $('#processedLines');
  var progressBar    = $('#export .progressBar');
  var percentDone    = 0;

  columns.forEach(function (column) {
    line += (line === '' ? '' : fieldSeparator);
    line += column.name;
  });
  csvContent += line;

  var process = function () {
    if (index < length) {
      var rowObj = data[index];
      line = '';
      for (var i = 0, l = columns.length; i < l; i++) {
        line += (line === '' ? '\r\n' : fieldSeparator);
        line += textSeparator;
        line += rowObj[columns[i].field] || '';
        line += textSeparator;
      }
      csvContent += line;
      index++;
      percentDone = (index / length) * 100;
      progressBar.width(percentDone + '%');
      processedLines.text(index);
      // Wait 5ms every 100 rows to lighten browser load a little
      if (index % 100 === 0) {
        setTimeout(process, 5);
      } else {
        process();
      }
    } else {
      Downloadify.create('export',{
        filename: filename,
        data: csvContent,
        onComplete: function(){ $('#export').html('<strong>Fichier sauvegardé</strong>'); },
        onError: function(){ alert('Impossible de sauvegarder'); },
        swf: '/downloadify/media/downloadify.swf',
        downloadImage: '/downloadify/images/download.png',
        width: 215,
        height: 25,
        transparent: true,
        append: false
      });
    }
  }
  process();
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

      if (streamResponse) {
        // One format is enough as we have to parse the response into json anyway
        // Accepting more formats would require more client-side stream parsers
        accept = 'application/json';
      }

      var headers = {};
      if (proxyName && logFormat) {
        headers['LogFormat-' + proxyName] = logFormat;
      }
      if (accept)          { headers['Accept'] = accept; }
      if (contentEncoding) { headers['Content-Encoding'] = contentEncoding; }
      if (acceptEncoding)  { headers['Accept-Encoding'] = acceptEncoding; }


      if (streamResponse) {
        var hasFlash = swfobject.getFlashPlayerVersion().major;

        var resultArea = '<div id="export">';
        resultArea += '<input type="button" value="Générer un fichier CSV" onClick="exportCSV()" disabled>';
        if (!hasFlash) {
          resultArea += '<br /><span class="warning">Nécessite Flash version 10 ou plus.';
          resultArea += '<br /><a href="http://get.adobe.com/fr/flashplayer/" target="_blank">Installer Flash.</a></span>';
        }
        resultArea += '</div>';
        resultArea += '<div id="resultGrid"></div>';
        $('#resultBox').html(resultArea);
        var columns = [
          {id: "id", name: "#", field: "id",behavior: "select", cssClass: "cell-selection",
          width: 60, cannotTriggerInsert: true, selectable: false },
          {id: "host",    name: "host",   field: "host",    width: 150 },
          {id: "login",   name: "login",  field: "login",   width: 150 },
          {id: "date",    name: "date",   field: "date",    width: 230},
          {id: "status",  name: "status", field: "status",  width: 60},
          {id: "type",    name: "type",   field: "type",    width: 90},
          {id: "size",    name: "size",   field: "size",    width: 70},
          {id: "issn",    name: "issn",   field: "issn",    width: 90},
          {id: "eissn",   name: "eissn",  field: "eissn",   width: 90},
          {id: "doi",     name: "doi",    field: "doi",     width: 90},
          {id: "domain",  name: "domain", field: "domain",  width: 140},
          {id: "url",     name: "url",    field: "url",     width: 60}
        ];
        var options = {
          enableCellNavigation: true,
          enableColumnReorder: false
        };
        rowNumber = 1;

        dataView = new Slick.Data.DataView({ inlineFilters: true });
        dataView.onRowCountChanged.subscribe(function (e, args) {
          grid.updateRowCount();
          grid.render();
        });
        dataView.onRowsChanged.subscribe(function (e, args) {
          grid.invalidateRows(args.rows);
          grid.render();
        });

        grid = new Slick.Grid($("#resultGrid"), dataView, columns, options);
      } else {
        $('#resultBox').empty();
      }
      $('#infoArea').empty();

      if (!selectedLocalFile) {
        var uploadArea = '<span id="NameArea">Envoi de ' + selectedFile.name + '</span>';
        uploadArea += '<div class="progressHolder"><div class="progressBar"></div></div>';
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
var result = '';
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
  var div = '<div class="success"><img src="/img/success-big.png" /><p>';
  div += message || '';
  div += '</p></div>';
  $('#infoArea').append(div);
  if (downloadPATH) {
    var downloadURL = host + downloadPATH;
    $('#resultBox').css('text-align', 'center').html('Résultat disponible ici : <a href="' + downloadURL + '">' + downloadURL + '</a>');
  }
  $('#export input').prop('disabled', false);
  $('#uploadButton').prop('disabled', false);
});

function updateBar(percent) {
  $('#uploadBox .progressBar').width(percent + '%');
  $('#percent').text((Math.round(percent*100)/100).toFixed(2) + '%');
  var MBDone = Math.round(((percent/100.0) * selectedFile.size) / 1048576);
  $('#MB').text(MBDone);
}

socket.on('resData', function (data) {
  parser.write(data);
});