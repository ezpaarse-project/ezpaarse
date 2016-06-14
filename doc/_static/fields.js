window.onload = function() {
  var doms = {
    'rid': $('#ridTable'),
    'rtype': $('#rtypeTable'),
    'mime': $('#mimeTable')
  };

  $.ajax({
    url: "https://raw.githubusercontent.com/ezpaarse-project/ezpaarse-platforms/master/fields.json",
    dataType: 'json'
  }).done(function(fields) {
    for (var type in doms) {
      fields[type].sort(function (a, b) {
        return a.code > b.code ? 1 : -1;
      }).forEach(function (el, i) {
        if (el.comment) {
          el.description = (el.description || '') + '<br>' + el.comment;
        }

        doms[type].append([
          '<tr>',
          '<td>' + (el.code || '') + '</td>',
          '<td>' + (el.description || '') + '</td>',
          '</tr>'
        ].join(''));
      });
    }
  }).error(function() {
    var line = [
      '<tr>',
      '<td colspan="3" style="color: red">Error while retrieving the data</td>',
      '</tr>'
    ].join('');

    for (var type in doms) {
      doms[type].append(line);
    }
  });
};
