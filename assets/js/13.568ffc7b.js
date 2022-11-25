(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{458:function(t,a,s){"use strict";s.r(a);var e=s(35),r=Object(e.a)({},(function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"configuration-options"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#configuration-options"}},[t._v("#")]),t._v(" Configuration options")]),t._v(" "),s("p",[t._v("ezPAARSE comes with a "),s("code",[t._v("config.json")]),t._v(" file (located at the root of the application directory) that contains the default configuration. You can override it by creating a "),s("code",[t._v("config.local.json")]),t._v(" file with your own settings. Beware that "),s("strong",[t._v("modifying the "),s("code",[t._v("config.json")]),t._v(" file may prevent ezPAARSE from updating correctly.")])]),t._v(" "),s("h3",{attrs:{id:"ezpaarse-app-name"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-app-name"}},[t._v("#")]),t._v(" EZPAARSE_APP_NAME")]),t._v(" "),s("p",[t._v("ezPAARSE display name. As of now, this is only used in email subjects.")]),t._v(" "),s("h3",{attrs:{id:"ezpaarse-admin-mail"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-admin-mail"}},[t._v("#")]),t._v(" EZPAARSE_ADMIN_MAIL")]),t._v(" "),s("p",[t._v("The default value is set to "),s("code",[t._v("ezpaarse@couperin.org")])]),t._v(" "),s("h3",{attrs:{id:"ezpaarse-hostname"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-hostname"}},[t._v("#")]),t._v(" EZPAARSE_HOSTNAME")]),t._v(" "),s("p",[t._v("Domain name of the ezPAARSE instance.")]),t._v(" "),s("h3",{attrs:{id:"ezpaarse-parent-url"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-parent-url"}},[t._v("#")]),t._v(" EZPAARSE_PARENT_URL")]),t._v(" "),s("p",[t._v('To avoid the setup of a local SMTP server, you can delegate the management of user feedback (via the online form) to another ezPAARSE instance (called a "parent" instance).\nThe default value is set to '),s("code",[t._v("http://ezpaarse-preprod.couperin.org")])]),t._v(" "),s("h3",{attrs:{id:"ezpaarse-smtp-server"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-smtp-server"}},[t._v("#")]),t._v(" EZPAARSE_SMTP_SERVER")]),t._v(" "),s("p",[t._v("If you want to use a specific SMTP server to send emails, set the value to a JSON object that is compatible with "),s("a",{attrs:{href:"https://nodemailer.com/smtp/#general-options",target:"_blank",rel:"noopener noreferrer"}},[t._v("nodemailer options"),s("OutboundLink")],1),t._v(".")]),t._v(" "),s("h4",{attrs:{id:"example"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#example"}},[t._v("#")]),t._v(" Example")]),t._v(" "),s("div",{staticClass:"language-json extra-class"},[s("pre",{pre:!0,attrs:{class:"language-json"}},[s("code",[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"EZPAARSE_SMTP_SERVER"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"host"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"smtp.intra.org"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"port"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("25")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h3",{attrs:{id:"ezpaarse-feedback-recipients"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-feedback-recipients"}},[t._v("#")]),t._v(" EZPAARSE_FEEDBACK_RECIPIENTS")]),t._v(" "),s("p",[t._v("The mail adress where the users feedback get sent.\nThe default value is set to "),s("code",[t._v("ezpaarse@couperin.org")])]),t._v(" "),s("h3",{attrs:{id:"ezpaarse-subscription-mail"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-subscription-mail"}},[t._v("#")]),t._v(" EZPAARSE_SUBSCRIPTION_MAIL")]),t._v(" "),s("p",[t._v("If you wish to receive a message everytime a user opens an account on your instance, set the value to "),s("code",[t._v("true")]),t._v(".\nThe default value is set to "),s("code",[t._v("false")])]),t._v(" "),s("h3",{attrs:{id:"ezpaarse-mongo-url"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-mongo-url"}},[t._v("#")]),t._v(" EZPAARSE_MONGO_URL")]),t._v(" "),s("p",[t._v("The default value is set to "),s("code",[t._v("mongodb://localhost:27017/ezpaarse")])]),t._v(" "),s("h3",{attrs:{id:"ezpaarse-env"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-env"}},[t._v("#")]),t._v(" EZPAARSE_ENV")]),t._v(" "),s("p",[t._v("The default value is set to "),s("code",[t._v("production")])]),t._v(" "),s("h3",{attrs:{id:"ezpaarse-nodejs-port"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-nodejs-port"}},[t._v("#")]),t._v(" EZPAARSE_NODEJS_PORT")]),t._v(" "),s("p",[t._v("The default value is set to "),s("code",[t._v("59599")])]),t._v(" "),s("h3",{attrs:{id:"ezpaarse-nodejs-version"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-nodejs-version"}},[t._v("#")]),t._v(" EZPAARSE_NODEJS_VERSION")]),t._v(" "),s("p",[t._v("The default value is set to "),s("code",[t._v("14.17.6")])]),t._v(" "),s("h3",{attrs:{id:"default-locale"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#default-locale"}},[t._v("#")]),t._v(" DEFAULT_LOCALE")]),t._v(" "),s("p",[t._v("The default value is set to "),s("code",[t._v("fr")])]),t._v(" "),s("h3",{attrs:{id:"ezpaarse-output-fields"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-output-fields"}},[t._v("#")]),t._v(" EZPAARSE_OUTPUT_FIELDS")]),t._v(" "),s("p",[t._v("Contains an array of field names that are going to be present in the result file produced by ezPAARSE.\nThe default array contains the following fields:")]),t._v(" "),s("div",{staticClass:"language-json extra-class"},[s("pre",{pre:!0,attrs:{class:"language-json"}},[s("code",[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"datetime"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"date"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"login"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"platform"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"platform_name"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"publisher_name"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"rtype"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"mime"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"print_identifier"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"online_identifier"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"title_id"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"doi"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"publication_title"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"unitid"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"domain"')]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n")])])]),s("h3",{attrs:{id:"ezpaarse-demo"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-demo"}},[t._v("#")]),t._v(" EZPAARSE_DEMO")]),t._v(" "),s("p",[t._v("If "),s("code",[t._v("true")]),t._v(", it shows a warning informing users that the instance is a demo, and thus not adapted to process large log files. This warning now appears on our demo instance hosted on "),s("a",{attrs:{href:"http://ezpaarse.org",target:"_blank",rel:"noopener noreferrer"}},[t._v("http://ezpaarse.org"),s("OutboundLink")],1),t._v("\nThe default value is set to "),s("code",[t._v("false")]),t._v(".")]),t._v(" "),s("h3",{attrs:{id:"ezpaarse-default-headers"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-default-headers"}},[t._v("#")]),t._v(" EZPAARSE_DEFAULT_HEADERS")]),t._v(" "),s("p",[t._v("An object representing default headers to be used for each job. Can be overriden by predefined settings and actual job headers.")]),t._v(" "),s("h4",{attrs:{id:"example-2"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#example-2"}},[t._v("#")]),t._v(" Example")]),t._v(" "),s("div",{staticClass:"language-json extra-class"},[s("pre",{pre:!0,attrs:{class:"language-json"}},[s("code",[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"EZPAARSE_DEFAULT_HEADERS"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"Crypting-Salt"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"OU0qTpLOmC"')]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h3",{attrs:{id:"ezpaarse-middlewares"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-middlewares"}},[t._v("#")]),t._v(' EZPAARSE_MIDDLEWARES"')]),t._v(" "),s("p",[t._v("Contains an array of middleware names, in the order they are going to be launched by ezPAARSE during a process.\nThe default array contains the following middlewares:")]),t._v(" "),s("div",{staticClass:"language-json extra-class"},[s("pre",{pre:!0,attrs:{class:"language-json"}},[s("code",[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"filter"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"parser"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"deduplicator"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"enhancer"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"istex"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"crossref"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"sudoc"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"hal"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"geolocalizer"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"field-splitter"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"qualifier"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"cut"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"anonymizer"')]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n")])])]),s("h3",{attrs:{id:"ezpaarse-qualifying-level"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-qualifying-level"}},[t._v("#")]),t._v(" EZPAARSE_QUALIFYING_LEVEL")]),t._v(" "),s("p",[t._v("This sets the minimal value, under which ezPAARSE considers an EC is not qualified enough to be written to the results.\nThe default value is set to "),s("code",[t._v("1")])]),t._v(" "),s("h3",{attrs:{id:"ezpaarse-qualifying-factors"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-qualifying-factors"}},[t._v("#")]),t._v(" EZPAARSE_QUALIFYING_FACTORS")]),t._v(" "),s("div",{staticClass:"language-json extra-class"},[s("pre",{pre:!0,attrs:{class:"language-json"}},[s("code",[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"internal"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"rtype"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0.5")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"mime"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0.5")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"external"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"file"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"platforms/fields.json"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"sublist"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"rid"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"attribute"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"code"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"weight"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h3",{attrs:{id:"ezmesure-instances"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#ezmesure-instances"}},[t._v("#")]),t._v(" EZMESURE_INSTANCES")]),t._v(" "),s("p",[t._v("["),s("code",[t._v("v3.8.0")]),t._v(" and above]")]),t._v(" "),s("p",[t._v("The list of ezMESURE instances that can be used for uploading ezPAARSE results. Each instance should have an arbitrary "),s("code",[t._v("id")]),t._v(", a "),s("code",[t._v("label")]),t._v(" and a "),s("code",[t._v("baseUrl")]),t._v(". An optional "),s("code",[t._v("options")]),t._v(" object can be provided, which can be used to add "),s("code",[t._v("headers")]),t._v(" and "),s("code",[t._v("query parameters")]),t._v(" when uploading files, or disable certificates verification by setting "),s("code",[t._v("strictSSL")]),t._v(" to "),s("code",[t._v("false")]),t._v(".")]),t._v(" "),s("p",[t._v("Example:")]),t._v(" "),s("div",{staticClass:"language-json extra-class"},[s("pre",{pre:!0,attrs:{class:"language-json"}},[s("code",[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"id"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"prod"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"label"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"ezMESURE"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"baseUrl"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"https://ezmesure.couperin.org"')]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"id"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"integ"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"label"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"ezMESURE - Préproduction"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"baseUrl"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"https://ezmesure-preprod.couperin.org"')]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"id"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"dev"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"label"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"ezMESURE - Local developpement instance"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"baseUrl"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"https://localhost"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"options"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"headers"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"Split-Fields"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"ezproxy-groups(+)"')]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"qs"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"store"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("false")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"strictSSL"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("false")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n")])])]),s("h3",{attrs:{id:"ezpaarse-tmp-cycle"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-tmp-cycle"}},[t._v("#")]),t._v(" EZPAARSE_TMP_CYCLE")]),t._v(" "),s("p",[t._v("Determines how long ezPAARSE results remain accessible for downloading.\nThe default value is set to "),s("code",[t._v("60min")])]),t._v(" "),s("h3",{attrs:{id:"ezpaarse-tmp-lifetime"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-tmp-lifetime"}},[t._v("#")]),t._v(" EZPAARSE_TMP_LIFETIME")]),t._v(" "),s("p",[t._v("Sets the maximal duration for the storage of result files.\nThe default value is set to "),s("code",[t._v("1day")])]),t._v(" "),s("h3",{attrs:{id:"ezpaarse-ignored-domains"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-ignored-domains"}},[t._v("#")]),t._v(" EZPAARSE_IGNORED_DOMAINS")]),t._v(" "),s("p",[t._v("Contains an array of domains to be ignored (ie filtered out) by ezPAARSE.")]),t._v(" "),s("div",{staticClass:"language-json extra-class"},[s("pre",{pre:!0,attrs:{class:"language-json"}},[s("code",[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"www.google.fr"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"www.google.com"')]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n")])])]),s("p",[t._v("To avoid declaring too long a list, we advise you to declare unrelevant domains in dedicated exclusion files as documented in this "),s("a",{attrs:{href:"http://ezpaarse.readthedocs.io/en/master/features/exclusions.html#the-unrelevant-domains",target:"_blank",rel:"noopener noreferrer"}},[t._v("section"),s("OutboundLink")],1)]),t._v(" "),s("h3",{attrs:{id:"ezpaarse-geolocalize-default"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-geolocalize-default"}},[t._v("#")]),t._v(" EZPAARSE_GEOLOCALIZE_DEFAULT")]),t._v(" "),s("p",[t._v("The default value is set to "),s("code",[t._v("geoip-lookup")])]),t._v(" "),s("h3",{attrs:{id:"ezpaarse-geolocalize-separator"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-geolocalize-separator"}},[t._v("#")]),t._v(" EZPAARSE_GEOLOCALIZE_SEPARATOR")]),t._v(" "),s("p",[t._v("The default value is set to "),s("code",[t._v(".")]),t._v(" (dot)")]),t._v(" "),s("h3",{attrs:{id:"ezpaarse-alerts"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-alerts"}},[t._v("#")]),t._v(" EZPAARSE_ALERTS")]),t._v(" "),s("p",[t._v("Contains an object with 2 member properties, listed here:")]),t._v(" "),s("div",{staticClass:"language-json extra-class"},[s("pre",{pre:!0,attrs:{class:"language-json"}},[s("code",[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"activationThreshold"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1000")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"unknownDomainsRate"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("10")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("The properties and their values are documented in further details in the "),s("a",{attrs:{href:"http://ezpaarse.readthedocs.io/en/master/features/alerts.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("relevant section"),s("OutboundLink")],1)])])}),[],!1,null,null,null);a.default=r.exports}}]);