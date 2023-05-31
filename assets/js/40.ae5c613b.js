(window.webpackJsonp=window.webpackJsonp||[]).push([[40],{484:function(a,e,s){"use strict";s.r(e);var t=s(35),n=Object(t.a)({},(function(){var a=this,e=a.$createElement,s=a._self._c||e;return s("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[s("h1",{attrs:{id:"installation"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#installation"}},[a._v("#")]),a._v(" Installation")]),a._v(" "),s("p",[a._v("Make sure you fulfilled the "),s("RouterLink",{attrs:{to:"/start/requirements.html"}},[a._v("requirements")]),a._v(" before going any further.")],1),a._v(" "),s("p",[a._v("For an ezPAARSE installation on a "),s("strong",[a._v("Windows")]),a._v(" OS, you will have to use a dockerized container, please see "),s("RouterLink",{attrs:{to:"/start/install.html#docker-and-compose"}},[a._v("below")]),a._v(".")],1),a._v(" "),s("h3",{attrs:{id:"stable-version"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#stable-version"}},[a._v("#")]),a._v(" Stable version")]),a._v(" "),s("p",[a._v("To install the last stable version on a Unix system, open a console and enter:")]),a._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[a._v("git")]),a._v(" clone https://github.com/ezpaarse-project/ezpaarse.git\n"),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[a._v("cd")]),a._v(" ezpaarse\n"),s("span",{pre:!0,attrs:{class:"token function"}},[a._v("git")]),a._v(" checkout "),s("span",{pre:!0,attrs:{class:"token variable"}},[s("span",{pre:!0,attrs:{class:"token variable"}},[a._v("`")]),s("span",{pre:!0,attrs:{class:"token function"}},[a._v("git")]),a._v(" describe --tags --abbrev"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("=")]),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("0")]),s("span",{pre:!0,attrs:{class:"token variable"}},[a._v("`")])]),a._v("\n"),s("span",{pre:!0,attrs:{class:"token function"}},[a._v("make")]),a._v("\n")])])]),s("h4",{attrs:{id:"video-demonstration"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#video-demonstration"}},[a._v("#")]),a._v(" Video Demonstration")]),a._v(" "),s("p",[a._v("This "),s("a",{attrs:{href:"https://www.youtube.com/watch?v=W77vPsgC1A8",target:"_blank",rel:"noopener noreferrer"}},[a._v("screencast"),s("OutboundLink")],1),a._v(" demonstrates the previous instructions.")]),a._v(" "),s("h3",{attrs:{id:"development-version"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#development-version"}},[a._v("#")]),a._v(" Development version")]),a._v(" "),s("p",[a._v("If you wish to install the development version, open a console and enter:")]),a._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[a._v("git")]),a._v(" clone https://github.com/ezpaarse-project/ezpaarse.git\n"),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[a._v("cd")]),a._v(" ezpaarse\n"),s("span",{pre:!0,attrs:{class:"token function"}},[a._v("make")]),a._v("\n")])])]),s("h3",{attrs:{id:"docker-and-compose"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#docker-and-compose"}},[a._v("#")]),a._v(" Docker and Compose")]),a._v(" "),s("p",[a._v("ezPAARSE is available as a "),s("a",{attrs:{href:"https://registry.hub.docker.com/r/ezpaarseproject/ezpaarse",target:"_blank",rel:"noopener noreferrer"}},[a._v("docker image"),s("OutboundLink")],1),a._v(".")]),a._v(" "),s("p",[a._v("To run it with docker, you will need to install "),s("a",{attrs:{href:"https://docs.docker.com/engine/install/",target:"_blank",rel:"noopener noreferrer"}},[a._v("Docker"),s("OutboundLink")],1),a._v(" and "),s("a",{attrs:{href:"https://docs.docker.com/compose/install/",target:"_blank",rel:"noopener noreferrer"}},[a._v("Docker-Compose"),s("OutboundLink")],1),a._v(".")]),a._v(" "),s("p",[a._v("Then, you can either grab the 'docker-compose.yml' file alone and start the containers:")]),a._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[a._v("mkdir")]),a._v(" ezpaarse/\n"),s("span",{pre:!0,attrs:{class:"token function"}},[a._v("wget")]),a._v(" https://raw.githubusercontent.com/ezpaarse-project/ezpaarse/master/docker-compose.yml\n"),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[a._v("test")]),a._v(" -f config.local.json "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("||")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[a._v("echo")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[a._v("'{}'")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v(">")]),a._v(" config.local.json\n"),s("span",{pre:!0,attrs:{class:"token function"}},[a._v("docker-compose")]),a._v(" pull\n"),s("span",{pre:!0,attrs:{class:"token function"}},[a._v("docker-compose")]),a._v(" up -d\n")])])]),s("p",[a._v("or simply start the containers from your local github cloned repository:")]),a._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[a._v("git")]),a._v(" clone https://github.com/ezpaarse-project/ezpaarse.git\n"),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[a._v("cd")]),a._v(" ezpaarse\n"),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[a._v("test")]),a._v(" -f config.local.json "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("||")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[a._v("echo")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[a._v("'{}'")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v(">")]),a._v(" config.local.json\n"),s("span",{pre:!0,attrs:{class:"token function"}},[a._v("docker-compose")]),a._v(" pull\n"),s("span",{pre:!0,attrs:{class:"token function"}},[a._v("docker-compose")]),a._v(" up -d\n")])])]),s("h3",{attrs:{id:"uninstall-ezpaarse"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#uninstall-ezpaarse"}},[a._v("#")]),a._v(" Uninstall ezPAARSE")]),a._v(" "),s("p",[a._v("Remove the ezpaarse folder:")]),a._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[a._v("rm")]),a._v(" -rf ezpaarse\n")])])]),s("p",[a._v("Delete the database:")]),a._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[a._v("mongo ezpaarse\ndb.dropDatabase"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v("\n")])])]),s("p",[a._v("If using the docker version, delete the Docker containers:")]),a._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[a._v("docker")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[a._v("rm")]),a._v(" -f ezpaarse ezpaarse_db\n")])])])])}),[],!1,null,null,null);e.default=n.exports}}]);