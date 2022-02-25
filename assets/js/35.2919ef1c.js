(window.webpackJsonp=window.webpackJsonp||[]).push([[35],{479:function(e,t,a){"use strict";a.r(t);var s=a(35),r=Object(s.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h1",{attrs:{id:"metadata-enrichment"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#metadata-enrichment"}},[e._v("#")]),e._v(" Metadata enrichment")]),e._v(" "),a("p",[a("strong",[e._v("Middlewares")]),e._v(" can be used to enrich access events by querying external APIs.\nBy default, ezPAARSE is configured for using 4 enrichment middlewares:")]),e._v(" "),a("ul",[a("li",[e._v("istex")]),e._v(" "),a("li",[e._v("crossref")]),e._v(" "),a("li",[e._v("sudoc")]),e._v(" "),a("li",[e._v("hal")])]),e._v(" "),a("p",[e._v("For more details on middlewares, you can read the "),a("RouterLink",{attrs:{to:"/development/middlewares.html"}},[e._v("dedicated section")]),e._v(".")],1),e._v(" "),a("h2",{attrs:{id:"important-caveats"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#important-caveats"}},[e._v("#")]),e._v(" Important Caveats")]),e._v(" "),a("h3",{attrs:{id:"accessing-external-apis-availability-authorization"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#accessing-external-apis-availability-authorization"}},[e._v("#")]),e._v(" Accessing external APIs: availability, authorization")]),e._v(" "),a("p",[e._v("When sending requests to an external API, things can go wrong and ezPAARSE will stop working after 5 failures in a row.")]),e._v(" "),a("p",[e._v("Firstly, the API has to be available: if it is not the case, our advice is to wait a bit and launch an ezPAARSE job again.")]),e._v(" "),a("p",[e._v("Secondly, your ezPAARSE instance has to be authorized reaching out to the external API.\nIf you work behind a proxy (the proxy being at your institution level) it should be declared in your environment variables: you have to check that HTTP_PROXY and HTTPS_PROXY (and their lowercase counterparts) are known from the machine where your ezpaarse instance is installed. Once checked, you will have to restart your instance ("),a("code",[e._v("make stop")]),e._v(", then "),a("code",[e._v("make start")]),e._v(") so they are taken in account by the crossref middleware used by ezpaarse")]),e._v(" "),a("p",[e._v("Less probably, if your proxy is correctly declared in the environments variables but won't let the queries go out: there is a tweak to be made at the institution proxy level. You can correctly process logs as soon as the proxy is configured to let those queries go out.")]),e._v(" "),a("h3",{attrs:{id:"impact-on-the-speed-of-processing"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#impact-on-the-speed-of-processing"}},[e._v("#")]),e._v(" Impact on the Speed of Processing")]),e._v(" "),a("p",[e._v("Using those enrichment middlewares may slow the process down, as the number of queries is limited over time.")]),e._v(" "),a("p",[e._v("However, the results are temporarily cached in the mongoDB database, to prevent multiple occurrences of a document from generating further requests. The actual number of requests (i.e. excluding cached ones) is available in the report under "),a("code",[e._v("general -> <middleware>-queries")]),e._v(". Where "),a("code",[e._v("<middleware>")]),e._v(" is the name of the middleware involved.")]),e._v(" "),a("h2",{attrs:{id:"configuring-crossref-middleware-call"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#configuring-crossref-middleware-call"}},[e._v("#")]),e._v(" Configuring Crossref Middleware Call")]),e._v(" "),a("p",[e._v("The Crossref middleware uses the "),a("code",[e._v("DOI")]),e._v(" found in access events to request metadata using the "),a("a",{attrs:{href:"https://www.npmjs.com/package/meta-doi",target:"_blank",rel:"noopener noreferrer"}},[e._v("node-crossref"),a("OutboundLink")],1),e._v(" module.")]),e._v(" "),a("h3",{attrs:{id:"headers"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#headers"}},[e._v("#")]),e._v(" Headers")]),e._v(" "),a("ul",[a("li",[a("strong",[e._v("crossref-Enrich")]),e._v(": set to "),a("code",[e._v("false")]),e._v(" to disable crossref enrichment. Enabled by default.")]),e._v(" "),a("li",[a("strong",[e._v("crossref-TTL")]),e._v(": lifetime of cached documents, in seconds. Defaults to "),a("code",[e._v("7 days (3600 * 24 * 7)")])]),e._v(" "),a("li",[a("strong",[e._v("crossref-throttle")]),e._v(": minimum time to wait between queries, in milliseconds. Defaults to "),a("code",[e._v("200")]),e._v("ms")]),e._v(" "),a("li",[a("strong",[e._v("crossref-paquet-size")]),e._v(": maximum number of identifiers to send for query in a single request. Defaults to "),a("code",[e._v("50")])]),e._v(" "),a("li",[a("strong",[e._v("crossref-buffer-size")]),e._v(": maximum number of memorised access events before sending a request. Defaults to "),a("code",[e._v("1000")])]),e._v(" "),a("li",[a("strong",[e._v("crossref-license")]),e._v(": set to "),a("code",[e._v("true")]),e._v(" to get the "),a("code",[e._v("license")]),e._v(" field as JSON. Disabled by default.")])]),e._v(" "),a("h2",{attrs:{id:"configuring-sudoc-middleware-call"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#configuring-sudoc-middleware-call"}},[e._v("#")]),e._v(" Configuring Sudoc Middleware Call")]),e._v(" "),a("h3",{attrs:{id:"headers-2"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#headers-2"}},[e._v("#")]),e._v(" Headers")]),e._v(" "),a("ul",[a("li",[a("strong",[e._v("sudoc-Enrich")]),e._v(": set to "),a("code",[e._v("true")]),e._v(" to enable Sudoc enrichment. Disabled by default.")]),e._v(" "),a("li",[a("strong",[e._v("sudoc-TTL")]),e._v(": lifetime of cached documents, in seconds. Defaults to "),a("code",[e._v("7 days (3600 * 24 * 7)")]),e._v(".")]),e._v(" "),a("li",[a("strong",[e._v("sudoc-Throttle")]),e._v(" : minimum time to wait between queries, in milliseconds. Defaults to "),a("code",[e._v("500")]),e._v(".")])]),e._v(" "),a("h2",{attrs:{id:"configuring-hal-middleware-call"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#configuring-hal-middleware-call"}},[e._v("#")]),e._v(" Configuring HAL Middleware Call")]),e._v(" "),a("p",[e._v("The HAL middleware uses the "),a("code",[e._v("hal-identifier")]),e._v(" found in the access events to request metadata using the "),a("a",{attrs:{href:"https://www.npmjs.com/package/methal",target:"_blank",rel:"noopener noreferrer"}},[e._v("node-hal"),a("OutboundLink")],1)]),e._v(" "),a("h3",{attrs:{id:"headers-3"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#headers-3"}},[e._v("#")]),e._v(" Headers")]),e._v(" "),a("ul",[a("li",[a("strong",[e._v("HAL-Enrich")]),e._v(": set to "),a("code",[e._v("true")]),e._v(" to enable HAL enrichment. Disabled by default.")]),e._v(" "),a("li",[a("strong",[e._v("HAL-TTL")]),e._v(": lifetime of cached documents, in seconds. Defaults to "),a("code",[e._v("7 days (3600 * 24 * 7)")]),e._v(".")]),e._v(" "),a("li",[a("strong",[e._v("HAL-Throttle")]),e._v(": minimum time to wait between queries, in milliseconds. Defaults to "),a("code",[e._v("500")]),e._v(".")])]),e._v(" "),a("h2",{attrs:{id:"configuring-istex-middleware-call"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#configuring-istex-middleware-call"}},[e._v("#")]),e._v(" Configuring ISTEX Middleware Call")]),e._v(" "),a("p",[e._v("The ISTEX middleware uses the "),a("code",[e._v("istex-identifier")]),e._v(" found in the access events to request metadata using the "),a("a",{attrs:{href:"hhttps://www.npmjs.com/package/node-istex"}},[e._v("node-istex")])]),e._v(" "),a("p",[e._v("ISTEX middleware is automatically activated on ISTEX logs")]),e._v(" "),a("h3",{attrs:{id:"headers-4"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#headers-4"}},[e._v("#")]),e._v(" Headers")]),e._v(" "),a("ul",[a("li",[a("strong",[e._v("istex-enrich")]),e._v(" : set to "),a("code",[e._v("true")]),e._v(" to enable ISTEX enrichment. Disabled by default.")]),e._v(" "),a("li",[a("strong",[e._v("istex-ttl")]),e._v(" : lifetime of cached documents, in seconds. Defaults to "),a("code",[e._v("7 days (3600 * 24 * 7)")]),e._v(".")]),e._v(" "),a("li",[a("strong",[e._v("istex-throttle")]),e._v(" : minimum time to wait between queries, in milliseconds. Defaults to "),a("code",[e._v("500")]),e._v(".")])]),e._v(" "),a("h2",{attrs:{id:"configuring-unpaywall-middleware-call"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#configuring-unpaywall-middleware-call"}},[e._v("#")]),e._v(" Configuring Unpaywall Middleware Call")]),e._v(" "),a("p",[e._v("The Unpaywall middleware uses the "),a("code",[e._v("DOI")]),e._v(" found in access events to request Open Acess metadata using the Unpaywall API. Limited to "),a("code",[e._v("100 000")]),e._v(" DOIs per day.")]),e._v(" "),a("h3",{attrs:{id:"headers-5"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#headers-5"}},[e._v("#")]),e._v(" Headers")]),e._v(" "),a("ul",[a("li",[a("strong",[e._v("unpaywall-cache")]),e._v(": set to "),a("code",[e._v("false")]),e._v(" to disable result caching. Enabled by default.")]),e._v(" "),a("li",[a("strong",[e._v("unpaywall-TTL")]),e._v(": lifetime of cached documents, in seconds. Defaults to "),a("code",[e._v("7 days (3600 * 24 * 7)")])]),e._v(" "),a("li",[a("strong",[e._v("unpaywall-throttle")]),e._v(": minimum time to wait between each packet of queries, in milliseconds. Defaults to "),a("code",[e._v("100")]),e._v("ms")]),e._v(" "),a("li",[a("strong",[e._v("unpaywall-paquet-size")]),e._v(": maximum number of DOIs to request in parallel. Defaults to "),a("code",[e._v("10")])]),e._v(" "),a("li",[a("strong",[e._v("unpaywall-buffer-size")]),e._v(": maximum number of memorised access events before sending requests. Defaults to "),a("code",[e._v("200")])]),e._v(" "),a("li",[a("strong",[e._v("unpaywall-email")]),e._v(": the email to use for API calls. Defaults to "),a("code",[e._v("YOUR_EMAIL")]),e._v(".")])])])}),[],!1,null,null,null);t.default=r.exports}}]);