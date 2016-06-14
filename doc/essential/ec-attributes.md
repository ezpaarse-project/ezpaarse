# Consultation events #

A consultation event (abbreviated `EC`) is what ezPAARSE produces when it detects an actual consultation of e-resource in the logs. Each EC is generated with some generic data found in the original log line (date, user login, URL of the resource...), and is enriched with various methods.

By default, ezPAARSE produces a CSV output with a limited amount of fields. You can add or remove some fields by using the [Output-Fields](../features/outputfields.html) header. You can also choose a [JSON output](../configuration/parametres.html#accept) to get ECs with all their properties.

Here is a list of fields that can be found in the consultation events :

## Typical properties of an EC ##
<table>
  <thead>
    <tr>
      <th>Attribute Name</th>
      <th>Description</th>
      <th>Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>date</td>
      <td>Date of the consultation event</td>
      <td>2014-12-16</td>
    </tr>
    <tr>
      <td>login</td>
      <td>Login, encrypted or not</td>
      <td>8olq8</td>
    </tr>
    <tr>
      <td>platform</td>
      <td>ezPAARSE Platform's short code (ie. parser's name) eg: sd for siencedirect</td>
      <td>hw</td>
    </tr>
    <tr>
      <td>platform_name</td>
      <td>long name of the vendor's platform</td>
      <td>Highwire</td>
    </tr>
    <tr>
      <td>publisher_name</td>
      <td>Long name of the publisher (can be different from the platform name)</td>
      <td>American Physiological Society</td>
    </tr>
    <tr>
      <td>rtype</td>
      <td>Resource type</td>
      <td>ARTICLE</td>
    </tr>
    <tr>
      <td>mime</td>
      <td>Mime type of the ressource</td>
      <td>PDF</td>
    </tr>
    <tr>
      <td>print_identifier</td>
      <td>usually ISSN (paper)</td>
      <td>0021-9797</td>
    </tr>
    <tr>
      <td>online_identifier</td>
      <td>usually eISSN (electronic)</td>
      <td>0021-9898</td>
    </tr>
    <tr>
      <td>title_id</td>
      <td>Title identifier (see KBART specification)</td>
      <td>ACHRE</td>
    </tr>
    <tr>
      <td>doi</td>
      <td></td>
      <td>10.1007/s10557-015-6582-9</td>
    </tr>
    <tr>
      <td>publication_Title</td>
      <td>Book or journal title</td>
      <td>Journal of Pediatric Surgery</td>
    </tr>
    <tr>
      <td>unitid</td>
      <td>see below</td>
      <td>SOO21979714009205</td>
    </tr>
    <tr>
      <td>domain</td>
      <td>domain name as found in the requested URL</td>
      <td>ac.els-cdn.com</td>
    </tr>
    <tr>
      <td>geoip-country</td>
      <td>Country abbrev. found for the host's IP address</td>
      <td>FR</td>
    </tr>
    <tr>
      <td>geoip-latitude</td>
      <td>Latitude found for the host's IP address</td>
      <td>62</td>
    </tr>
    <tr>
      <td>geoip-longitude</td>
      <td>Longitude found for the host's IP address</td>
      <td>15</td>
    </tr>
    <tr>
      <td>datetime</td>
      <td>Time for the consultation event</td>
      <td>2014-12-16T09:58:43</td>
    </tr>
    <tr>
      <td>host</td>
      <td>IP address of the user</td>
      <td>62.247.28.26</td>
    </tr>
    <tr>
      <td>url</td>
      <td>URL requested by the user to access a resource</td>
      <td>http://link.springer.com:80/article/10.1007/s10557-015-6582-9</td>
    </tr>
    <tr>
      <td>status</td>
      <td>HTTP status</td>
      <td>200</td>
    </tr>
    <tr>
      <td>size</td>
      <td>Request size (in bytes)</td>
      <td>65816</td>
    </tr>
    <tr>
      <td>id</td>
      <td>Unique ID calculated by applying a SHA1 on the log line</td>
      <td>f9c2c138f4998573b893696c3de3341cdabd1fb0</td>
    </tr>
  </tbody>
</table>
For more information, see all the [output fields](parametres.html#output-fields) you can request.

## Resources' identifiers ##

The identifier of a resource allows to characterize the events of consultations associated with it. It can take the values defined in the table below (loaded from [the settings of ezPAARSE](https://github.com/ezpaarse-project/ezpaarse-platforms/blob/master/fields.json)). A resource can also be characterized by several identifiers at the same time (eg. a proprietary identifier and an ISBN).

<table>
  <thead>
    <tr>
      <th>Code</th>
      <th>Description</th>
    </tr>
  </thead>

  <tbody id="ridTable"></tbody>
</table>

### unitid ###

The unitid contains the most accurate identifier for a consultation event on a platform (ie. which describes it with the finest granularity). This identifier does not exclude the use of other identifiers. It is used for the deduplication of EC according to the [COUNTER](http://www.projectcounter.org/) standard in use and provides librarians with useful indicators.

This may be the DOI or a more complex identifier that will spot as prcisely as possible what has been consulted (eg. a paragraph of an article of a page of a book).

## Resources Types (rtype) ##

The type of a resource allows to know the nature of a resource and characterize the associated EC. It can take one of the values defined in the table below (loaded from [setting of ezPAARSE](https://github.com/ezpaarse-project/ezpaarse-platforms/blob/master/fields.json)).

<table>
  <thead>
    <tr>
      <th>Code</th>
      <th>Description</th>
    </tr>
  </thead>

  <tbody id="rtypeTable"></tbody>
</table>

## Resources Formats (mime) ##

The format of a resource allows to characterize the associated EC. It can take one of the values defined in the table below (loaded from the [settings of ezPAARSE](https://github.com/ezpaarse-project/ezpaarse-platforms/blob/master/fields.json)).

<table>
  <thead>
    <tr>
      <th>Code</th>
      <th>Description</th>
    </tr>
  </thead>

  <tbody id="mimeTable"></tbody>
</table>

<script type="text/javascript" src="../_static/fields.js"></script>
