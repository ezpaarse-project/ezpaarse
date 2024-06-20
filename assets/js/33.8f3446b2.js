(window.webpackJsonp=window.webpackJsonp||[]).push([[33],{321:function(a,e,t){a.exports=t.p+"assets/img/admin-interface.e0367797.png"},322:function(a,e,t){a.exports=t.p+"assets/img/process-interface.3606ba97.png"},419:function(a,e,t){"use strict";t.r(e);var s=t(10),r=Object(s.a)({},(function(){var a=this,e=a._self._c;return e("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[e("h1",{attrs:{id:"ezunpaywall"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#ezunpaywall"}},[a._v("#")]),a._v(" ezunpaywall")]),a._v(" "),e("p",[a._v("Fetches "),e("a",{attrs:{href:"https://www.unpaywall.org/",target:"_blank",rel:"noopener noreferrer"}},[a._v("unpaywall"),e("OutboundLink")],1),a._v(" metadata from "),e("a",{attrs:{href:"https://unpaywall.inist.fr/",target:"_blank",rel:"noopener noreferrer"}},[a._v("ezunpaywall"),e("OutboundLink")],1),a._v(", the Unpaywall mirror hosted by the Inist-CNRS. this data are uses to enrich EC.")]),a._v(" "),e("h2",{attrs:{id:"enriched-fields"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#enriched-fields"}},[a._v("#")]),a._v(" Enriched fields")]),a._v(" "),e("table",[e("thead",[e("tr",[e("th",[a._v("Name")]),a._v(" "),e("th",[a._v("Type")]),a._v(" "),e("th",[a._v("Description")])])]),a._v(" "),e("tbody",[e("tr",[e("td",[a._v("publication_title")]),a._v(" "),e("td",[a._v("String")]),a._v(" "),e("td",[a._v("Name of publication.")])]),a._v(" "),e("tr",[e("td",[a._v("is_oa")]),a._v(" "),e("td",[a._v("Boolean")]),a._v(" "),e("td",[a._v("Is there an OA copy of this resource.")])]),a._v(" "),e("tr",[e("td",[a._v("journal_is_in_doaj")]),a._v(" "),e("td",[a._v("Boolean")]),a._v(" "),e("td",[a._v("Is this resource published in a DOAJ-indexed journal.")])]),a._v(" "),e("tr",[e("td",[a._v("journal_is_oa")]),a._v(" "),e("td",[a._v("Boolean")]),a._v(" "),e("td",[a._v("Is this resource published in a completely OA journal.")])]),a._v(" "),e("tr",[e("td",[a._v("oa_status")]),a._v(" "),e("td",[a._v("String")]),a._v(" "),e("td",[a._v("The OA status, or color, of this resource.")])]),a._v(" "),e("tr",[e("td",[a._v("updated")]),a._v(" "),e("td",[a._v("String")]),a._v(" "),e("td",[a._v("Time when the data for this resource was last updated.")])]),a._v(" "),e("tr",[e("td",[a._v("oa_request_date")]),a._v(" "),e("td",[a._v("Date")]),a._v(" "),e("td",[a._v("Date of open access information.")])])])]),a._v(" "),e("h2",{attrs:{id:"prerequisites"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#prerequisites"}},[a._v("#")]),a._v(" Prerequisites")]),a._v(" "),e("p",[a._v("Your EC needs a DOI for enrichment.\nYou need an API key to use this service. You can use the "),e("strong",[a._v("demo")]),a._v(" apikey but it's limited to "),e("strong",[a._v("100 000")]),a._v(" DOIs per day for everyone.\n"),e("strong",[a._v("Open access information is valid for EC generated on the same day")]),a._v(". Unpaywall data does not retain open access history.")]),a._v(" "),e("p",[e("strong",[a._v("You must use ezunpaywall after filter, parser, deduplicator middleware.")])]),a._v(" "),e("h2",{attrs:{id:"headers"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#headers"}},[a._v("#")]),a._v(" Headers")]),a._v(" "),e("ul",[e("li",[e("strong",[a._v("ezunpaywall-cache")]),a._v(" : Enable/Disable cache.")]),a._v(" "),e("li",[e("strong",[a._v("ezunpaywall-ttl")]),a._v(" : Lifetime of cached documents, in seconds. Defaults to "),e("code",[a._v("7 days (3600 * 24 * 7)")]),a._v(".")]),a._v(" "),e("li",[e("strong",[a._v("ezunpaywall-throttle")]),a._v(" : Minimum time to wait between queries, in milliseconds. Defaults to "),e("code",[a._v("100")]),a._v("ms.")]),a._v(" "),e("li",[e("strong",[a._v("ezunpaywall-paquet-size")]),a._v(" : Maximum number of identifiers to send for query in a single request. Defaults to "),e("code",[a._v("100")]),a._v(".")]),a._v(" "),e("li",[e("strong",[a._v("ezunpaywall-buffer-size")]),a._v(" : Maximum number of memorised access events before sending a request. Defaults to "),e("code",[a._v("1000")]),a._v(".")]),a._v(" "),e("li",[e("strong",[a._v("ezunpaywall-api-key")]),a._v(" : apikey to use ezunpaywall.")])]),a._v(" "),e("h2",{attrs:{id:"how-to-use"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#how-to-use"}},[a._v("#")]),a._v(" How to use")]),a._v(" "),e("h3",{attrs:{id:"ezpaarse-config"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-config"}},[a._v("#")]),a._v(" ezPAARSE config")]),a._v(" "),e("p",[a._v("You can add or remove your ezunpaywall on ezpaarse config. It will be used on every process that used ezunpaywall middleware. You need to add this code on your "),e("code",[a._v("config.local.json")]),a._v(".")]),a._v(" "),e("div",{staticClass:"language-json extra-class"},[e("pre",{pre:!0,attrs:{class:"language-json"}},[e("code",[e("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n  "),e("span",{pre:!0,attrs:{class:"token property"}},[a._v('"EZPAARSE_DEFAULT_HEADERS"')]),e("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n    "),e("span",{pre:!0,attrs:{class:"token property"}},[a._v('"ezunpaywall-api-key"')]),e("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[a._v('"<ezunpaywall apikey>"')]),a._v("\n  "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n")])])]),e("h3",{attrs:{id:"ezpaarse-admin-interface"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-admin-interface"}},[a._v("#")]),a._v(" ezPAARSE admin interface")]),a._v(" "),e("p",[a._v("You can add or remove ezunpaywall by default to all your enrichments, provided you have added an API key in the config. To do this, go to the middleware section of administration.")]),a._v(" "),e("p",[e("img",{attrs:{src:t(321),alt:"image"}})]),a._v(" "),e("h3",{attrs:{id:"ezpaarse-process-interface"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-process-interface"}},[a._v("#")]),a._v(" ezPAARSE process interface")]),a._v(" "),e("p",[a._v("You can use ezunpaywall for an enrichment process. You just add the middleware and enter the API key.")]),a._v(" "),e("p",[e("img",{attrs:{src:t(322),alt:"image"}})]),a._v(" "),e("h3",{attrs:{id:"ezp"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#ezp"}},[a._v("#")]),a._v(" ezp")]),a._v(" "),e("p",[a._v("You can use ezunpaywall for an enrichment process with "),e("a",{attrs:{href:"https://github.com/ezpaarse-project/node-ezpaarse",target:"_blank",rel:"noopener noreferrer"}},[a._v("ezp"),e("OutboundLink")],1),a._v(" like this:")]),a._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[e("span",{pre:!0,attrs:{class:"token comment"}},[a._v("# enrich with one file")]),a._v("\nezp process "),e("span",{pre:!0,attrs:{class:"token operator"}},[a._v("<")]),a._v("path of your file"),e("span",{pre:!0,attrs:{class:"token operator"}},[a._v(">")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("\\")]),a._v("\n  "),e("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("--host")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token operator"}},[a._v("<")]),a._v("host of your ezPAARSE instance"),e("span",{pre:!0,attrs:{class:"token operator"}},[a._v(">")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("\\")]),a._v("\n  "),e("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("--settings")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token operator"}},[a._v("<")]),a._v("settings-id"),e("span",{pre:!0,attrs:{class:"token operator"}},[a._v(">")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("\\")]),a._v("\n  "),e("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("--header")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[a._v('"ezPAARSE-Middlewares: ezunpaywall"')]),a._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("\\")]),a._v("\n  "),e("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("--header")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[a._v('"ezunpaywall-api-key: <ezunpaywall apikey>"')]),a._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("\\")]),a._v("\n  "),e("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("--out")]),a._v(" ./result.csv\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[a._v("# enrich with multiples files")]),a._v("\nezp bulk "),e("span",{pre:!0,attrs:{class:"token operator"}},[a._v("<")]),a._v("path of your directory"),e("span",{pre:!0,attrs:{class:"token operator"}},[a._v(">")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("\\")]),a._v("\n  "),e("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("--host")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token operator"}},[a._v("<")]),a._v("host of your ezPAARSE instance"),e("span",{pre:!0,attrs:{class:"token operator"}},[a._v(">")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("\\")]),a._v("\n  "),e("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("--settings")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token operator"}},[a._v("<")]),a._v("settings-id"),e("span",{pre:!0,attrs:{class:"token operator"}},[a._v(">")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("\\")]),a._v("\n  "),e("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("--header")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[a._v('"ezPAARSE-Middlewares: ezunpaywall"')]),a._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("\\")]),a._v("\n  "),e("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("--header")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[a._v('"ezunpaywall-api-key: <ezunpaywall apikey>"')]),a._v("\n\n")])])]),e("h3",{attrs:{id:"curl"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#curl"}},[a._v("#")]),a._v(" curl")]),a._v(" "),e("p",[a._v("You can use ezunpaywall for an enrichment process with curl like this:")]),a._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[e("span",{pre:!0,attrs:{class:"token function"}},[a._v("curl")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("-X")]),a._v(" POST "),e("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("-v")]),a._v(" http://localhost:59599 "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("\\")]),a._v("\n  "),e("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("-H")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[a._v('"ezPAARSE-Middlewares: ezunpaywall"')]),a._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("\\")]),a._v("\n  "),e("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("-H")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[a._v('"ezunpaywall-api-key: <ezunpaywall apikey>"')]),a._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("\\")]),a._v("\n  "),e("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("-H")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[a._v('"Log-Format-Ezproxy: <line format>"')]),a._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("\\")]),a._v("\n  "),e("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("-F")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[a._v('"file=@<log file path>"')]),a._v("\n\n")])])])])}),[],!1,null,null,null);e.default=r.exports}}]);