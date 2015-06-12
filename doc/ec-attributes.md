# Attributes of a Consultation Event #

## Resources' identifiers ##

The identifier of a resource allows to characterize the events of consultations associated with it. It can take the values defined in the table below (loaded from [the settings of ezPAARSE](https://github.com/ezpaarse-project/ezpaarse-platforms/blob/master/rid.json)). A resource can also be characterized by several identifiers at the same time (eg. a proprietary identifier and an ISBN).

<div>
  <table class="inline">
    <tbody id="ridTable">
      <tr class="row0">
        <th class="col0">Code</th><th class="col1">Description</th><th class="col2">Comments</th>
      </tr>
    </tbody>
  </table>
</div>

<script type="text/javascript">
jQuery(document).ready(function($) {
  var dom_ec = $('#ridTable');
  $.ajax({
    url: "http://ezpaarse.couperin.org/info/rid?sort=asc",
    dataType: 'json'
  }).done(function(rids) {
    $.each(rids, function (i, rid) {
      var line = '<tr class="row' + i + '"><td class="col0">' + rid.code + '</td><td class="col1">' + rid.description + '</td><td class="col2">' + rid.comment + '</td></tr>';
      dom_ec.append(line);
    });
  }).error(function() {
    var line = '<tr class="row1"><td class="col0" colspan="3" style="color: red">Error while retrieving the data</td></tr>';
    dom_ec.append(line);
  });

});
</script>

### unitid ###

The unitid contains the most accurate identifier for a consultation event on a platform (ie. which describes it with the finest granularity). This identifier does not exclude the use of other identifiers. It is used for the deduplication of EC according to the [COUNTER](http://www.projectcounter.org/) standard in use and provides librarians with useful indicators.

This may be the DOI or a more complex identifier that will spot as precisely as possible what has been consulted (eg. a paragraph of an article of a page of a book).

## Resources Types (rtype) ##

The type of a resource allows to know the nature of a resource and characterize the associated EC. It can take one of the values defined in the table below (loaded from [setting of ezPAARSE](https://github.com/ezpaarse-project/ezpaarse-platforms/blob/master/rtype.json)).

<div>
  <table class="inline">
    <tbody id="rtypeTable">
      <tr class="row0">
        <th class="col0">Code</th><th class="col1">Description</th><th class="col2">Comments</th>
      </tr>
    </tbody>
  </table>
</div>

<script type="text/javascript">
jQuery(document).ready(function($) {
  var dom_ec = $('#rtypeTable');
  $.ajax({
    url: "http://ezpaarse.couperin.org/info/rtype?sort=asc",
    dataType: 'json'
  }).done(function(rtypes) {
    $.each(rtypes, function (i, rtype) {
      var line = '<tr class="row' + i + '"><td class="col0">' + rtype.code + '</td><td class="col1">' + rtype.description + '</td><td class="col2">' + rtype.comment + '</td></tr>';
      dom_ec.append(line);
    });
  }).error(function() {
    var line = '<tr class="row1"><td class="col0" colspan="3" style="color: red">Error while retrieving the data</td></tr>';
    dom_ec.append(line);
  });

});
</script>

## Resources Formats (mime) ##

The format of a resource allows to characterize the associated EC. It can take one of the values defined in the table below (loaded from the [settings of ezPAARSE](https://github.com/ezpaarse-project/ezpaarse-platforms/blob/master/mime.json)).

<div>
  <table class="inline">
    <tbody id="mimeTable">
      <tr class="row0">
        <th class="col0">Code</th><th class="col1">Description</th><th class="col2">Comments</th>
      </tr>
    </tbody>
  </table>
</div>

<script type="text/javascript">
jQuery(document).ready(function($) {
  var dom_ec = $('#mimeTable');
  $.ajax({
    url: "http://ezpaarse.couperin.org/info/mime?sort=asc",
    dataType: 'json'
  }).done(function(mimes) {
    $.each(mimes, function (i, mime) {
      var line = '<tr class="row' + i + '"><td class="col0">' + mime.code + '</td><td class="col1">' + mime.description + '</td><td class="col2">' + mime.comment + '</td></tr>';
      dom_ec.append(line);
    });
  }).error(function() {
    var line = '<tr class="row1"><td class="col0" colspan="3" style="color: red">Error while retrieving the data</td></tr>';
    dom_ec.append(line);
  });

});
</script>
