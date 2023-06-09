(window.webpackJsonp=window.webpackJsonp||[]).push([[64],{352:function(a,t,s){"use strict";s.r(t);var e=s(10),n=Object(e.a)({},(function(){var a=this,t=a._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[t("h1",{attrs:{id:"on-campus-counter"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#on-campus-counter"}},[a._v("#")]),a._v(" on-campus-counter")]),a._v(" "),t("p",[a._v("This middleware adds an "),t("code",[a._v("on_campus")]),a._v(" field containing "),t("code",[a._v("Y")]),a._v(" or "),t("code",[a._v("N")]),a._v(" depending on the IP contained in the "),t("code",[a._v("host")]),a._v(" field. It also increments two counters in the report : "),t("code",[a._v("on-campus-accesses")]),a._v(" and "),t("code",[a._v("off-campus-accesses")]),a._v(".")]),a._v(" "),t("p",[a._v("By default, only "),t("a",{attrs:{href:"https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces",target:"_blank",rel:"noopener noreferrer"}},[a._v("private IPv4 addresses"),t("OutboundLink")],1),a._v(" are considered on-campus. More ranges can be added by providing an "),t("code",[a._v("onCampusCounter")]),a._v(" key in the ezPAARSE configuration ("),t("code",[a._v("config.local.json")]),a._v(").")]),a._v(" "),t("p",[t("code",[a._v("onCampusCounter")]),a._v(" should be an array, where each element is either a valid range string, or an object with a string property "),t("code",[a._v("label")]),a._v(" and an array property "),t("code",[a._v("ranges")]),a._v(" containing valid range strings. Ranges also accept single IPv4 addresses.")]),a._v(" "),t("p",[a._v("When a range is associated with a label, "),t("code",[a._v("on_campus")]),a._v(" will contain the label instead of "),t("code",[a._v("Y")]),a._v(".")]),a._v(" "),t("h2",{attrs:{id:"example"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#example"}},[a._v("#")]),a._v(" Example")]),a._v(" "),t("div",{staticClass:"language-json extra-class"},[t("pre",{pre:!0,attrs:{class:"language-json"}},[t("code",[t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[a._v('"onCampusCounter"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("[")]),a._v("\n    "),t("span",{pre:!0,attrs:{class:"token string"}},[a._v('"115.0.0.0/8"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n      "),t("span",{pre:!0,attrs:{class:"token property"}},[a._v('"label"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[a._v('"Campus name"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n      "),t("span",{pre:!0,attrs:{class:"token property"}},[a._v('"ranges"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("[")]),t("span",{pre:!0,attrs:{class:"token string"}},[a._v('"93.25.0.0/16"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[a._v('"118.0.0.0/8"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[a._v('"83.112.9.15"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("]")]),a._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n  "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("]")]),a._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n")])])])])}),[],!1,null,null,null);t.default=n.exports}}]);