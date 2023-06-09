(window.webpackJsonp=window.webpackJsonp||[]).push([[28],{316:function(t,e,s){"use strict";s.r(e);var n=s(10),a=Object(n.a)({},(function(){var t=this,e=t._self._c;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("h1",{attrs:{id:"job-reports"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#job-reports"}},[t._v("#")]),t._v(" Job reports")]),t._v(" "),e("p",[t._v("ezPAARSE generates an execution report, everytime it processes a log file.\nThe various sections of this report are documented below.")]),t._v(" "),e("ul",[e("li",[e("a",{attrs:{href:"#general"}},[t._v("General")]),t._v(": contains general information related to the processing")]),t._v(" "),e("li",[e("a",{attrs:{href:"#rejects"}},[t._v("Rejects")]),t._v(": lists all rejects, how much they are and the links to the files containing the rejected lines")]),t._v(" "),e("li",[e("a",{attrs:{href:"#statistics"}},[t._v("Statistics")]),t._v(": provides the first global figures")]),t._v(" "),e("li",[e("a",{attrs:{href:"#alerts"}},[t._v("Alerts")]),t._v(": lists the active alerts")]),t._v(" "),e("li",[e("a",{attrs:{href:"#notifications"}},[t._v("Notifications")]),t._v(": lists the email for the recipients of processing notifications")]),t._v(" "),e("li",[e("a",{attrs:{href:"#deduplicating"}},[t._v("Duplicates")]),t._v(": algorithm used for deduplication")]),t._v(" "),e("li",[e("a",{attrs:{href:"#files"}},[t._v("File")]),t._v(": list of processed log files")]),t._v(" "),e("li",[e("a",{attrs:{href:"#first-consultation-event"}},[t._v("First consultation")]),t._v(": content of the first access event")])]),t._v(" "),e("h2",{attrs:{id:"general"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#general"}},[t._v("#")]),t._v(" General")]),t._v(" "),e("table",[e("tbody",[e("tr",[e("th",[t._v("Job-Date")]),t._v(" "),e("td",[t._v("2014-06-16T14:55:04+02:00\n      "),e("div",{staticClass:"comment"},[t._v("Processing date")])])]),e("tr",[e("th",[t._v("Job-Done")]),t._v(" "),e("td",[t._v("true\n      "),e("div",{staticClass:"comment"},[t._v("Has the processing correctly completed?")])])]),e("tr",[e("th",[t._v("Job-Duration")]),t._v(" "),e("td",[t._v("4 m 22 s\n      "),e("div",{staticClass:"comment"},[t._v("Processing duration")])])]),e("tr",[e("th",[t._v("Job-ID")]),t._v(" "),e("td",[t._v("6f601540-f555-11e3-b477-758199fa5dc1\n      "),e("div",{staticClass:"comment"},[t._v("Unique Identifier for the processing")])])]),e("tr",[e("th",[t._v("Rejection-Rate")]),t._v(" "),e("td",[t._v("96.74 %\n      "),e("div",{staticClass:"comment"},[t._v("Rejected lines rate (ie. unknown domains, duplicates,etc.) among the relevant lines")])])]),e("tr",[e("th",[t._v("URL-Traces")]),t._v(" "),e("td",[e("a",{attrs:{target:"_blank",href:"http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/job-traces.log"}},[t._v("http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/job-traces.log")]),t._v(" "),e("div",{staticClass:"comment"},[t._v("Access to the execution traces for the processing")])])]),e("tr",[e("th",[t._v("client-user-agent")]),t._v(" "),e("td",[t._v("Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/33.0.1750.152 Chrome/33.0.1750.152 Safari/537.36\n    ")])]),e("tr",[e("th",[t._v("ezPAARSE-version")]),t._v(" "),e("td",[t._v("ezPAARSE 2.3.0\n    ")])]),e("tr",[e("th",[t._v("geolocalization")]),t._v(" "),e("td",[t._v("all\n      "),e("div",{staticClass:"comment"},[t._v("Requested geo-location fields")])])]),e("tr",[e("th",[t._v("git-branch")]),t._v(" "),e("td",[t._v("master\n    ")])]),e("tr",[e("th",[t._v("git-last-commit")]),t._v(" "),e("td",[t._v("429e61bf29e80326b09958b0a68a01c0ae3add91\n    ")])]),e("tr",[e("th",[t._v("git-tag")]),t._v(" "),e("td",[t._v("1.7.0\n    ")])]),e("tr",[e("th",[t._v("input-first-line")]),t._v(" "),e("td",[t._v('rate-limited-proxy-72-14-199-16.google.com - - [19/Nov/2013:00:11:05 +0100] "GET http://gate1.inist.fr:50162/login?url=http://www.nature.com/rss/feed?doi=10.1038/465529d HTTP/1.1" 302 0\n    '),e("div",{staticClass:"comment"},[t._v("First log line found in a submitted log file")])])]),e("tr",[e("th",[t._v("input-format-literal")]),t._v(" "),e("td",[t._v('%h %l %u %t "%r" %s %b (ezproxy)\n      '),e("div",{staticClass:"comment"},[t._v("Format used to identify the elements found in a log file")])])]),e("tr",[e("th",[t._v("input-format-regex")]),t._v(" "),e("td",[t._v('^([a-zA-Z0-9\\.\\-]+(?:, ?[a-zA-Z0-9\\.\\-]+)*) ([a-zA-Z0-9\\-]+|\\-) ([a-zA-Z0-9@\\.\\-_%,=]+) \\[([^\\]]+)\\] "[A-Z]+ ([^ ]+) [^ ]+" ([0-9]+) ([0-9]+)$\n      '),e("div",{staticClass:"comment"},[t._v("Regular expression corresponding to the given format for log lines")])])]),e("tr",[e("th",[t._v("nb-denied-ecs")]),t._v(" "),e("td",[t._v("104\n      "),e("div",{staticClass:"comment"},[t._v("Number of denied consultation events (access to not subscribed resources)")])])]),e("tr",[e("th",[t._v("nb-ecs")]),t._v(" "),e("td",[t._v("14224\n      "),e("div",{staticClass:"comment"},[t._v("Total number of consultation events found in the log file")])])]),e("tr",[e("th",[t._v("nb-lines-input")]),t._v(" "),e("td",[t._v("792049\n      "),e("div",{staticClass:"comment"},[t._v("Number of log lines found in the file given as input")])])]),e("tr",[e("th",[t._v("on-campus-accesses")]),t._v(" "),e("td",[t._v("6549\n      "),e("div",{staticClass:"comment"},[t._v("Total number of on-campus consultation events")])])]),e("tr",[e("th",[t._v("process-speed")]),t._v(" "),e("td",[t._v("3019 lignes/s\n      "),e("div",{staticClass:"comment"},[t._v("Processing speed")])])]),e("tr",[e("th",[t._v("enhancement-errors")]),t._v(" "),e("td",[t._v("0\n      "),e("div",{staticClass:"comment"},[t._v("Number of consultation events that could not be enriched because of MongoDB errors")])])]),e("tr",[e("th",[t._v("result-file-ecs")]),t._v(" "),e("td",[e("a",{attrs:{target:"_blank",href:"http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1"}},[t._v("http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1")]),t._v(" "),e("div",{staticClass:"comment"},[t._v("URL for accessing the result file")])])]),e("tr",[e("th",[t._v("url-denied-ecs")]),t._v(" "),e("td",[e("a",{attrs:{target:"_blank",href:"http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/denied-ecs.csv"}},[t._v("http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/denied-ecs.csv")]),t._v(" "),e("div",{staticClass:"comment"},[t._v("URL for accessing the file containing denied consultations (for non subscribed resources)")])])])])]),t._v(" "),e("h2",{attrs:{id:"rejects"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#rejects"}},[t._v("#")]),t._v(" Rejects")]),t._v(" "),e("table",[e("tbody",[e("tr",[e("th",[t._v("nb-lines-duplicate-ecs")]),t._v(" "),e("td",[t._v("1893\n      "),e("div",{staticClass:"comment"},[t._v("Number of deduplicated access events (following the COUNTER algorithm)")])])]),e("tr",[e("th",[t._v("nb-lines-ignored")]),t._v(" "),e("td",[t._v("351891\n      "),e("div",{staticClass:"comment"},[t._v("Number of ignored lines (not relevant)")])])]),e("tr",[e("th",[t._v("nb-lines-ignored-domains")]),t._v(" "),e("td",[t._v("4\n    "),e("div",{staticClass:"comment"},[t._v("Number of lines for which the domain has been ignored (ie declared in EZPAARSE_IGNORED_DOMAINS)")])])]),e("tr",[e("th",[t._v("nb-lines-pkb-miss-ecs")]),t._v(" "),e("td",[t._v("2107\n      "),e("div",{staticClass:"comment"},[t._v("Number of lines with unknown vendors identifiers")])])]),e("tr",[e("th",[t._v("nb-lines-unknown-domains")]),t._v(" "),e("td",[t._v("335068\n      "),e("div",{staticClass:"comment"},[t._v("Number of lines with an unknown domain")])])]),e("tr",[e("th",[t._v("nb-lines-unknown-formats")]),t._v(" "),e("td",[t._v("1891\n      "),e("div",{staticClass:"comment"},[t._v("Number of lines with an unknown format")])])]),e("tr",[e("th",[t._v("nb-lines-unordered-ecs")]),t._v(" "),e("td",[t._v("0\n    "),e("div",{staticClass:"comment"},[t._v("Number of lines chronologically disordered (the chronological order is necessary for deduplication)")])])]),e("tr",[e("th",[t._v("nb-lines-unqualified-ecs")]),t._v(" "),e("td",[t._v("86974\n      "),e("div",{staticClass:"comment"},[t._v("Number of unqualified lines (because they don't contain enough information)")])])]),e("tr",[e("th",[t._v("nb-lines-unknown-errors")]),t._v(" "),e("td",[t._v("0\n      "),e("div",{staticClass:"comment"},[t._v("Number of lines that were rejected due to an unknown error")])])]),e("tr",[e("th",[t._v("url-duplicate-ecs")]),t._v(" "),e("td",[e("a",{attrs:{target:"_blank",href:"http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-duplicate-ecs.log"}},[t._v("http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-duplicate-ecs.log")]),t._v(" "),e("div",{staticClass:"comment"},[t._v("URL to the file containing the deduplicated lines")])])]),e("tr",[e("th",[t._v("url-ignored-domains")]),t._v(" "),e("td",[e("a",{attrs:{target:"_blank",href:"http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-ignored-domains.log"}},[t._v("http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-ignored-domains.log")]),t._v(" "),e("div",{staticClass:"comment"},[t._v("URL to the file containing the lines with an ignored domain")])])]),e("tr",[e("th",[t._v("url-pkb-miss-ecs")]),t._v(" "),e("td",[e("a",{attrs:{target:"_blank",href:"http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-pkb-miss-ecs.log"}},[t._v("http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-pkb-miss-ecs.log")]),t._v(" "),e("div",{staticClass:"comment"},[t._v("URL to the file containing the lines with an unknown vendor's identifier")])])]),e("tr",[e("th",[t._v("url-unknown-domains")]),t._v(" "),e("td",[e("a",{attrs:{target:"_blank",href:"http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-unknown-domains.log"}},[t._v("http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-unknown-domains.log")]),t._v(" "),e("div",{staticClass:"comment"},[t._v("URL to the file containing the lines with an unknwon domain (ie no parser has been triggered by ezPAARSE)")])])]),e("tr",[e("th",[t._v("url-unknown-formats")]),t._v(" "),e("td",[e("a",{attrs:{target:"_blank",href:"http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-unknown-formats.log"}},[t._v("http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-unknown-formats.log")]),t._v(" "),e("div",{staticClass:"comment"},[t._v("URL to the file containing the lines with an unknown format")])])]),e("tr",[e("th",[t._v("url-unordered-ecs")]),t._v(" "),e("td",[e("div",{staticClass:"comment"},[t._v("URL to the file containing the lines with a chronological anomaly")])])]),e("tr",[e("th",[t._v("url-unqualified-ecs")]),t._v(" "),e("td",[e("a",{attrs:{target:"_blank",href:"http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-unqualified-ecs.log"}},[t._v("http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-unqualified-ecs.log\n      "),e("div",{staticClass:"comment"},[t._v("URL to the file containing the lines containing too few information")])])])]),e("tr",[e("th",[t._v("url-unknown-errors")]),t._v(" "),e("td",[e("a",{attrs:{target:"_blank",href:"http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-unknown-errors.log"}},[t._v("http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/unknown-errors.log\n      "),e("div",{staticClass:"comment"},[t._v("URL to the file containing the lines rejected due to unknown errors")])])])])])]),t._v(" "),e("h2",{attrs:{id:"statistics"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#statistics"}},[t._v("#")]),t._v(" Statistics")]),t._v(" "),e("table",[e("tbody",[e("tr",[e("th",[t._v("mime-HTML")]),t._v(" "),e("td",[t._v("4540\n      "),e("div",{staticClass:"comment"},[t._v("Numbers of access events for the main mime-types (names prefixed with mime-)")])])]),e("tr",[e("th",[t._v("mime-MISC")]),t._v(" "),e("td",[t._v("3612")])]),e("tr",[e("th",[t._v("mime-PDF")]),t._v(" "),e("td",[t._v("6072")])]),e("tr",[e("th",[t._v("platform-acs\n    ")]),t._v(" "),e("td",[t._v("538\n      "),e("div",{staticClass:"comment"},[t._v("Number of access events for recognized platforms (names prefixed with platform-platform_shortname)")])])]),e("tr",[e("th",[t._v("platform-ar")]),t._v(" "),e("td",[t._v("97")])]),e("tr",[e("th",[t._v("platform-bioone")]),t._v(" "),e("td",[t._v("15")])]),e("tr",[e("th",[t._v("platform-bmc")]),t._v(" "),e("td",[t._v("75")])]),e("tr",[e("th",[t._v("platform-cup")]),t._v(" "),e("td",[t._v("22")])]),e("tr",[e("th",[t._v("platform-edp")]),t._v(" "),e("td",[t._v("27")])]),e("tr",[e("th",[t._v("platform-hw")]),t._v(" "),e("td",[t._v("1740")])]),e("tr",[e("th",[t._v("platform-jstor")]),t._v(" "),e("td",[t._v("9")])]),e("tr",[e("th",[t._v("platform-mal")]),t._v(" "),e("td",[t._v("97")])]),e("tr",[e("th",[t._v("platform-metapress")]),t._v(" "),e("td",[t._v("27")])]),e("tr",[e("th",[t._v("platform-npg")]),t._v(" "),e("td",[t._v("3132")])]),e("tr",[e("th",[t._v("platform-sd")]),t._v(" "),e("td",[t._v("5255")])]),e("tr",[e("th",[t._v("platform-springer")]),t._v(" "),e("td",[t._v("1675")])]),e("tr",[e("th",[t._v("platform-wiley")]),t._v(" "),e("td",[t._v("1515")])]),e("tr",[e("th",[t._v("platforms")]),t._v(" "),e("td",[t._v("14\n      "),e("div",{staticClass:"comment"},[t._v("Number of distinct platforms recognized during the processing")])])]),e("tr",[e("th",[t._v("rtype-ABS")]),t._v(" "),e("td",[t._v("1142\n      "),e("div",{staticClass:"comment"},[t._v("Number of access events for the main resources types (name prefixed with rtype-)")])])]),e("tr",[e("th",[t._v("rtype-ARTICLE")]),t._v(" "),e("td",[t._v("9991")])]),e("tr",[e("th",[t._v("rtype-BOOK")]),t._v(" "),e("td",[t._v("218")])]),e("tr",[e("th",[t._v("rtype-BOOKSERIE")]),t._v(" "),e("td",[t._v("23")])]),e("tr",[e("th",[t._v("rtype-BOOK_SECTION")]),t._v(" "),e("td",[t._v("314")])]),e("tr",[e("th",[t._v("rtype-TOC")]),t._v(" "),e("td",[t._v("2536")])])])]),t._v(" "),e("h2",{attrs:{id:"alerts"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#alerts"}},[t._v("#")]),t._v(" Alerts")]),t._v(" "),e("table",[e("tbody",[e("tr",[e("th",[t._v("active-alerts")]),t._v(" "),e("td",[t._v("unknown-domains\n      "),e("div",{staticClass:"comment"},[t._v("List of alerts that can be thrown")])])]),e("tr",[e("th",[t._v("alert-1")]),t._v(" "),e("td",[t._v("www.ncbi.nlm.nih.gov is unknown but represents 64% of the log lines\n      "),e("div",{staticClass:"comment"},[t._v("Alert content")])])])])]),t._v(" "),e("h2",{attrs:{id:"notifications"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#notifications"}},[t._v("#")]),t._v(" Notifications")]),t._v(" "),e("table",[e("tbody",[e("tr",[e("th",[t._v("mailto")]),t._v(" "),e("td",[t._v("someone@somewhere.com\n      "),e("div",{staticClass:"comment"},[t._v("Recepient(s) of the mail sent at the end of the processing")])])]),e("tr",[e("th",[t._v("mail-status")]),t._v(" "),e("td",[t._v("success\n      "),e("div",{staticClass:"comment"},[t._v("Status of the mail sending.")])])])])]),t._v(" "),e("h2",{attrs:{id:"deduplicating"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#deduplicating"}},[t._v("#")]),t._v(" Deduplicating")]),t._v(" "),e("table",[e("tbody",[e("tr",[e("th",[t._v("activated")]),t._v(" "),e("td",[t._v("true")])]),e("tr",[e("th",[t._v("fieldname-C")]),t._v(" "),e("td",[t._v("session")])]),e("tr",[e("th",[t._v("fieldname-I")]),t._v(" "),e("td",[t._v("host")])]),e("tr",[e("th",[t._v("fieldname-L")]),t._v(" "),e("td",[t._v("login")])]),e("tr",[e("th",[t._v("strategy")]),t._v(" "),e("td",[t._v("CLI")])]),e("tr",[e("th",[t._v("window-html")]),t._v(" "),e("td",[t._v("10\n      "),e("div",{staticClass:"comment"},[t._v("\nNumber of seconds used for the deduplication timeframe of HTML consultations (ie. consultations of a resource with the same ID are grouped together in a single event, cf COUNTER)\n      ")])])]),e("tr",[e("th",[t._v("window-misc")]),t._v(" "),e("td",[t._v("30\n    "),e("div",{staticClass:"comment"},[t._v("Number of seconds used for the deduplication timeframe of MISC consultations")])])]),e("tr",[e("th",[t._v("window-pdf")]),t._v(" "),e("td",[t._v("30\n    "),e("div",{staticClass:"comment"},[t._v("Number of seconds used for the deduplication tiemframe of PDF consultations")])])])])]),t._v(" "),e("h2",{attrs:{id:"files"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#files"}},[t._v("#")]),t._v(" Files")]),t._v(" "),e("table",[e("tbody",[e("tr",[e("th",[t._v("1")]),t._v(" "),e("td",[t._v("fede.bibliovie.ezproxy.2013.11.19.log.gz")])])])]),t._v(" "),e("h2",{attrs:{id:"first-consultation-event"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#first-consultation-event"}},[t._v("#")]),t._v(" First consultation event")]),t._v(" "),e("table",[e("tbody",[e("tr",[e("th",[t._v("date")]),t._v(" "),e("td",[t._v("2013-11-19")])]),e("tr",[e("th",[t._v("datetime")]),t._v(" "),e("td",[t._v("2013-11-19T00:11:57+01:00")])]),e("tr",[e("th",[t._v("domain")]),t._v(" "),e("td",[t._v("www.nature.com")])]),e("tr",[e("th",[t._v("geoip-addr")]),t._v(" "),e("td",[e("div",{staticClass:"comment"},[t._v("GeoIP Address extracted from the IP address of the consulting host")])])]),e("tr",[e("th",[t._v("geoip-city")]),t._v(" "),e("td",[e("div",{staticClass:"comment"},[t._v("City, extracted from the IP address of the consulting host")])])]),e("tr",[e("th",[t._v("geoip-coordinates")]),t._v(" "),e("td",[e("div",{staticClass:"comment"},[t._v("Coordinates (longitude and latitude) extracted from the IP address of the consulting host")])])]),e("tr",[e("th",[t._v("geoip-country")]),t._v(" "),e("td",[e("div",{staticClass:"comment"},[t._v("Country code extracted from the IP address of the consulting host")])])]),e("tr",[e("th",[t._v("geoip-family")]),t._v(" "),e("td")]),e("tr",[e("th",[t._v("geoip-host")]),t._v(" "),e("td",[e("div",{staticClass:"comment"},[t._v("GeoIP Host extracted from the IP address of the consulting host")])])]),e("tr",[e("th",[t._v("geoip-latitude")]),t._v(" "),e("td")]),e("tr",[e("th",[t._v("geoip-longitude")]),t._v(" "),e("td")]),e("tr",[e("th",[t._v("geoip-region")]),t._v(" "),e("td")]),e("tr",[e("th",[t._v("host")]),t._v(" "),e("td",[t._v("test.proxad.net (a domain name in the sample log, but usually an IP address)\n      "),e("div",{staticClass:"comment"},[t._v("Original consulting host (usually an IP address)")])])]),e("tr",[e("th",[t._v("login")]),t._v(" "),e("td",[t._v("MYLOGIN\n      "),e("div",{staticClass:"comment"},[t._v("Login used for accessing the resource")])])]),e("tr",[e("th",[t._v("mime")]),t._v(" "),e("td",[t._v("MISC\n      "),e("div",{staticClass:"comment"},[t._v("Mime-type of the ressource, as recognized by the parser")])])]),e("tr",[e("th",[t._v("platform")]),t._v(" "),e("td",[t._v("npg\n      "),e("div",{staticClass:"comment"},[t._v("Short name for the consulted platform (ie name of the parser used to analyse the resource's URL)")])])]),e("tr",[e("th",[t._v("rtype")]),t._v(" "),e("td",[t._v("TOC\n      "),e("div",{staticClass:"comment"},[t._v("Reousrce type for the consulted resource, as recognized by the parser")])])]),e("tr",[e("th",[t._v("size")]),t._v(" "),e("td",[t._v("40054\n      "),e("div",{staticClass:"comment"},[t._v("HTTP Request size")])])]),e("tr",[e("th",[t._v("status")]),t._v(" "),e("td",[t._v("200\n      "),e("div",{staticClass:"comment"},[t._v("HTTP code sent by the server when the resource is accessed")])])]),e("tr",[e("th",[t._v("timestamp")]),t._v(" "),e("td",[t._v("1384816317")])]),e("tr",[e("th",[t._v("title_id")]),t._v(" "),e("td",[t._v("siteindex\n      "),e("div",{staticClass:"comment"},[t._v("Vendor identifier, as determined by the parser")])])]),e("tr",[e("th",[t._v("unitid")]),t._v(" "),e("td",[t._v("siteindex\n      "),e("div",{staticClass:"comment"},[t._v("Unique identifier for the resource, as determined by the parser (used for deduplicating identical resources)")])])]),e("tr",[e("th",[t._v("url")]),t._v(" "),e("td",[e("a",{attrs:{target:"_blank",href:"http://www.nature.com/siteindex/index.html"}},[t._v("http://www.nature.com:80/siteindex/index.html")])])])])]),t._v(" "),e("h2",{attrs:{id:"unknown-domains"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#unknown-domains"}},[t._v("#")]),t._v(" Unknown Domains")]),t._v(" "),e("p",[t._v("The unknown domains are domains for which no parser gets started. If URLs correspond to a provider's platform that should be analysed by ezPAARSE, you have to check on the "),e("a",{attrs:{href:"http://analyses.ezpaarse.org",target:"_blank",rel:"noopener noreferrer"}},[t._v("Analogist platform analysis website"),e("OutboundLink")],1),t._v(" if the platform is already listed and you will also get an indication of how advanced its analysis is.")])])}),[],!1,null,null,null);e.default=a.exports}}]);