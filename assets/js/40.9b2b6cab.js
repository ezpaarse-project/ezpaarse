(window.webpackJsonp=window.webpackJsonp||[]).push([[40],{484:function(e,t,a){"use strict";a.r(t);var s=a(35),r=Object(s.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h1",{attrs:{id:"installation"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#installation"}},[e._v("#")]),e._v(" Installation")]),e._v(" "),a("p",[e._v("Make sure you fulfilled the "),a("RouterLink",{attrs:{to:"/start/requirements.html"}},[e._v("requirements")]),e._v(" before going any further.")],1),e._v(" "),a("p",[e._v("For an ezPAARSE installation on a "),a("strong",[e._v("Windows")]),e._v(" OS, you will have to use a dockerized container. Please see "),a("RouterLink",{attrs:{to:"/start/install.html#docker-and-compose"}},[e._v("below")]),e._v(".")],1),e._v(" "),a("h2",{attrs:{id:"without-docker"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#without-docker"}},[e._v("#")]),e._v(" Without Docker")]),e._v(" "),a("h3",{attrs:{id:"stable-version"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#stable-version"}},[e._v("#")]),e._v(" Stable version")]),e._v(" "),a("p",[e._v("To install the last stable version on a Unix system, open a console and enter:")]),e._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[e._v("git")]),e._v(" clone https://github.com/ezpaarse-project/ezpaarse.git\n"),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v("cd")]),e._v(" ezpaarse\n"),a("span",{pre:!0,attrs:{class:"token function"}},[e._v("git")]),e._v(" checkout "),a("span",{pre:!0,attrs:{class:"token variable"}},[a("span",{pre:!0,attrs:{class:"token variable"}},[e._v("`")]),a("span",{pre:!0,attrs:{class:"token function"}},[e._v("git")]),e._v(" describe --tags --abbrev"),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[e._v("0")]),a("span",{pre:!0,attrs:{class:"token variable"}},[e._v("`")])]),e._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[e._v("make")]),e._v("\n")])])]),a("h4",{attrs:{id:"video-demonstration"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#video-demonstration"}},[e._v("#")]),e._v(" Video Demonstration")]),e._v(" "),a("p",[e._v("This "),a("a",{attrs:{href:"https://www.youtube.com/watch?v=W77vPsgC1A8",target:"_blank",rel:"noopener noreferrer"}},[e._v("screencast"),a("OutboundLink")],1),e._v(" demonstrates the previous instructions.")]),e._v(" "),a("h3",{attrs:{id:"development-version"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#development-version"}},[e._v("#")]),e._v(" Development version")]),e._v(" "),a("p",[e._v("If you wish to install the development version, open a console and enter:")]),e._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[e._v("git")]),e._v(" clone https://github.com/ezpaarse-project/ezpaarse.git\n"),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v("cd")]),e._v(" ezpaarse\n"),a("span",{pre:!0,attrs:{class:"token function"}},[e._v("make")]),e._v("\n")])])]),a("h2",{attrs:{id:"with-docker-and-compose"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#with-docker-and-compose"}},[e._v("#")]),e._v(" With Docker and Compose")]),e._v(" "),a("p",[e._v("ezPAARSE is available as a "),a("a",{attrs:{href:"https://registry.hub.docker.com/r/ezpaarseproject/ezpaarse",target:"_blank",rel:"noopener noreferrer"}},[e._v("docker image"),a("OutboundLink")],1),e._v(".")]),e._v(" "),a("p",[e._v("To run it with docker, you will need to install "),a("a",{attrs:{href:"https://docs.docker.com/engine/install/",target:"_blank",rel:"noopener noreferrer"}},[e._v("Docker"),a("OutboundLink")],1),e._v(" and "),a("a",{attrs:{href:"https://docs.docker.com/compose/install/",target:"_blank",rel:"noopener noreferrer"}},[e._v("Docker-Compose"),a("OutboundLink")],1),e._v(".")]),e._v(" "),a("p",[e._v("Then, you can either grab the "),a("code",[e._v("docker-compose.yml")]),e._v(" file alone:")]),e._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[e._v("mkdir")]),e._v(" ezpaarse/\n"),a("span",{pre:!0,attrs:{class:"token function"}},[e._v("wget")]),e._v(" https://raw.githubusercontent.com/ezpaarse-project/ezpaarse/master/docker-compose.yml\n"),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v("test")]),e._v(" -f config.local.json "),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v("||")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v("echo")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[e._v("'{}'")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v(" config.local.json\n")])])]),a("p",[e._v("or clone the github repository:")]),e._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[e._v("git")]),e._v(" clone https://github.com/ezpaarse-project/ezpaarse.git\n"),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v("cd")]),e._v(" ezpaarse\n"),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v("test")]),e._v(" -f config.local.json "),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v("||")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v("echo")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[e._v("'{}'")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v(" config.local.json\n")])])])])}),[],!1,null,null,null);t.default=r.exports}}]);