(window.webpackJsonp=window.webpackJsonp||[]).push([[40],{328:function(a,e,t){"use strict";t.r(e);var s=t(10),r=Object(s.a)({},(function(){var a=this,e=a._self._c;return e("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[e("h1",{attrs:{id:"installation"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#installation"}},[a._v("#")]),a._v(" Installation")]),a._v(" "),e("p",[a._v("Make sure you fulfilled the "),e("RouterLink",{attrs:{to:"/start/requirements.html"}},[a._v("requirements")]),a._v(" before going any further.")],1),a._v(" "),e("p",[a._v("For an ezPAARSE installation on a "),e("strong",[a._v("Windows")]),a._v(" OS, you will have to use a dockerized container. Please see "),e("RouterLink",{attrs:{to:"/start/install.html#docker-and-compose"}},[a._v("below")]),a._v(".")],1),a._v(" "),e("h2",{attrs:{id:"without-docker"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#without-docker"}},[a._v("#")]),a._v(" Without Docker")]),a._v(" "),e("h3",{attrs:{id:"stable-version"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#stable-version"}},[a._v("#")]),a._v(" Stable version")]),a._v(" "),e("p",[a._v("To install the last stable version on a Unix system, open a console and enter:")]),a._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[e("span",{pre:!0,attrs:{class:"token function"}},[a._v("git")]),a._v(" clone https://github.com/ezpaarse-project/ezpaarse.git\n"),e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[a._v("cd")]),a._v(" ezpaarse\n"),e("span",{pre:!0,attrs:{class:"token function"}},[a._v("git")]),a._v(" checkout "),e("span",{pre:!0,attrs:{class:"token variable"}},[e("span",{pre:!0,attrs:{class:"token variable"}},[a._v("`")]),e("span",{pre:!0,attrs:{class:"token function"}},[a._v("git")]),a._v(" describe "),e("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("--tags")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("--abbrev")]),e("span",{pre:!0,attrs:{class:"token operator"}},[a._v("=")]),e("span",{pre:!0,attrs:{class:"token number"}},[a._v("0")]),e("span",{pre:!0,attrs:{class:"token variable"}},[a._v("`")])]),a._v("\n"),e("span",{pre:!0,attrs:{class:"token function"}},[a._v("make")]),a._v("\n")])])]),e("h4",{attrs:{id:"video-demonstration"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#video-demonstration"}},[a._v("#")]),a._v(" Video Demonstration")]),a._v(" "),e("p",[a._v("This "),e("a",{attrs:{href:"https://www.youtube.com/watch?v=W77vPsgC1A8",target:"_blank",rel:"noopener noreferrer"}},[a._v("screencast"),e("OutboundLink")],1),a._v(" demonstrates the previous instructions.")]),a._v(" "),e("h3",{attrs:{id:"development-version"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#development-version"}},[a._v("#")]),a._v(" Development version")]),a._v(" "),e("p",[a._v("If you wish to install the development version, open a console and enter:")]),a._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[e("span",{pre:!0,attrs:{class:"token function"}},[a._v("git")]),a._v(" clone https://github.com/ezpaarse-project/ezpaarse.git\n"),e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[a._v("cd")]),a._v(" ezpaarse\n"),e("span",{pre:!0,attrs:{class:"token function"}},[a._v("make")]),a._v("\n")])])]),e("h2",{attrs:{id:"with-docker-and-compose"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#with-docker-and-compose"}},[a._v("#")]),a._v(" With Docker and Compose")]),a._v(" "),e("p",[a._v("ezPAARSE is available as a "),e("a",{attrs:{href:"https://registry.hub.docker.com/r/ezpaarseproject/ezpaarse",target:"_blank",rel:"noopener noreferrer"}},[a._v("docker image"),e("OutboundLink")],1),a._v(".")]),a._v(" "),e("p",[a._v("To run it with docker, you will need to install "),e("a",{attrs:{href:"https://docs.docker.com/engine/install/",target:"_blank",rel:"noopener noreferrer"}},[a._v("Docker"),e("OutboundLink")],1),a._v(" and "),e("a",{attrs:{href:"https://docs.docker.com/compose/install/",target:"_blank",rel:"noopener noreferrer"}},[a._v("Docker-Compose"),e("OutboundLink")],1),a._v(".")]),a._v(" "),e("p",[a._v("Then, you can either grab the "),e("code",[a._v("docker-compose.yml")]),a._v(" file alone:")]),a._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[e("span",{pre:!0,attrs:{class:"token function"}},[a._v("mkdir")]),a._v(" ezpaarse/\n"),e("span",{pre:!0,attrs:{class:"token function"}},[a._v("wget")]),a._v(" https://raw.githubusercontent.com/ezpaarse-project/ezpaarse/master/docker-compose.yml\n"),e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[a._v("test")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("-f")]),a._v(" config.local.json "),e("span",{pre:!0,attrs:{class:"token operator"}},[a._v("||")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[a._v("echo")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[a._v("'{}'")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token operator"}},[a._v(">")]),a._v(" config.local.json\n")])])]),e("p",[a._v("or clone the github repository:")]),a._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[e("span",{pre:!0,attrs:{class:"token function"}},[a._v("git")]),a._v(" clone https://github.com/ezpaarse-project/ezpaarse.git\n"),e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[a._v("cd")]),a._v(" ezpaarse\n"),e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[a._v("test")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("-f")]),a._v(" config.local.json "),e("span",{pre:!0,attrs:{class:"token operator"}},[a._v("||")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[a._v("echo")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[a._v("'{}'")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token operator"}},[a._v(">")]),a._v(" config.local.json\n")])])])])}),[],!1,null,null,null);e.default=r.exports}}]);