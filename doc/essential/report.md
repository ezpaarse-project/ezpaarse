# Job reports #

ezPAARSE generates an execution report, everytime it processes a log file.
The various sections of this report are documented below.

- [General](#general): contains general information related to the processing
- [Rejects](#rejects): lists all rejects, how much they are and the links to the files containing the rejected lines
- [Statistics](#statistics): provides the first global figures
- [Alerts](#alerts): lists the active alerts
- [Notifications](#notifications): lists the email for the recipients of processing notifications
- [Duplicates](#deduplicating): algorithm used for deduplication
- [File](#files): list of processed log files
- [First consultation](#first-consultation-event): content of the first access event

There is also a special file called `domains.miss.csv`, located at the root of the `/ezpaarse` where unknown domains get stored (deduplicated and sorted). This file persists between every processing job. See [below](#unknown-domains) for details.

## General ##

<table>
<tbody>
  <tr>
    <th>Job-Date</th>
    <td>2014-06-16T14:55:04+02:00
      <div class="comment">Processing date</div>
    </td>
  </tr><tr>
    <th>Job-Done</th>
    <td>true
      <div class="comment">Has the processing correctly completed?</div>
    </td>
  </tr><tr>
    <th>Job-Duration</th>
    <td>4 m 22 s
      <div class="comment">Processing duration</div>
    </td>
  </tr><tr>
    <th>Job-ID</th>
    <td>6f601540-f555-11e3-b477-758199fa5dc1
      <div class="comment">Unique Identifier for the processing</div>
    </td>
  </tr><tr>
    <th>Rejection-Rate</th>
    <td>96.74 %
      <div class="comment">Rejected lines rate (ie. unknown domains, duplicates,etc.) among the relevant lines</div>
    </td>
  </tr><tr>
    <th>URL-Traces</th>
    <td><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/job-traces.log">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/job-traces.log</a>
    <div class="comment">Access to the execution traces for the processing</div>
    </td>
  </tr><tr>
    <th>client-user-agent</th>
    <td>Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/33.0.1750.152 Chrome/33.0.1750.152 Safari/537.36
    </td>
  </tr><tr>
    <th>ezPAARSE-version</th>
    <td>ezPAARSE 2.3.0
    </td>
  </tr><tr>
    <th>geolocalization</th>
    <td>all
      <div class="comment">Requested geo-location fields</div>
    </td>
  </tr><tr>
    <th>git-branch</th>
    <td>master
    </td>
  </tr><tr>
    <th>git-last-commit</th>
    <td>429e61bf29e80326b09958b0a68a01c0ae3add91
    </td>
  </tr><tr>
    <th>git-tag</th>
    <td>1.7.0
    </td>
  </tr><tr>
    <th>input-first-line</th>
    <td>rate-limited-proxy-72-14-199-16.google.com - - [19/Nov/2013:00:11:05 +0100] "GET http://gate1.inist.fr:50162/login?url=http://www.nature.com/rss/feed?doi=10.1038/465529d HTTP/1.1" 302 0
    <div class="comment">First log line found in a submitted log file</div>
    </td>
  </tr><tr>
    <th>input-format-literal</th>
    <td>%h %l %u %t "%r" %s %b (ezproxy)
      <div class="comment">Format used to identify the elements found in a log file</div>
    </td>
  </tr><tr>
    <th>input-format-regex</th>
    <td>^([a-zA-Z0-9\.\-]+(?:, ?[a-zA-Z0-9\.\-]+)*) ([a-zA-Z0-9\-]+|\-) ([a-zA-Z0-9@\.\-_%,=]+) \[([^\]]+)\] "[A-Z]+ ([^ ]+) [^ ]+" ([0-9]+) ([0-9]+)$
      <div class="comment">Regular expression corresponding to the given format for log lines</div>
    </td>
  </tr><tr>
    <th>nb-denied-ecs</th>
    <td>104
      <div class="comment">Number of denied consultation events (access to not subscribed resources)</div>
    </td>
  </tr><tr>
    <th>nb-ecs</th>
    <td>14224
      <div class="comment">Total number of consultation events found in the log file</div>
    </td>
  </tr><tr>
    <th>nb-lines-input</th>
    <td>792049
      <div class="comment">Number of log lines found in the file given as input</div>
    </td>
  </tr><tr>
    <th>on-campus-accesses</th>
    <td>6549
      <div class="comment">Total number of on-campus consultation events</div>
    </td>
  </tr><tr>
    <th>process-speed</th>
    <td>3019 lignes/s
      <div class="comment">Processing speed</div>
    </td>
  </tr><tr>
    <th>enhancement-errors</th>
    <td>0
      <div class="comment">Number of consultation events that could not be enriched because of MongoDB errors</div>
    </td>
  </tr><tr>
    <th>result-file-ecs</th>
    <td><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1</a>
      <div class="comment">URL for accessing the result file</div>
    </td>
  </tr><tr>
    <th>url-denied-ecs</th>
    <td><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/denied-ecs.csv">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/denied-ecs.csv</a>
      <div class="comment">URL for accessing the file containing denied consultations (for non subscribed resources)</div>
    </td>
  </tr>
</tbody>
</table>

## Rejects ##

<table>
<tbody>
  <tr>
    <th>nb-lines-duplicate-ecs</th>
    <td>1893
      <div class="comment">Number of deduplicated access events (following the COUNTER algorithm)</div>
    </td>
  </tr><tr>
    <th>nb-lines-ignored</th>
    <td>351891
      <div class="comment">Number of ignored lines (not relevant)</div>
    </td>
  </tr><tr>
    <th>nb-lines-ignored-domains</th>
    <td>4
    <div class="comment">Number of lines for which the domain has been ignored (ie declared in EZPAARSE_IGNORED_DOMAINS)</div>
    </td>
  </tr><tr>
    <th>nb-lines-pkb-miss-ecs</th>
    <td>2107
      <div class="comment">Number of lines with unknown vendors identifiers</div>
    </td>
  </tr><tr>
    <th>nb-lines-unknown-domains</th>
    <td>335068
      <div class="comment">Number of lines with an unknown domain</div>
    </td>
  </tr><tr>
    <th>nb-lines-unknown-formats</th>
    <td>1891
      <div class="comment">Number of lines with an unknown format</div>
    </td>
  </tr><tr>
    <th>nb-lines-unordered-ecs</th>
    <td>0
    <div class="comment">Number of lines chronologically disordered (the chronological order is necessary for deduplication)</div>
    </td>
  </tr><tr>
    <th>nb-lines-unqualified-ecs</th>
    <td>86974
      <div class="comment">Number of unqualified lines (because they don't contain enough information)</div>
    </td>
  </tr><tr>
    <th>url-duplicate-ecs</th>
    <td><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-duplicate-ecs.log">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-duplicate-ecs.log</a>
      <div class="comment">URL to the file containing the deduplicated lines</div>
    </td>
  </tr><tr>
    <th>url-ignored-domains</th>
    <td><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-ignored-domains.log">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-ignored-domains.log</a>
      <div class="comment">URL to the file containing the lines with an ignored domain</div>
    </td>
  </tr><tr>
    <th>url-pkb-miss-ecs</th>
    <td><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-pkb-miss-ecs.log">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-pkb-miss-ecs.log</a>
      <div class="comment">URL to the file containing the lines with an unknown vendor's identifier</div>
    </td>
  </tr><tr>
    <th>url-unknown-domains</th>
    <td><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-unknown-domains.log">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-unknown-domains.log</a>
      <div class="comment">URL to the file containing the lines with an unknwon domain (ie no parser has been triggered by ezPAARSE)</div>
    </td>
  </tr><tr>
    <th>url-unknown-formats</th>
    <td><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-unknown-formats.log">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-unknown-formats.log</a>
      <div class="comment">URL to the file containing the lines with an unknown format</div>
    </td>
  </tr><tr>
    <th>url-unordered-ecs</th>
    <td>
      <div class="comment">URL to the file containing the lines with a chronological anomaly</div>
    </td>
  </tr><tr>
    <th>url-unqualified-ecs</th>
    <td><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-unqualified-ecs.log">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-unqualified-ecs.log
      <div class="comment">URL to the file containing the lines containing too few information</div>
    </a>
    </td>
  </tr>
</tbody>
</table>

## Statistics ##

<table>
<tbody>
  <tr>
    <th>mime-HTML</th>
    <td>4540
      <div class="comment">Numbers of access events for the main mime-types (names prefixed with mime-)</div>
    </td>
  </tr><tr>
    <th>mime-MISC</th>
    <td>3612</td>
  </tr><tr>
    <th>mime-PDF</th>
    <td>6072</td>
  </tr><tr>
    <th>platform-acs
    </th>
    <td>538
      <div class="comment">Number of access events for recognized platforms (names prefixed with platform-platform_shortname)</div>
    </td>
  </tr><tr>
    <th>platform-ar</th>
    <td>97</td>
  </tr><tr>
    <th>platform-bioone</th>
    <td>15</td>
  </tr><tr>
    <th>platform-bmc</th>
    <td>75</td>
  </tr><tr>
    <th>platform-cup</th>
    <td>22</td>
  </tr><tr>
    <th>platform-edp</th>
    <td>27</td>
  </tr><tr>
    <th>platform-hw</th>
    <td>1740</td>
  </tr><tr>
    <th>platform-jstor</th>
    <td>9</td>
  </tr><tr>
    <th>platform-mal</th>
    <td>97</td>
  </tr><tr>
    <th>platform-metapress</th>
    <td>27</td>
  </tr><tr>
    <th>platform-npg</th>
    <td>3132</td>
  </tr><tr>
    <th>platform-sd</th>
    <td>5255</td>
  </tr><tr>
    <th>platform-springer</th>
    <td>1675</td>
  </tr><tr>
    <th>platform-wiley</th>
    <td>1515</td>
  </tr><tr>
    <th>platforms</th>
    <td>14
      <div class="comment">Number of distinct platforms recognized during the processing</div>
    </td>
  </tr><tr>
    <th>rtype-ABS</th>
    <td>1142
      <div class="comment">Number of access events for the main resources types (name prefixed with rtype-)</div>
    </td>
  </tr><tr>
    <th>rtype-ARTICLE</th>
    <td>9991</td>
  </tr><tr>
    <th>rtype-BOOK</th>
    <td>218</td>
  </tr><tr>
    <th>rtype-BOOKSERIE</th>
    <td>23</td>
  </tr><tr>
    <th>rtype-BOOK_SECTION</th>
    <td>314</td>
  </tr><tr>
    <th>rtype-TOC</th>
    <td>2536</td>
  </tr>
</tbody>
</table>

## Alerts ##

<table>
<tbody>
  <tr>
    <th>active-alerts</th>
    <td>unknown-domains
      <div class="comment">List of alerts that can be thrown</div>
    </td>
  </tr><tr>
    <th>alert-1</th>
    <td>www.ncbi.nlm.nih.gov is unknown but represents 64% of the log lines
      <div class="comment">Alert content</div>
    </td>
  </tr>
</tbody>
</table>

## Notifications ##

<table>
<tbody>
  <tr>
    <th>mailto</th>
    <td>someone@somewhere.com
      <div class="comment">Recepient(s) of the mail sent at the end of the processing</div>
    </td>
  </tr><tr>
    <th>mail-status</th>
    <td>success
      <div class="comment">Status of the mail sending.</div>
    </td>
  </tr>
</tbody>
</table>

## Deduplicating ##

<table>
<tbody>
  <tr>
    <th>activated</th>
    <td>true</td>
  </tr><tr>
    <th>fieldname-C</th>
    <td>session</td>
  </tr><tr>
    <th>fieldname-I</th>
    <td>host</td>
  </tr><tr>
    <th>fieldname-L</th>
    <td>login</td>
  </tr><tr>
    <th>strategy</th>
    <td>CLI</td>
  </tr><tr>
    <th>window-html</th>
    <td>10
      <div class="comment">
Number of seconds used for the deduplication timeframe of HTML consultations (ie. consultations of a resource with the same ID are grouped together in a single event, cf COUNTER)
      </div>
    </td>
  </tr><tr>
    <th>window-misc</th>
    <td>30
    <div class="comment">Number of seconds used for the deduplication timeframe of MISC consultations</div>
   </td>
  </tr><tr>
    <th>window-pdf</th>
    <td>30
    <div class="comment">Number of seconds used for the deduplication tiemframe of PDF consultations</div>
    </td>
  </tr>
</tbody>
</table>

## Files ##

<table>
<tbody>
  <tr>
    <th>1</th>
    <td>fede.bibliovie.ezproxy.2013.11.19.log.gz</td>
  </tr>
</tbody>
</table>

## First consultation event ##

<table>
<tbody>
  <tr>
    <th>date</th>
    <td>2013-11-19</td>
  </tr><tr>
    <th>datetime</th>
    <td>2013-11-19T00:11:57+01:00</td>
  </tr><tr>
    <th>domain</th>
    <td>www.nature.com</td>
  </tr><tr>
    <th>geoip-addr</th>
    <td>
      <div class="comment">GeoIP Address extracted from the IP address of the consulting host</div>
    </td>
  </tr><tr>
    <th>geoip-city</th>
    <td>
      <div class="comment">City, extracted from the IP address of the consulting host</div>
    </td>
  </tr><tr>
    <th>geoip-coordinates</th>
    <td>
      <div class="comment">Coordinates (longitude and latitude) extracted from the IP address of the consulting host</div>
    </td>
  </tr><tr>
    <th>geoip-country</th>
    <td>
      <div class="comment">Country code extracted from the IP address of the consulting host</div>
    </td>
  </tr><tr>
    <th>geoip-family</th>
    <td>
    </td>
  </tr><tr>
    <th>geoip-host</th>
    <td>
      <div class="comment">GeoIP Host extracted from the IP address of the consulting host</div>
    </td>
  </tr><tr>
    <th>geoip-latitude</th>
    <td>
    </td>
  </tr><tr>
    <th>geoip-longitude</th>
    <td></td>
  </tr><tr>
    <th>geoip-region</th>
    <td></td>
  </tr><tr>
    <th>host</th>
    <td>test.proxad.net
      <div class="comment">Original host</div>
    </td>
  </tr><tr>
    <th>login</th>
    <td>MYLOGIN
      <div class="comment">Login used for accessing the resource</div>
    </td>
  </tr><tr>
    <th>mime</th>
    <td>MISC
      <div class="comment">Mime-type of the ressource, as recognized by the parser</div>
    </td>
  </tr><tr>
    <th>platform</th>
    <td>npg
      <div class="comment">Short name for the consulted platform (ie name of the parser used to analyse the resource's URL)</div>
    </td>
  </tr><tr>
    <th>rtype</th>
    <td>TOC
      <div class="comment">Reousrce type for the consulted resource, as recognized by the parser</div>
    </td>
  </tr><tr>
    <th>size</th>
    <td>40054
      <div class="comment">HTTP Request size</div>
    </td>
  </tr><tr>
    <th>status</th>
    <td>200
      <div class="comment">HTTP code sent by the server when the resource is accessed</div>
    </td>
  </tr><tr>
    <th>timestamp</th>
    <td>1384816317</td>
  </tr><tr>
    <th>title_id</th>
    <td>siteindex
      <div class="comment">Vendor identifier, as determined by the parser</div>
    </td>
  </tr><tr>
    <th>unitid</th>
    <td>siteindex
      <div class="comment">Unique identifier for the resource, as determined by the parser (used for deduplicating identical resources)</div>
    </td>
  </tr><tr>
    <th>url</th>
    <td><a target="_blank" href="http://www.nature.com/siteindex/index.html">http://www.nature.com:80/siteindex/index.html</a></td>
  </tr>
</tbody>
</table>

## Unknown Domains ##

The `domains.miss.csv` file persists between every processing job. It is where the unknown domains (ie domains for which no parser gets started) get stored, deduplicated and sorted: if URLs present in that file correspond to a provider's platform that should be analysed by ezPAARSE, you have to check on the [Analogist platform analysis website](http://ang.couperin.org) if the platform is already listed and you will also get an indication of how advanced its analysis is.
