(window.webpackJsonp=window.webpackJsonp||[]).push([[39],{333:function(a,t,s){a.exports=s.p+"assets/img/admin-interface.463d683f.png"},334:function(a,t,s){a.exports=s.p+"assets/img/process-interface.a6002876.png"},425:function(a,t,s){"use strict";s.r(t);var e=s(10),r=Object(e.a)({},(function(){var a=this,t=a._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[t("h1",{attrs:{id:"labelize"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#labelize"}},[a._v("#")]),a._v(" labelize")]),a._v(" "),t("p",[a._v("This middleware allows you to add a field to based on the content of another field.")]),a._v(" "),t("h2",{attrs:{id:"prerequisites"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#prerequisites"}},[a._v("#")]),a._v(" Prerequisites")]),a._v(" "),t("p",[t("strong",[a._v("You must use labelize after filter, parser, deduplicator middleware.")])]),a._v(" "),t("h2",{attrs:{id:"how-to-use"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#how-to-use"}},[a._v("#")]),a._v(" How to use")]),a._v(" "),t("h3",{attrs:{id:"ezpaarse-config"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-config"}},[a._v("#")]),a._v(" ezPAARSE config")]),a._v(" "),t("p",[a._v("You can add or remove your labelize on ezpaarse config. It will be used on every process that used labelize middleware. You need to add this code on your "),t("code",[a._v("config.local.json")]),a._v(".")]),a._v(" "),t("div",{staticClass:"language-json extra-class"},[t("pre",{pre:!0,attrs:{class:"language-json"}},[t("code",[t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[a._v('"EZPAARSE_LABELIZE"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("[")]),a._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n      "),t("span",{pre:!0,attrs:{class:"token property"}},[a._v('"from"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[a._v('"domain"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n      "),t("span",{pre:!0,attrs:{class:"token property"}},[a._v('"resultField"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[a._v('"organization"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n      "),t("span",{pre:!0,attrs:{class:"token property"}},[a._v('"mapping"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n        "),t("span",{pre:!0,attrs:{class:"token property"}},[a._v('"psl.fr"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[a._v('"PSL"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n        "),t("span",{pre:!0,attrs:{class:"token property"}},[a._v('"paristech.com"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[a._v('"ParisTech"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n        "),t("span",{pre:!0,attrs:{class:"token property"}},[a._v('"dauphine.org"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[a._v('"Dauphine"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n        "),t("span",{pre:!0,attrs:{class:"token property"}},[a._v('"paris-dauphine.org"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[a._v('"Dauphine"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n      "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n      "),t("span",{pre:!0,attrs:{class:"token property"}},[a._v('"from"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[a._v('"code"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n      "),t("span",{pre:!0,attrs:{class:"token property"}},[a._v('"resultField"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[a._v('"status"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n      "),t("span",{pre:!0,attrs:{class:"token property"}},[a._v('"mapping"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n        "),t("span",{pre:!0,attrs:{class:"token property"}},[a._v('"200"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token boolean"}},[a._v("true")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n        "),t("span",{pre:!0,attrs:{class:"token property"}},[a._v('"202"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token boolean"}},[a._v("true")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n        "),t("span",{pre:!0,attrs:{class:"token property"}},[a._v('"400"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token boolean"}},[a._v("false")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n        "),t("span",{pre:!0,attrs:{class:"token property"}},[a._v('"404"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token boolean"}},[a._v("false")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n      "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n  "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("]")]),a._v("\n  \n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n")])])]),t("h3",{attrs:{id:"ezpaarse-admin-interface"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-admin-interface"}},[a._v("#")]),a._v(" ezPAARSE admin interface")]),a._v(" "),t("p",[a._v("You can add or remove labelize by default to all your enrichments, provided you have added parameters in the config. To do this, go to the middleware section of administration.")]),a._v(" "),t("p",[t("img",{attrs:{src:s(333),alt:"image"}})]),a._v(" "),t("h3",{attrs:{id:"ezpaarse-process-interface"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-process-interface"}},[a._v("#")]),a._v(" ezPAARSE process interface")]),a._v(" "),t("p",[a._v("You can use labelize for an enrichment process.")]),a._v(" "),t("p",[t("img",{attrs:{src:s(334),alt:"image"}})]),a._v(" "),t("h3",{attrs:{id:"ezp"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#ezp"}},[a._v("#")]),a._v(" ezp")]),a._v(" "),t("p",[a._v("You can use labelize for an enrichment process with "),t("a",{attrs:{href:"https://github.com/ezpaarse-project/node-ezpaarse",target:"_blank",rel:"noopener noreferrer"}},[a._v("ezp"),t("OutboundLink")],1),a._v(" like this:")]),a._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[a._v("# enrich with one file")]),a._v("\nezp process "),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v("<")]),a._v("path of your file"),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(">")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("\\")]),a._v("\n  "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("--host")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v("<")]),a._v("host of your ezPAARSE instance"),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(">")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("\\")]),a._v("\n  "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("--settings")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v("<")]),a._v("settings-id"),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(">")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("\\")]),a._v("\n  "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("--header")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[a._v('"ezPAARSE-Middlewares: labelize"')]),a._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("\\")]),a._v("\n  "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("--out")]),a._v(" ./result.csv\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[a._v("# enrich with multiples files")]),a._v("\nezp bulk "),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v("<")]),a._v("path of your directory"),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(">")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("\\")]),a._v("\n  "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("--host")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v("<")]),a._v("host of your ezPAARSE instance"),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(">")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("\\")]),a._v("\n  "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("--settings")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v("<")]),a._v("settings-id"),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(">")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("\\")]),a._v("\n  "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("--header")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[a._v('"ezPAARSE-Middlewares: labelize"')]),a._v(" \n\n")])])]),t("h3",{attrs:{id:"curl"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#curl"}},[a._v("#")]),a._v(" curl")]),a._v(" "),t("p",[a._v("You can use labelize for an enrichment process with curl like this:")]),a._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[t("span",{pre:!0,attrs:{class:"token function"}},[a._v("curl")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("-X")]),a._v(" POST "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("-v")]),a._v(" http://localhost:59599 "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("\\")]),a._v("\n  "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("-H")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[a._v('"ezPAARSE-Middlewares: labelize"')]),a._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("\\")]),a._v("\n  "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("-H")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[a._v('"Log-Format-Ezproxy: <line format>"')]),a._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("\\")]),a._v("\n  "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("-F")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[a._v('"file=@<log file path>"')]),a._v("\n\n")])])])])}),[],!1,null,null,null);t.default=r.exports}}]);