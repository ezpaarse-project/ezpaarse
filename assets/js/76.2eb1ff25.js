(window.webpackJsonp=window.webpackJsonp||[]).push([[76],{363:function(e,t,a){"use strict";a.r(t);var s=a(10),r=Object(s.a)({},(function(){var e=this,t=e._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h1",{attrs:{id:"unpaywall"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#unpaywall"}},[e._v("#")]),e._v(" unpaywall")]),e._v(" "),t("p",[e._v("The Unpaywall middleware uses the "),t("code",[e._v("DOI")]),e._v(" found in access events to request Open Acess metadata using the Unpaywall API. Limited to "),t("code",[e._v("100 000")]),e._v(" DOIs per day.")]),e._v(" "),t("h2",{attrs:{id:"headers"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#headers"}},[e._v("#")]),e._v(" Headers")]),e._v(" "),t("ul",[t("li",[t("strong",[e._v("unpaywall-cache")]),e._v(" : Set to "),t("code",[e._v("false")]),e._v(" to disable result caching. Enabled by default.")]),e._v(" "),t("li",[t("strong",[e._v("unpaywall-TTL")]),e._v(" : Lifetime of cached documents, in seconds. Defaults to "),t("code",[e._v("7 days (3600 * 24 * 7)")])]),e._v(" "),t("li",[t("strong",[e._v("unpaywall-throttle")]),e._v(" : Minimum time to wait between each query, in milliseconds. Defaults to "),t("code",[e._v("100")]),e._v("ms. Throttle time "),t("code",[e._v("doubles")]),e._v(" after each failed attempt.")]),e._v(" "),t("li",[t("strong",[e._v("unpaywall-paquet-size")]),e._v(" : Maximum number of DOIs to request in parallel. Defaults to "),t("code",[e._v("10")])]),e._v(" "),t("li",[t("strong",[e._v("unpaywall-buffer-size")]),e._v(" : Maximum number of memorised access events before sending requests. Defaults to "),t("code",[e._v("200")])]),e._v(" "),t("li",[t("strong",[e._v("unpaywall-max-tries")]),e._v(" : Maximum number of attempts if an enrichment fails. Defaults to "),t("code",[e._v("5")]),e._v(".")]),e._v(" "),t("li",[t("strong",[e._v("unpaywall-on-fail")]),e._v(" : Strategy to adopt if an enrichment reaches the maximum number of attempts. Can be either of "),t("code",[e._v("abort")]),e._v(", "),t("code",[e._v("ignore")]),e._v(" or "),t("code",[e._v("retry")]),e._v(". Defaults to "),t("code",[e._v("abort")]),e._v(".")]),e._v(" "),t("li",[t("strong",[e._v("unpaywall-email")]),e._v(" : The email to use for API calls. Defaults to "),t("code",[e._v("YOUR_EMAIL")]),e._v(".")])]),e._v(" "),t("h2",{attrs:{id:"enriched-fields"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#enriched-fields"}},[e._v("#")]),e._v(" Enriched fields")]),e._v(" "),t("table",[t("thead",[t("tr",[t("th",[e._v("Name")]),e._v(" "),t("th",[e._v("Type")]),e._v(" "),t("th",[e._v("Description")])])]),e._v(" "),t("tbody",[t("tr",[t("td",[e._v("is_oa")]),e._v(" "),t("td",[e._v("Boolean")]),e._v(" "),t("td",[e._v("Is there an OA copy of this resource.")])]),e._v(" "),t("tr",[t("td",[e._v("journal_is_in_doaj")]),e._v(" "),t("td",[e._v("Boolean")]),e._v(" "),t("td",[e._v("Is this resource published in a DOAJ-indexed journal.")])]),e._v(" "),t("tr",[t("td",[e._v("journal_is_oa")]),e._v(" "),t("td",[e._v("Boolean")]),e._v(" "),t("td",[e._v("Is this resource published in a completely OA journal.")])]),e._v(" "),t("tr",[t("td",[e._v("oa_status")]),e._v(" "),t("td",[e._v("String")]),e._v(" "),t("td",[e._v("The OA status, or color, of this resource.")])]),e._v(" "),t("tr",[t("td",[e._v("updated")]),e._v(" "),t("td",[e._v("String")]),e._v(" "),t("td",[e._v("Time when the data for this resource was last updated.")])])])]),e._v(" "),t("h3",{attrs:{id:"example"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#example"}},[e._v("#")]),e._v(" Example")]),e._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[t("span",{pre:!0,attrs:{class:"token function"}},[e._v("curl")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("-v")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("-X")]),e._v(" POST http://localhost:59599\n  "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("-H")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[e._v('"ezPAARSE-Middlewares: unpaywall"')]),e._v("\n  "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("-F")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[e._v('"files[]=@access.log"')]),e._v("\n")])])])])}),[],!1,null,null,null);t.default=r.exports}}]);