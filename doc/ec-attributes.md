# Attributes of a Consultation Event #

A consultation event (CE in english and EC in french) is the data that ezpaarse will produce thanks to one line of significant log line. The log line contains basic and generic data as for example the date of the user's consultation, the login of the user, the url downloaded, the status code ... Then ezpaarse process this log line. The URL will be parsed and enriched with KBART knowledge base (publisher knowledge base: PKB) or API (eg. Crossref). The result will be called a consultation event that will contains a liste of key/value. The possible key (attributes) are listed bellow:

## Typical Attributes found in a Consultation Event##
<table>
  <tr>
    <th>Attribute Name</th>
    <th>Description</th>
    <th>Example</th>
  </tr>
  <tr>
    <td>Date</td>
    <td>Date of the consultation event</td>
    <td>2014-12-16</td>
  </tr>
  <tr>
    <td>Login</td>
    <td>Login, encrypted or not</td>
    <td>8olq8</td>
  </tr>
  <tr>
    <td>Platform</td>
    <td>ezPAARSE Platform's code (ie. parser's name)</td>
    <td>hw</td>
  </tr>
  <tr>
    <td>Platform_name</td>
    <td>long name of the vendor's platform</td>
    <td>Highwire</td>
  </tr>
  <tr>
    <td>Publisher_name</td>
    <td>Long name of the publisher (can be different from the platform name)</td>
    <td>American Physiological Society</td>
  </tr>
  <tr>
    <td>Rtype</td>
    <td>Resource type</td>
    <td>ARTICLE</td>
  </tr>
  <tr>
    <td>Mime</td>
    <td>Mime type</td>
    <td>PDF</td>
  </tr>
  <tr>
    <td>Print_identifier</td>
    <td>usually ISSN</td>
    <td>0021-9797</td>
  </tr>
  <tr>
    <td>Online_identifier</td>
    <td>usually eISSN</td>
    <td>0021-9898</td>
  </tr>
  <tr>
    <td>Title_id</td>
    <td>Title identifier (see KBART specification)</td>
    <td>ACHRE</td>
  </tr>
  <tr>
    <td>Doi</td>
    <td></td>
    <td>10.1007/s10557-015-6582-9</td>
  </tr>
  <tr>
    <td>Publication_Title</td>
    <td>Book or journal title</td>
    <td>Journal of Pediatric Surgery</td>
  </tr>
  <tr>
    <td>UnitId</td>
    <td>see below</td>
    <td>SOO21979714009205</td>
  </tr>
  <tr>
    <td>Domain</td>
    <td>domain name as found in the requested URL</td>
    <td>ac.els-cdn.com</td>
  </tr>
  <tr>
    <td>Geoip-Country</td>
    <td>Country abbrev. found for the host's IP address</td>
    <td>FR</td>
  </tr>
  <tr>
    <td>Geoip-Latitude</td>
    <td>Latitude found for the host's IP address</td>
    <td>62</td>
  </tr>
  <tr>
    <td>Geoip-Longitude</td>
    <td>Longitude found for the host's IP address</td>
    <td>15</td>
  </tr>
  <tr>
    <td>Datetime</td>
    <td>Time for the consultation event</td>
    <td>2014-12-16T09:58:43</td>
  </tr>
  <tr>
    <td>Host</td>
    <td>IP address of the user</td>
    <td>62.247.28.26</td>
  </tr>
  <tr>
    <td>Url</td>
    <td>URL requested by the user to access a resource</td>
    <td>http://link.springer.com:80/article/10.1007/s10557-015-6582-9</td>
  </tr>
  <tr>
    <td>Status</td>
    <td>HTTP status</td>
    <td>200</td>
  </tr>
  <tr>
    <td>Size</td>
    <td>Request size (in bytes)</td>
    <td>65816</td>
  </tr>
	
</table>
For more information, see all the [output fields](parametres.html#output-fields) you can request.

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
