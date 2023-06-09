(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{303:function(e,t,a){"use strict";a.r(t);var s=a(10),r=Object(s.a)({},(function(){var e=this,t=e._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h1",{attrs:{id:"parameters"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#parameters"}},[e._v("#")]),e._v(" Parameters")]),e._v(" "),t("p",[e._v("The ezPAARSE jobs can be configured using HTTP headers. Please find the list of available headers below.")]),e._v(" "),t("h3",{attrs:{id:"content-encoding"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#content-encoding"}},[e._v("#")]),e._v(" Content-Encoding")]),e._v(" "),t("p",[e._v("Encoding of the data sent.\n"),t("em",[e._v("(supported: gzip, deflate)")])]),e._v(" "),t("h3",{attrs:{id:"response-encoding"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#response-encoding"}},[e._v("#")]),e._v(" Response-Encoding")]),e._v(" "),t("p",[e._v("Encoding of the data sent back by server.\n"),t("em",[e._v("(supported: gzip, deflate)")])]),e._v(" "),t("h3",{attrs:{id:"accept"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#accept"}},[e._v("#")]),e._v(" Accept")]),e._v(" "),t("p",[e._v("Output format.\nSupported:")]),e._v(" "),t("ul",[t("li",[e._v("text/csv (by default)")]),e._v(" "),t("li",[e._v("text/tab-separated-values (for a TSV output: as CSV but tab-delimited)")]),e._v(" "),t("li",[e._v("application/json")]),e._v(" "),t("li",[e._v("application/jsonstream (one JSON object per line)")])]),e._v(" "),t("h3",{attrs:{id:"log-format-xxx"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#log-format-xxx"}},[e._v("#")]),e._v(" Log-Format-xxx")]),e._v(" "),t("p",[e._v("Format of the log lines in input, depends on the proxy "),t("em",[e._v("xxx")]),e._v(" used. "),t("RouterLink",{attrs:{to:"/essential/formats.html"}},[e._v("See the available formats")])],1),e._v(" "),t("h3",{attrs:{id:"date-format"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#date-format"}},[e._v("#")]),e._v(" Date-Format")]),e._v(" "),t("p",[e._v("Date format used in the logs sent. Default is: 'DD/MMM/YYYY:HH:mm:ss Z'.")]),e._v(" "),t("h3",{attrs:{id:"crypted-fields"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#crypted-fields"}},[e._v("#")]),e._v(" Crypted-Fields")]),e._v(" "),t("p",[e._v("Comma-separated list of fields that will be crypted in the results, or "),t("code",[e._v("none")]),e._v(" to disable crypting. Defaults to "),t("code",[e._v("host,login")]),e._v(".")]),e._v(" "),t("p",[t("strong",[e._v("Caution")]),e._v(": each job uses a random salt for crypting, so crypted values for the same access event but from distinct jobs are not identical. Use the "),t("code",[e._v("Crypting-Salt")]),e._v(" header to change this behavior.")]),e._v(" "),t("h3",{attrs:{id:"crypting-salt"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#crypting-salt"}},[e._v("#")]),e._v(" Crypting-Salt")]),e._v(" "),t("p",[e._v("A specific crypting key to use if you want fields to be crypted the same way accross different jobs.")]),e._v(" "),t("h3",{attrs:{id:"crypting-algorithm"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#crypting-algorithm"}},[e._v("#")]),e._v(" Crypting-Algorithm")]),e._v(" "),t("p",[e._v("The algorithm that should be used to crypt fields. It must be supported by the version of OpenSSL that is installed on the platform. On recent releases of OpenSSL, "),t("code",[e._v("openssl list -digest-algorithms")]),e._v(" will display the available algorithms.")]),e._v(" "),t("h3",{attrs:{id:"output-fields"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#output-fields"}},[e._v("#")]),e._v(" Output-Fields")]),e._v(" "),t("p",[e._v("To specify the fields to include in the output (if the format allows it). "),t("RouterLink",{attrs:{to:"/features/outputfields.html"}},[e._v("(More information)")])],1),e._v(" "),t("h3",{attrs:{id:"traces-level"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#traces-level"}},[e._v("#")]),e._v(" Traces-Level")]),e._v(" "),t("p",[e._v("To specify the verbosity level from ezPAARSE's feedback. The higher levels include the lower ones.")]),e._v(" "),t("ul",[t("li",[t("strong",[e._v("error")]),e._v(": blocking errors, abnormal treatment termination.")]),e._v(" "),t("li",[t("strong",[e._v("warn")]),e._v(": errors not fatal to the treatment.")]),e._v(" "),t("li",[t("strong",[e._v("info")]),e._v(": general informations (requested format, ending notification, number of access events generated...).")]),e._v(" "),t("li",[t("strong",[e._v("verbose")]),e._v(": more precise than info, gives more information about each stage of the treatment.")]),e._v(" "),t("li",[t("strong",[e._v("silly")]),e._v(": every detail of the treatment (parser not found, line ignored, unsuccessful search in a pkb...).")])]),e._v(" "),t("h3",{attrs:{id:"reject-files"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#reject-files"}},[e._v("#")]),e._v(" Reject-Files")]),e._v(" "),t("p",[e._v("List of the reject files to create, separated by commas.")]),e._v(" "),t("p",[e._v("Possible values are:")]),e._v(" "),t("ul",[t("li",[t("code",[e._v("Unknown-Formats")])]),e._v(" "),t("li",[t("code",[e._v("Ignored-Domains")])]),e._v(" "),t("li",[t("code",[e._v("Unknown-Domains")])]),e._v(" "),t("li",[t("code",[e._v("Unqualified-ECs")])]),e._v(" "),t("li",[t("code",[e._v("Duplicate-ECs")])]),e._v(" "),t("li",[t("code",[e._v("Unordered-ECs")])]),e._v(" "),t("li",[t("code",[e._v("Filtered-ECs")])]),e._v(" "),t("li",[t("code",[e._v("Ignored-Hosts")])]),e._v(" "),t("li",[t("code",[e._v("Robots-ECs")])])]),e._v(" "),t("p",[e._v("Set to "),t("code",[e._v("none")]),e._v(" by default.")]),e._v(" "),t("p",[e._v("We recommend to set it to "),t("code",[e._v("all")]),e._v(" when you start using ezPAARSE, to fully understand the filtering and exclusion system.")]),e._v(" "),t("h3",{attrs:{id:"double-click-xxx"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#double-click-xxx"}},[e._v("#")]),e._v(" Double-Click-xxx")]),e._v(" "),t("p",[e._v("Parameters used for deduplication. "),t("RouterLink",{attrs:{to:"/features/doubleclick.html"}},[e._v("(More information)")]),e._v(".")],1),e._v(" "),t("h3",{attrs:{id:"request-charset"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#request-charset"}},[e._v("#")]),e._v(" Request-Charset")]),e._v(" "),t("p",[e._v("Character map used for input. "),t("a",{attrs:{href:"https://github.com/ashtuchkin/iconv-lite#supported-encodings",target:"_blank",rel:"noopener noreferrer"}},[e._v("(see supported encodings)"),t("OutboundLink")],1),e._v(".")]),e._v(" "),t("h3",{attrs:{id:"response-charset"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#response-charset"}},[e._v("#")]),e._v(" Response-Charset")]),e._v(" "),t("p",[e._v("Character map used for output. "),t("a",{attrs:{href:"https://github.com/ashtuchkin/iconv-lite#supported-encodings",target:"_blank",rel:"noopener noreferrer"}},[e._v("(see supported encodings)"),t("OutboundLink")],1),e._v(".")]),e._v(" "),t("h3",{attrs:{id:"max-parse-attempts"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#max-parse-attempts"}},[e._v("#")]),e._v(" Max-Parse-Attempts")]),e._v(" "),t("p",[e._v("Maximum number of lines that ezPAARSE will attempt to parse in order to check the log format.")]),e._v(" "),t("h3",{attrs:{id:"clean-only"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#clean-only"}},[e._v("#")]),e._v(" Clean-Only")]),e._v(" "),t("p",[e._v("If set to "),t("code",[e._v("true")]),e._v(", ezPAARSE will just filter out the lines we are sure are irrelevant and output only the relevant ones.\nThe goal when using this parameter is to reduce the size of the log file, if you need to store it for further treatment.")]),e._v(" "),t("h4",{attrs:{id:"video-demonstration"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#video-demonstration"}},[e._v("#")]),e._v(" Video Demonstration")]),e._v(" "),t("p",[e._v("This "),t("a",{attrs:{href:"https://www.youtube.com/watch?v=I3D6lO4wDZo",target:"_blank",rel:"noopener noreferrer"}},[e._v("screencast"),t("OutboundLink")],1),e._v(" demonstrates the usage of the Clean-Only parameter (ie the cleaning of a log file for size reduction and ease of storage)")]),e._v(" "),t("h3",{attrs:{id:"force-parser"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#force-parser"}},[e._v("#")]),e._v(" Force-Parser")]),e._v(" "),t("p",[e._v("If URLs don't have a "),t("code",[e._v("domain")]),e._v(" part, use this parameter to force the right parser to be used. Useful for Open Access logs analysis, which don't have a domain part in the URL (all URLs comes from the same domain).")]),e._v(" "),t("p",[e._v("Example:")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("Force-Parser: 'dspace'\n")])])]),t("p",[e._v("Can be used in conjonction with "),t("a",{attrs:{href:"#force-ecfield-publisher"}},[e._v("Force-ECField-Publisher")]),e._v(".")]),e._v(" "),t("h3",{attrs:{id:"geoip"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#geoip"}},[e._v("#")]),e._v(" Geoip")]),e._v(" "),t("p",[e._v("Listing of the geolocation informations to be added to the results. By default "),t("code",[e._v("geoip-longitude, geoip-latitude, geoip-country")]),e._v(". "),t("code",[e._v("all")]),e._v(" can be used to include every fiel available, or "),t("code",[e._v("none")]),e._v(" to deactivate geolocation altogether. "),t("RouterLink",{attrs:{to:"/features/geolocalisation.html"}},[e._v("(More information)")])],1),e._v(" "),t("h3",{attrs:{id:"ezpaarse-job-notifications"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-job-notifications"}},[e._v("#")]),e._v(" ezPAARSE-Job-Notifications")]),e._v(" "),t("p",[e._v("Listing of notifications to send when treatment is done, written as "),t("code",[e._v("action<cible>")]),e._v(" and separated by commas. Currently available: "),t("code",[e._v("mail<adress>")])]),e._v(" "),t("h3",{attrs:{id:"ezpaarse-middlewares"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-middlewares"}},[e._v("#")]),e._v(" ezPAARSE-Middlewares")]),e._v(" "),t("p",[e._v("Insert a list of middlewares that are not present in the base configuration ("),t("code",[e._v("EZPAARSE_MIDDLEWARES")]),e._v("). The value must be a list of middleware names separated with commas, in the order of use.")]),e._v(" "),t("p",[e._v("By default, they will be inserted at the end of the chain, before "),t("code",[e._v("qualifier")]),e._v(". You can prefix the list with the mention "),t("code",[e._v("(before <middleware name>)")]),e._v(" or "),t("code",[e._v("(after <middleware name>)")]),e._v(" to insert them at a more specific place, or "),t("code",[e._v("(only)")]),e._v(" to only use the middlewares you want.")]),e._v(" "),t("p",[e._v("["),t("code",[e._v("v3.7.0")]),e._v(" and above]"),t("br"),e._v("\nIf you need to insert middlewares at different places, you can declare multiple lists separated with "),t("code",[e._v("|")]),e._v(" (see the example below).")]),e._v(" "),t("h4",{attrs:{id:"examples"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#examples"}},[e._v("#")]),e._v(" Examples")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("'ezPAARSE-Middlewares': 'user-agent-parser, sudoc'\n")])])]),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("'ezPAARSE-Middlewares': '(before istex) user-agent-parser'\n")])])]),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("'ezPAARSE-Middlewares': '(after sudoc) hal, istex'\n")])])]),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("'ezPAARSE-Middlewares': '(only) crossref'\n")])])]),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("'ezPAARSE-Middlewares': '(after deduplicator) crossref | (before geolocalizer) host-chain'\n")])])]),t("h3",{attrs:{id:"ezpaarse-enrich"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-enrich"}},[e._v("#")]),e._v(" ezPAARSE-Enrich")]),e._v(" "),t("p",[e._v("Set to "),t("code",[e._v("false")]),e._v(" to deactivate data enrichment (geoip and knowledge bases). Any other value will leave the data enrichment active.")]),e._v(" "),t("h3",{attrs:{id:"ezpaarse-predefined-settings"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-predefined-settings"}},[e._v("#")]),e._v(" ezPAARSE-Predefined-Settings")]),e._v(" "),t("p",[e._v("Tells ezPAARSE to use a predefined set of parameters. For example: "),t("code",[e._v("inist")]),e._v(" for INIST-CNRS parameters.")]),e._v(" "),t("h3",{attrs:{id:"ezpaarse-filter-redirects"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-filter-redirects"}},[e._v("#")]),e._v(" ezPAARSE-Filter-Redirects")]),e._v(" "),t("p",[e._v("Set to "),t("code",[e._v("false")]),e._v(" to prevent lines with HTTP status codes 301, 302 from being filtered and discarded.")]),e._v(" "),t("h3",{attrs:{id:"ezpaarse-filter-status"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-filter-status"}},[e._v("#")]),e._v(" ezPAARSE-Filter-Status")]),e._v(" "),t("p",[e._v("Set to "),t("code",[e._v("false")]),e._v(" to disable filtering on status codes, or provide a comma-separated list of status codes that should be kept.\nIf you provide your own list, ECs with a status of "),t("code",[e._v("401")]),e._v(" or "),t("code",[e._v("403")]),e._v(" won't be marked as denied, and will be present in the main result file.")]),e._v(" "),t("h4",{attrs:{id:"example"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#example"}},[e._v("#")]),e._v(" Example")]),e._v(" "),t("p",[e._v("Only keep status 200, 201 and 403")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("'ezPAARSE-Filter-Status': '200,201,403'\n")])])]),t("h3",{attrs:{id:"disable-filters"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#disable-filters"}},[e._v("#")]),e._v(" Disable-Filters")]),e._v(" "),t("p",[e._v("Disable filters applying to robots or arbitrary hosts/domains. (defaults to "),t("code",[e._v("none")]),e._v(").\nPossible values (separated by commas): "),t("code",[e._v("robots")]),e._v(", "),t("code",[e._v("ignored-hosts")]),e._v(", "),t("code",[e._v("ignored-domains")]),e._v(".\nSet to "),t("code",[e._v("all")]),e._v(" to disable all above filters.")]),e._v(" "),t("p",[t("strong",[e._v("NB")]),e._v(": when robots are not filtered, add the "),t("code",[e._v("robot")]),e._v(" field to the output in order to know which consultations were made by robots.")]),e._v(" "),t("h3",{attrs:{id:"force-ecfield-publisher"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#force-ecfield-publisher"}},[e._v("#")]),e._v(" Force-ECField-Publisher")]),e._v(" "),t("p",[e._v("Set the publisher_name field to a predefined value.\nFor example: Force-ECField-Publisher: 'IRevues'.")]),e._v(" "),t("h3",{attrs:{id:"session-id-fields"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#session-id-fields"}},[e._v("#")]),e._v(" Session-ID-Fields")]),e._v(" "),t("p",[e._v("Change the fields used to generate session IDs and user IDs. By default, the generator uses either "),t("code",[e._v("login")]),e._v(", "),t("code",[e._v("cookie")]),e._v(", or a combination of "),t("code",[e._v("host")]),e._v(" and "),t("code",[e._v("user-agent")]),e._v(", and store the generated IDs in "),t("code",[e._v("session_id")]),e._v(" and "),t("code",[e._v("user_id")]),e._v(". You can customize those fields by providing a mapping separated by commas.")]),e._v(" "),t("p",[e._v("Default mapping :")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("  user: login, cookie: cookie, host: host, useragent: user-agent, session: session_id, userid: user_id\n")])])]),t("p",[e._v("If your user login is in the "),t("code",[e._v("user_login")]),e._v(" field :")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("  user: user_login\n")])])]),t("h3",{attrs:{id:"extract"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#extract"}},[e._v("#")]),e._v(" Extract")]),e._v(" "),t("p",[e._v("Extract values from a field and dispatch them in new fields. The syntax is the following : "),t("code",[e._v("source_field => extract_expression => destination_fields")])]),e._v(" "),t("h4",{attrs:{id:"examples-2"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#examples-2"}},[e._v("#")]),e._v(" Examples:")]),e._v(" "),t("p",[e._v("The following examples assume we have a "),t("strong",[e._v("login")]),e._v(" field with the value "),t("strong",[e._v("THEODORE_MCCLURE")]),e._v(". Here are multiple ways to create a "),t("strong",[e._v("firstname")]),e._v(" field containing "),t("strong",[e._v("THEODORE")]),e._v(" and "),t("strong",[e._v("lastname")]),e._v(" field containing "),t("strong",[e._v("MCCLURE")]),e._v(".")]),e._v(" "),t("h5",{attrs:{id:"extracting-with-a-regular-expression"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#extracting-with-a-regular-expression"}},[e._v("#")]),e._v(" Extracting with a regular expression:")]),e._v(" "),t("p",[e._v("If the extract expression is a regular expression (between slashes, with optional flags after the closing slash), it's applied to the source field and the captured groups are stored in the destination fields.")]),e._v(" "),t("p",[e._v("The following expression applies the regular expression "),t("code",[e._v("/^([a-z]+)_([a-z]+)$/i")]),e._v(" on the "),t("strong",[e._v("login")]),e._v(" field, and puts the captured groups in the "),t("strong",[e._v("firstname")]),e._v(" and "),t("strong",[e._v("lastname")]),e._v(" fields.")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("  login => /^([a-z]+)_([a-z]+)$/i => firstname,lastname\n")])])]),t("h5",{attrs:{id:"splitting-over-an-expression"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#splitting-over-an-expression"}},[e._v("#")]),e._v(" Splitting over an expression:")]),e._v(" "),t("p",[e._v("If the extract expression is "),t("strong",[e._v("split()")]),e._v(", then the source field will be splitted according to the expression between the parentheses.")]),e._v(" "),t("p",[e._v("The following splits the "),t("strong",[e._v("login")]),e._v(" field with the character "),t("code",[e._v("\\_")]),e._v(" and puts the parts in the "),t("strong",[e._v("firstname")]),e._v(" and "),t("strong",[e._v("lastname")]),e._v(" fields.")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("'Extract': 'login => split(_) => firstname,lastname'\n")])])]),t("p",[e._v("The following splits the "),t("strong",[e._v("login")]),e._v(" field with the regular expression "),t("code",[e._v("/[\\_]+/")]),e._v(" and puts the parts in the "),t("strong",[e._v("firstname")]),e._v(" and "),t("strong",[e._v("lastname")]),e._v(" fields.")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("'Extract': 'login => split(/[_]+/) => firstname,lastname'\n")])])]),t("h2",{attrs:{id:"metadata-enrichment"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#metadata-enrichment"}},[e._v("#")]),e._v(" Metadata enrichment")]),e._v(" "),t("p",[e._v("The use of middlewares to enrich access events with metadata coming from external APIs is controlled by headers.")]),e._v(" "),t("h3",{attrs:{id:"crossref"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#crossref"}},[e._v("#")]),e._v(" Crossref")]),e._v(" "),t("p",[t("RouterLink",{attrs:{to:"/features/metadata-enrichment.html#configuring-crossref-middleware-call"}},[e._v("(More information)")])],1),e._v(" "),t("h3",{attrs:{id:"sudoc"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#sudoc"}},[e._v("#")]),e._v(" Sudoc")]),e._v(" "),t("p",[t("RouterLink",{attrs:{to:"/features/metadata-enrichment.html#configuring-sudoc-middleware-call"}},[e._v("(More information)")])],1),e._v(" "),t("h3",{attrs:{id:"hal"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#hal"}},[e._v("#")]),e._v(" HAL")]),e._v(" "),t("p",[t("RouterLink",{attrs:{to:"/features/metadata-enrichment.html#configuring-hal-middleware-call"}},[e._v("(More information)")])],1),e._v(" "),t("h3",{attrs:{id:"istex"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#istex"}},[e._v("#")]),e._v(" ISTEX")]),e._v(" "),t("p",[t("RouterLink",{attrs:{to:"/features/metadata-enrichment.html#configuring-istex-middleware-call"}},[e._v("(More information)")])],1)])}),[],!1,null,null,null);t.default=r.exports}}]);