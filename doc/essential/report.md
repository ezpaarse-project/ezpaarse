# Report content #


ezPAARSE produces an execution report.
The various sections are documented here.

- [General](#general): contains general information related to the processing
- [Rejects](#rejets): lists all rejects, how much they are and the links to the files containing the rejected lines
- [Statistics](#stats): provides the first global figures
- [Alerts](#alerts): the generated alerts
- [Notifications](#notifications): for end of processing notifications
- [Duplicates](#dedoublonnage): algorithm used for deduplication
- [File](#files): list of processed log files
- [First consultation](#first_event): content of the first consultation event


<div>
  <h3 id="general" class="ui purple dividing header">
    General
  </h3>

  <table class="ui basic compact table">
    <tbody><tr>
      <th class="four wide">Job-Date</th>
      <td>2014-06-16T14:55:04+02:00
        <div class="comment">Processing date</div>
      </td>
    </tr><tr>
      <th class="four wide">Job-Done</th>
      <td>true
        <div class="comment">Has the processing correctly completed ?</div>
      </td>
    </tr><tr>
      <th class="four wide">Job-Duration</th>
      <td>4 m 22 s 
        <div class="comment">Processing duration</div>
      </td>
    </tr><tr>
      <th class="four wide">Job-ID</th>
      <td>6f601540-f555-11e3-b477-758199fa5dc1
        <div class="comment">Unique Identifier for the processing</div>
      </td>
    </tr><tr>
      <th class="four wide">Rejection-Rate</th>
      <td>96.74 %
        <div class="comment">Rejected lines rate (ie. unknown domains, duplicates,etc.) among the relevant lines</div>
      </td>
    </tr><tr>
      <th class="four wide">URL-Traces</th>
      <td><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/job-traces.log">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/job-traces.log</a>
      <div class="comment">Access to the execution traces for the processing</div>
      </td>
    </tr><tr>
      <th class="four wide">client-user-agent</th>
      <td>Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/33.0.1750.152 Chrome/33.0.1750.152 Safari/537.36
      </td>
    </tr><tr>
      <th class="four wide">ezPAARSE-version</th>
      <td>ezPAARSE 2.3.0
      </td>
    </tr><tr>
      <th class="four wide">geolocalization</th>
      <td>all
        <div class="comment">Requested geo-location fields</div>
      </td>
    </tr><tr>
      <th class="four wide">git-branch</th>
      <td>master
      </td>
    </tr><tr>
      <th class="four wide">git-last-commit</th>
      <td>429e61bf29e80326b09958b0a68a01c0ae3add91
      </td>
    </tr><tr>
      <th class="four wide">git-tag</th>
      <td>1.7.0
      </td>
    </tr><tr>
      <th class="four wide">input-first-line</th>
      <td>rate-limited-proxy-72-14-199-16.google.com - - [19/Nov/2013:00:11:05 +0100] "GET http://gate1.inist.fr:50162/login?url=http://www.nature.com/rss/feed?doi=10.1038/465529d HTTP/1.1" 302 0
      <div class="comment">First log line found in a submitted log file</div>
      </td>
    </tr><tr>
      <th class="four wide">input-format-literal</th>
      <td>%h %l %u %t "%r" %s %b (ezproxy)
        <div class="comment">Format used to identify the elements found in a log file</div>
      </td>
    </tr><tr>
      <th class="four wide">input-format-regex</th>
      <td>^([a-zA-Z0-9\.\-]+(?:, ?[a-zA-Z0-9\.\-]+)*) ([a-zA-Z0-9\-]+|\-) ([a-zA-Z0-9@\.\-_%,=]+) \[([^\]]+)\] "[A-Z]+ ([^ ]+) [^ ]+" ([0-9]+) ([0-9]+)$
        <div class="comment">Regular expression corresponding to the given format for log lines</div>
      </td>
    </tr><tr>
      <th class="four wide">nb-denied-ecs</th>
      <td>104
        <div class="comment">Number of denied consultation events (access to not subscribed resources)</div>
      </td>
    </tr><tr>
      <th class="four wide">nb-ecs</th>
      <td>14224
        <div class="comment">Total number of consultation events found in the log file</div>
      </td>
    </tr><tr>
      <th class="four wide">nb-lines-input</th>
      <td>792049
        <div class="comment">Number of log lines found in the file given as input</div>
      </td>
    </tr><tr>
      <th class="four wide">process-speed</th>
      <td>3019 lignes/s
        <div class="comment">Processing speed</div>
      </td>
    </tr><tr>
      <th class="four wide">enhancement-errors</th>
      <td>0
        <div class="comment">Number of consultation events that could not be enriched because of MongoDB errors</div>
      </td>
    </tr><tr>
      <th class="four wide">result-file-ecs</th>
      <td><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1</a>
        <div class="comment">URL for accessing the result file</div>
      </td>
    </tr><tr>
      <th class="four wide">url-denied-ecs</th>
      <td><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/denied-ecs.csv">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/denied-ecs.csv</a>
        <div class="comment">URL for accessing the file containing denied consultations (for non subscribed resources)</div>
      </td>
    </tr>
  </tbody></table>
</div>
<div>
  <h3 id="rejets" class="ui purple dividing header">
    Rejects
  </h3>

  <table class="ui basic compact table">
    <tbody><tr>
      <th class="four wide">nb-lines-duplicate-ecs</th>
      <td>1893
        <div class="comment">Number of deduplicated CEs (following the COUNTER algorithm)</div>
      </td>
    </tr><tr>
      <th class="four wide">nb-lines-ignored</th>
      <td>351891
        <div class="comment">Number of ignored lines (not relevant)</div>
      </td>
    </tr><tr>
      <th class="four wide">nb-lines-ignored-domains</th>
      <td>4
      <div class="comment">Number of lines for which the domain has been ignored (ie declared in EZPAARSE_IGNORED_DOMAINS)</div>
      </td>
    </tr><tr>
      <th class="four wide">nb-lines-pkb-miss-ecs</th>
      <td>2107
        <div class="comment">Number of lines with unknown vendors identifiers</div>
      </td>
    </tr><tr>
      <th class="four wide">nb-lines-unknown-domains</th>
      <td>335068
        <div class="comment">Number of lines with an unknown domain</div>
      </td>
    </tr><tr>
      <th class="four wide">nb-lines-unknown-formats</th>
      <td>1891
        <div class="comment">Number of lines with an unknown format</div>
      </td>
    </tr><tr>
      <th class="four wide">nb-lines-unordered-ecs</th>
      <td>0
      <div class="comment">Number of lines chronologically disordered (the chronological order is necessary for deduplication)</div>
      </td>
    </tr><tr>
      <th class="four wide">nb-lines-unqualified-ecs</th>
      <td>86974
        <div class="comment">Number of unqualified lines (because they don't contain enough information)</div>
      </td>
    </tr><tr>
      <th class="four wide">url-duplicate-ecs</th>
      <td><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-duplicate-ecs.log">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-duplicate-ecs.log</a>
        <div class="comment">URL to the file containing the deduplicated lines</div>
      </td>
    </tr><tr>
      <th class="four wide">url-ignored-domains</th>
      <td><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-ignored-domains.log">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-ignored-domains.log</a>
        <div class="comment">URL to the file containing the lines with an ignored domain</div>
      </td>
    </tr><tr>
      <th class="four wide">url-pkb-miss-ecs</th>
      <td><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-pkb-miss-ecs.log">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-pkb-miss-ecs.log</a>
        <div class="comment">URL to the file containing the lines with an unknown vendor's identifier</div>
      </td>
    </tr><tr>
      <th class="four wide">url-unknown-domains</th>
      <td><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-unknown-domains.log">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-unknown-domains.log</a>
        <div class="comment">URL to the file containing the lines with an unknwon domain (ie no parser has been triggered by ezPAARSE)</div>
      </td>
    </tr><tr>
      <th class="four wide">url-unknown-formats</th>
      <td><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-unknown-formats.log">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-unknown-formats.log</a>
        <div class="comment">URL to the file containing the lines with an unknown format</div>
      </td>
    </tr><tr>
      <th class="four wide">url-unordered-ecs</th>
      <td>
        <div class="comment">URL to the file containing the lines with a chronological anomaly</div>
      </td>
    </tr><tr>
      <th class="four wide">url-unqualified-ecs</th>
      <td><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-unqualified-ecs.log">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-unqualified-ecs.log
        <div class="comment">URL to the file containing the lines containing too few information</div>
      </a>
      </td>
    </tr>
  </tbody></table>
</div>
<div>
  <h3 id="stats" class="ui purple dividing header">
    Statistics
  </h3>

  <table class="ui basic compact table">
    <tbody><tr>
      <th class="four wide">mime-HTML</th>
      <td>4540
        <div class="comment">Numbers of CEs for the main mime-types (names prefixed with mime-)</div>
      </td>
    </tr><tr>
      <th class="four wide">mime-MISC</th>
      <td>3612</td>
    </tr><tr>
      <th class="four wide">mime-PDF</th>
      <td>6072</td>
    </tr><tr>
      <th class="four wide">platform-acs
      </th>
      <td>538
        <div class="comment">Number of CEs for recognized platforms (names prefixed with platform-platform_shortname)</div>
      </td>
    </tr><tr>
      <th class="four wide">platform-ar</th>
      <td>97</td>
    </tr><tr>
      <th class="four wide">platform-bioone</th>
      <td>15</td>
    </tr><tr>
      <th class="four wide">platform-bmc</th>
      <td>75</td>
    </tr><tr>
      <th class="four wide">platform-cup</th>
      <td>22</td>
    </tr><tr>
      <th class="four wide">platform-edp</th>
      <td>27</td>
    </tr><tr>
      <th class="four wide">platform-hw</th>
      <td>1740</td>
    </tr><tr>
      <th class="four wide">platform-jstor</th>
      <td>9</td>
    </tr><tr>
      <th class="four wide">platform-mal</th>
      <td>97</td>
    </tr><tr>
      <th class="four wide">platform-metapress</th>
      <td>27</td>
    </tr><tr>
      <th class="four wide">platform-npg</th>
      <td>3132</td>
    </tr><tr>
      <th class="four wide">platform-sd</th>
      <td>5255</td>
    </tr><tr>
      <th class="four wide">platform-springer</th>
      <td>1675</td>
    </tr><tr>
      <th class="four wide">platform-wiley</th>
      <td>1515</td>
    </tr><tr>
      <th class="four wide">platforms</th>
      <td>14
        <div class="comment">Number of distinct platforms recognized during the processing</div>
      </td>
    </tr><tr>
      <th class="four wide">rtype-ABS</th>
      <td>1142
        <div class="comment">Number of CEs for the main resources types (name prefixed with rtype-)</div>
      </td>
    </tr><tr>
      <th class="four wide">rtype-ARTICLE</th>
      <td>9991</td>
    </tr><tr>
      <th class="four wide">rtype-BOOK</th>
      <td>218</td>
    </tr><tr>
      <th class="four wide">rtype-BOOKSERIE</th>
      <td>23</td>
    </tr><tr>
      <th class="four wide">rtype-BOOK_SECTION</th>
      <td>314</td>
    </tr><tr>
      <th class="four wide">rtype-TOC</th>
      <td>2536</td>
    </tr>
  </tbody></table>
</div>
<div>
  <h3 id="alerts" class="ui purple dividing header">
    Alerts
  </h3>

  <table class="ui basic compact table">
    <tbody><tr>
      <th class="four wide">active-alerts</th>
      <td>unknown-domains
        <div class="comment">List of alerts that can be thrown</div>
      </td>
    </tr><tr>
      <th class="four wide">alert-1</th>
      <td>www.ncbi.nlm.nih.gov is unknown but represents 64% of the log lines
        <div class="comment">Alert content</div>
      </td>
    </tr>
  </tbody></table>
</div>
<div>
  <h3 id="notifications" class="ui purple dividing header">
    Notifications
  </h3>

  <table class="ui basic compact table">
    <tbody><tr>
      <th class="four wide">mailto</th>
      <td>someone@somewhere.com
        <div class="comment">Receiver of the mail at the end of the processing</div>
      </td>
    </tr><tr>
      <th class="four wide">mail-status</th>
      <td>success
        <div class="comment">Status of the mail sending.</div>
      </td>
    </tr>
  </tbody></table>
</div>
<div>
  <h3 id="dedoublonnage" class="ui purple dividing header">
    Deduplicating
  </h3>

  <table class="ui basic compact table">
    <tbody><tr>
      <th class="four wide">activated</th>
      <td>true</td>
    </tr><tr>
      <th class="four wide">fieldname-C</th>
      <td>session</td>
    </tr><tr>
      <th class="four wide">fieldname-I</th>
      <td>host</td>
    </tr><tr>
      <th class="four wide">fieldname-L</th>
      <td>login</td>
    </tr><tr>
      <th class="four wide">strategy</th>
      <td>CLI</td>
    </tr><tr>
      <th class="four wide">window-html</th>
      <td>10
        <div class="comment">
Number of seconds used for the deduplication timeframe of HTML consultations (ie. consultations of a resource with the same ID are grouped together in a single event, cf COUNTER)
        </div>
      </td>
    </tr><tr>
      <th class="four wide">window-misc</th>
      <td>30
      <div class="comment">Number of seconds used for the deduplication timeframe of MISC consultations</div>
     </td>
    </tr><tr>
      <th class="four wide">window-pdf</th>
      <td>30
      <div class="comment">Number of seconds used for the deduplication tiemframe of PDF consultations</div>
      </td>
    </tr>
  </tbody></table>
</div>
<div>
  <h3 id="files" class="ui purple dividing header">
    Files
  </h3>

  <table class="ui basic compact table">
    <tbody><tr>
      <th class="four wide">1</th>
      <td>fede.bibliovie.ezproxy.2013.11.19.log.gz</td>
    </tr>
  </tbody></table>
</div>
<div>
  <h3 id="first_event" class="ui purple dividing header">
    First consultation event
  </h3>

  <table class="ui basic compact table">
    <tbody><tr>
      <th class="four wide">date</th>
      <td>2013-11-19</td>
    </tr><tr>
      <th class="four wide">datetime</th>
      <td>2013-11-19T00:11:57+01:00</td>
    </tr><tr>
      <th class="four wide">domain</th>
      <td>www.nature.com</td>
    </tr><tr>
      <th class="four wide">geoip-addr</th>
      <td>
        <div class="comment">GeoIP Address extracted from the IP address of the consulting host</div>
      </td>
    </tr><tr>
      <th class="four wide">geoip-city</th>
      <td>
        <div class="comment">City, extracted from the IP address of the consulting host</div>
      </td>
    </tr><tr>
      <th class="four wide">geoip-coordinates</th>
      <td>
        <div class="comment">Coordinates (longitude and latitude) extracted from the IP address of the consulting host</div>
      </td>
    </tr><tr>
      <th class="four wide">geoip-country</th>
      <td>
        <div class="comment">Country code extracted from the IP address of the consulting host</div>
      </td>
    </tr><tr>
      <th class="four wide">geoip-family</th>
      <td>
      </td>
    </tr><tr>
      <th class="four wide">geoip-host</th>
      <td>
        <div class="comment">GeoIP Host extracted from the IP address of the consulting host</div>
      </td>
    </tr><tr>
      <th class="four wide">geoip-latitude</th>
      <td>
      </td>
    </tr><tr>
      <th class="four wide">geoip-longitude</th>
      <td></td>
    </tr><tr>
      <th class="four wide">geoip-region</th>
      <td></td>
    </tr><tr>
      <th class="four wide">host</th>
      <td>test.proxad.net
        <div class="comment">Original host</div>
      </td>
    </tr><tr>
      <th class="four wide">login</th>
      <td>MYLOGIN
        <div class="comment">Login used for accessing the resource</div>
      </td>
    </tr><tr>
      <th class="four wide">mime</th>
      <td>MISC
        <div class="comment">Mime-type of the ressource, as recognized by the parser</div>
      </td>
    </tr><tr>
      <th class="four wide">platform</th>
      <td>npg
        <div class="comment">Short name for the consulted platform (ie name of the parser used to analyse the resource's URL)</div>
      </td>
    </tr><tr>
      <th class="four wide">rtype</th>
      <td>TOC
        <div class="comment">Reousrce type for the consulted resource, as recognized by the parser</div>
      </td>
    </tr><tr>
      <th class="four wide">size</th>
      <td>40054
        <div class="comment">HTTP Request size</div>
      </td>
    </tr><tr>
      <th class="four wide">status</th>
      <td>200
        <div class="comment">HTTP code sent by the server when the resource is accessed</div>
      </td>
    </tr><tr>
      <th class="four wide">timestamp</th>
      <td>1384816317</td>
    </tr><tr>
      <th class="four wide">title_id</th>
      <td>siteindex
        <div class="comment">Vendor identifier, as determined by the parser</div>
      </td>
    </tr><tr>
      <th class="four wide">unitid</th>
      <td>siteindex
        <div class="comment">Unique identifier for the resource, as determined by the parser (used for deduplicating identical resources)</div>
      </td>
    </tr><tr>
      <th class="four wide">url</th>
      <td><a target="_blank" href="http://www.nature.com/siteindex/index.html">http://www.nature.com:80/siteindex/index.html</a></td>
    </tr>
  </tbody></table>
</div>
