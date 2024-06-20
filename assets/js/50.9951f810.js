(window.webpackJsonp=window.webpackJsonp||[]).push([[50],{354:function(t,a,e){t.exports=e.p+"assets/img/admin-interface.6a4cb37d.png"},355:function(t,a,e){t.exports=e.p+"assets/img/process-interface.efa05127.png"},436:function(t,a,e){"use strict";e.r(a);var s=e(10),r=Object(s.a)({},(function(){var t=this,a=t._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"throttler"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#throttler"}},[t._v("#")]),t._v(" throttler")]),t._v(" "),a("p",[t._v("Regulates the consultation events' stream by artificially adding time between each treatment")]),t._v(" "),a("h2",{attrs:{id:"headers"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#headers"}},[t._v("#")]),t._v(" Headers")]),t._v(" "),a("ul",[a("li",[a("strong",[t._v("Throttling")]),t._v(" : Minimum time to wait between queries in milliseconds. Defaults to "),a("code",[t._v("0")]),t._v("ms.")])]),t._v(" "),a("h2",{attrs:{id:"how-to-use"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#how-to-use"}},[t._v("#")]),t._v(" How to use")]),t._v(" "),a("h3",{attrs:{id:"ezpaarse-config"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-config"}},[t._v("#")]),t._v(" ezPAARSE config")]),t._v(" "),a("p",[t._v("You can add or remove your throttler on ezpaarse config. It will be used on every process that used throttler middleware. You need to add this code on your "),a("code",[t._v("config.local.json")]),t._v(".")]),t._v(" "),a("div",{staticClass:"language-json extra-class"},[a("pre",{pre:!0,attrs:{class:"language-json"}},[a("code",[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"EZPAARSE_DEFAULT_HEADERS"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"Throttling"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"<time to wait between queries in milliseconds>"')]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("h3",{attrs:{id:"ezpaarse-admin-interface"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-admin-interface"}},[t._v("#")]),t._v(" ezPAARSE admin interface")]),t._v(" "),a("p",[t._v("You can add or remove throttler by default to all your enrichments. To do this, go to the middleware section of administration.")]),t._v(" "),a("p",[a("img",{attrs:{src:e(354),alt:"image"}})]),t._v(" "),a("h3",{attrs:{id:"ezpaarse-process-interface"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-process-interface"}},[t._v("#")]),t._v(" ezPAARSE process interface")]),t._v(" "),a("p",[t._v("You can use throttler for an enrichment process.")]),t._v(" "),a("p",[a("img",{attrs:{src:e(355),alt:"image"}})]),t._v(" "),a("h3",{attrs:{id:"ezp"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#ezp"}},[t._v("#")]),t._v(" ezp")]),t._v(" "),a("p",[t._v("You can use throttler for an enrichment process with "),a("a",{attrs:{href:"https://github.com/ezpaarse-project/node-ezpaarse",target:"_blank",rel:"noopener noreferrer"}},[t._v("ezp"),a("OutboundLink")],1),t._v(" like this:")]),t._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# enrich with one file")]),t._v("\nezp process "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("path of your file"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("--host")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("host of your ezPAARSE instance"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("--settings")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("settings-id"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("--header")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"ezPAARSE-Middlewares: throttler"')]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("--header")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"throttler: <time in miniseconds>"')]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("--out")]),t._v(" ./result.csv\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# enrich with multiples files")]),t._v("\nezp bulk "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("path of your directory"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("--host")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("host of your ezPAARSE instance"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("--settings")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("settings-id"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("--header")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"ezPAARSE-Middlewares: throttler"')]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("--header")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"throttler: <time in miniseconds>"')]),t._v("\n\n")])])]),a("h3",{attrs:{id:"curl"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#curl"}},[t._v("#")]),t._v(" curl")]),t._v(" "),a("p",[t._v("You can use throttler for an enrichment process with curl like this:")]),t._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("curl")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("-X")]),t._v(" POST "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("-v")]),t._v(" http://localhost:59599 "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("-H")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"ezPAARSE-Middlewares: throttler"')]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("-H")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"throttler: <time in miniseconds>"')]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("-H")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Log-Format-Ezproxy: <line format>"')]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("-F")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"file=@<log file path>"')]),t._v("\n\n")])])])])}),[],!1,null,null,null);a.default=r.exports}}]);