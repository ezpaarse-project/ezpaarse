(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{303:function(e,t,r){e.exports=r.p+"assets/img/admin-interface.3eace1ad.png"},304:function(e,t,r){e.exports=r.p+"assets/img/process-interface.dffd82d4.png"},409:function(e,t,r){"use strict";r.r(t);var s=r(10),a=Object(s.a)({},(function(){var e=this,t=e._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h1",{attrs:{id:"crossref"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#crossref"}},[e._v("#")]),e._v(" crossref")]),e._v(" "),t("p",[e._v("Fetches "),t("a",{attrs:{href:"http://search.crossref.org/",target:"_blank",rel:"noopener noreferrer"}},[e._v("crossref"),t("OutboundLink")],1),e._v(" data from their "),t("a",{attrs:{href:"http://search.crossref.org/help/api",target:"_blank",rel:"noopener noreferrer"}},[e._v("API"),t("OutboundLink")],1),e._v(".")]),e._v(" "),t("p",[t("strong",[e._v("This middleware is activated by default.")])]),e._v(" "),t("h2",{attrs:{id:"enriched-fields"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#enriched-fields"}},[e._v("#")]),e._v(" Enriched fields")]),e._v(" "),t("table",[t("thead",[t("tr",[t("th",[e._v("Name")]),e._v(" "),t("th",[e._v("Type")]),e._v(" "),t("th",[e._v("Description")])])]),e._v(" "),t("tbody",[t("tr",[t("td",[e._v("publication_title")]),e._v(" "),t("td",[e._v("String")]),e._v(" "),t("td",[e._v("Name of publication.")])]),e._v(" "),t("tr",[t("td",[e._v("title")]),e._v(" "),t("td",[e._v("String")]),e._v(" "),t("td",[e._v("Title of publication.")])]),e._v(" "),t("tr",[t("td",[e._v("type")]),e._v(" "),t("td",[e._v("String")]),e._v(" "),t("td",[e._v("type of document (journal-article, book-chapter, conference-paper, dissertation, report, dataset etc.)")])]),e._v(" "),t("tr",[t("td",[e._v("rtype")]),e._v(" "),t("td",[e._v("String")]),e._v(" "),t("td",[e._v("Variation of type")])]),e._v(" "),t("tr",[t("td",[e._v("publication_date")]),e._v(" "),t("td",[e._v("String")]),e._v(" "),t("td",[e._v("Date of resource.")])]),e._v(" "),t("tr",[t("td",[e._v("publisher_name")]),e._v(" "),t("td",[e._v("String")]),e._v(" "),t("td",[e._v("Name of publisher.")])]),e._v(" "),t("tr",[t("td",[e._v("print_identifier")]),e._v(" "),t("td",[e._v("Number")]),e._v(" "),t("td",[e._v("ISBN or ISSN.")])]),e._v(" "),t("tr",[t("td",[e._v("online_identifier")]),e._v(" "),t("td",[e._v("Number")]),e._v(" "),t("td",[e._v("EISBN or EISSN.")])]),e._v(" "),t("tr",[t("td",[e._v("subject")]),e._v(" "),t("td",[e._v("String")]),e._v(" "),t("td",[e._v("subject, thematic of publication")])]),e._v(" "),t("tr",[t("td",[e._v("doi")]),e._v(" "),t("td",[e._v("String")]),e._v(" "),t("td",[e._v("DOI of publication.")])]),e._v(" "),t("tr",[t("td",[e._v("license")]),e._v(" "),t("td",[e._v("String")]),e._v(" "),t("td",[e._v("Licence.")])])])]),e._v(" "),t("h2",{attrs:{id:"prerequisites"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#prerequisites"}},[e._v("#")]),e._v(" Prerequisites")]),e._v(" "),t("p",[e._v("Your EC needs a DOI or alternative ID (any other identifier a publisher may have provided) for enrichment.")]),e._v(" "),t("p",[t("strong",[e._v("You must use crossref after filter, parser, deduplicator middleware.")])]),e._v(" "),t("h2",{attrs:{id:"recommendation"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#recommendation"}},[e._v("#")]),e._v(" Recommendation")]),e._v(" "),t("p",[e._v("You can use ezunpaywall with crossreft by placing it in front. This will save you processing time.")]),e._v(" "),t("h2",{attrs:{id:"headers"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#headers"}},[e._v("#")]),e._v(" Headers")]),e._v(" "),t("ul",[t("li",[t("strong",[e._v("crossref-enrich")]),e._v(" : Set to "),t("code",[e._v("false")]),e._v(" to disable crossref enrichment. Enabled by default.")]),e._v(" "),t("li",[t("strong",[e._v("crossref-cache")]),e._v(" : Enable/Disable cache.")]),e._v(" "),t("li",[t("strong",[e._v("crossref-license")]),e._v(" : Set to "),t("code",[e._v("true")]),e._v(" to get the "),t("code",[e._v("license")]),e._v(" field as JSON. Disabled by default.")]),e._v(" "),t("li",[t("strong",[e._v("crossref-ttl")]),e._v(" : Lifetime of cached documents, in seconds. Defaults to "),t("code",[e._v("7 days (3600 * 24 * 7)")]),e._v(".")]),e._v(" "),t("li",[t("strong",[e._v("crossref-throttle")]),e._v(" : Minimum time to wait between queries, in milliseconds. Defaults to "),t("code",[e._v("200")]),e._v("ms.")]),e._v(" "),t("li",[t("strong",[e._v("crossref-paquet-size")]),e._v(" : Maximum number of identifiers to send for query in a single request. Defaults to "),t("code",[e._v("50")]),e._v(".")]),e._v(" "),t("li",[t("strong",[e._v("crossref-buffer-size")]),e._v(" : Maximum number of memorised access events before sending a request. Defaults to "),t("code",[e._v("1000")]),e._v(".")]),e._v(" "),t("li",[t("strong",[e._v("crossref-max-tries")]),e._v(" : Maximum number of attempts if an enrichment fails. Defaults to "),t("code",[e._v("5")]),e._v(".")]),e._v(" "),t("li",[t("strong",[e._v("crossref-on-fail")]),e._v(" : Strategy to adopt if an enrichment reaches the maximum number of attempts. Can be either of "),t("code",[e._v("abort")]),e._v(", "),t("code",[e._v("ignore")]),e._v(" or "),t("code",[e._v("retry")]),e._v(". Defaults to "),t("code",[e._v("abort")]),e._v(".")]),e._v(" "),t("li",[t("strong",[e._v("crossref-base-wait-time")]),e._v(" : Time to wait before retrying after a query fails, in milliseconds. Defaults to "),t("code",[e._v("1000")]),e._v("ms. This time "),t("code",[e._v("doubles")]),e._v(" after each attempt.")]),e._v(" "),t("li",[t("strong",[e._v("crossref-plus-api-token")]),e._v(" : If you signed up for the "),t("code",[e._v("Plus")]),e._v(" service, put your token in this header.")]),e._v(" "),t("li",[t("strong",[e._v("crossref-user-agent")]),e._v(" : Specify what to send in the "),t("code",[e._v("User-Agent")]),e._v(" header when querying Crossref. Defaults to "),t("code",[e._v("ezPAARSE (https://readmetrics.org; mailto:ezteam@couperin.org)")]),e._v(".")])]),e._v(" "),t("h2",{attrs:{id:"how-to-use"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#how-to-use"}},[e._v("#")]),e._v(" How to use")]),e._v(" "),t("h3",{attrs:{id:"ezpaarse-admin-interface"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-admin-interface"}},[e._v("#")]),e._v(" ezPAARSE admin interface")]),e._v(" "),t("p",[e._v("You can add crossref by default to all your enrichments, To do this, go to the middleware section of administration.")]),e._v(" "),t("p",[t("img",{attrs:{src:r(303),alt:"image"}})]),e._v(" "),t("h3",{attrs:{id:"ezpaarse-process-interface"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-process-interface"}},[e._v("#")]),e._v(" ezPAARSE process interface")]),e._v(" "),t("p",[e._v("You can use crossref for an enrichment process. You just add the middleware.")]),e._v(" "),t("p",[t("img",{attrs:{src:r(304),alt:"image"}})]),e._v(" "),t("h3",{attrs:{id:"ezp"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#ezp"}},[e._v("#")]),e._v(" ezp")]),e._v(" "),t("p",[e._v("You can use crossref for an enrichment process with "),t("a",{attrs:{href:"https://github.com/ezpaarse-project/node-ezpaarse",target:"_blank",rel:"noopener noreferrer"}},[e._v("ezp"),t("OutboundLink")],1),e._v(" like this:")]),e._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# enrich with one file")]),e._v("\nezp process "),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("path of your file"),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("\\")]),e._v("\n  "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("--host")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("host of your ezPAARSE instance"),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("\\")]),e._v("\n  "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("--settings")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("settings-id"),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("\\")]),e._v("\n  "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("--header")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[e._v('"ezPAARSE-Middlewares: crossref"')]),e._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("\\")]),e._v("\n  "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("--out")]),e._v(" ./result.csv\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# enrich with multiples files")]),e._v("\nezp bulk "),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("path of your directory"),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("\\")]),e._v("\n  "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("--host")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("host of your ezPAARSE instance"),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("\\")]),e._v("\n  "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("--settings")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("settings-id"),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("\\")]),e._v("\n  "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("--header")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[e._v('"ezPAARSE-Middlewares: crossref"')]),e._v(" \n\n")])])]),t("h3",{attrs:{id:"curl"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#curl"}},[e._v("#")]),e._v(" curl")]),e._v(" "),t("p",[e._v("You can use crossref for an enrichment process with curl like this:")]),e._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[t("span",{pre:!0,attrs:{class:"token function"}},[e._v("curl")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("-X")]),e._v(" POST "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("-v")]),e._v(" http://localhost:59599 "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("\\")]),e._v("\n  "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("-H")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[e._v('"ezPAARSE-Middlewares: crossref"')]),e._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("\\")]),e._v("\n  "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("-H")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[e._v('"Log-Format-Ezproxy: <line format>"')]),e._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("\\")]),e._v("\n  "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("-F")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[e._v('"file=@<log file path>"')]),e._v("\n\n")])])])])}),[],!1,null,null,null);t.default=a.exports}}]);