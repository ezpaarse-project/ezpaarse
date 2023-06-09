(window.webpackJsonp=window.webpackJsonp||[]).push([[41],{329:function(t,a,s){"use strict";s.r(a);var e=s(10),n=Object(e.a)({},(function(){var t=this,a=t._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"requirements"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#requirements"}},[t._v("#")]),t._v(" Requirements")]),t._v(" "),a("p",[t._v("ezPAARSE can be installed on many Linux distributions, with the following prerequisites :")]),t._v(" "),a("ul",[a("li",[t._v("Unix standard tools: "),a("strong",[t._v("bash")]),t._v(", "),a("strong",[t._v("make")]),t._v(", "),a("strong",[t._v("grep")]),t._v(", "),a("strong",[t._v("sed")]),t._v(", etc.")]),t._v(" "),a("li",[a("strong",[t._v("python")])]),t._v(" "),a("li",[a("strong",[t._v("gcc")]),t._v(" and "),a("strong",[t._v("g++")])]),t._v(" "),a("li",[a("strong",[t._v("curl")]),t._v(" (used by "),a("strong",[t._v("nvm")]),t._v(")")]),t._v(" "),a("li",[a("strong",[t._v("git")]),t._v(" >= 1.7.10 (needed by github)")]),t._v(" "),a("li",[a("strong",[t._v("MongoDB")]),t._v(" >= 3.2")])]),t._v(" "),a("p",[t._v("If using the docker version of ezpaarse you will only need:")]),t._v(" "),a("ul",[a("li",[a("a",{attrs:{href:"https://docs.docker.com/engine/install/",target:"_blank",rel:"noopener noreferrer"}},[t._v("Docker"),a("OutboundLink")],1),t._v(" (Version >= 1.12)")]),t._v(" "),a("li",[a("a",{attrs:{href:"https://docs.docker.com/compose/install/",target:"_blank",rel:"noopener noreferrer"}},[t._v("Docker Compose"),a("OutboundLink")],1),t._v(" (Version >= 1.7)")])]),t._v(" "),a("h2",{attrs:{id:"libraries"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#libraries"}},[t._v("#")]),t._v(" Libraries")]),t._v(" "),a("h3",{attrs:{id:"ubuntu"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#ubuntu"}},[t._v("#")]),t._v(" Ubuntu")]),t._v(" "),a("p",[t._v("Starting from a "),a("a",{attrs:{href:"http://www.ubuntu.com/download",target:"_blank",rel:"noopener noreferrer"}},[t._v("ubuntu image"),a("OutboundLink")],1),t._v(" loaded in a virtual machine, with root privileges or via sudo.")]),t._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("apt-get")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("install")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("git")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("make")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("curl")]),t._v(" python gcc build-essential\n")])])]),a("h3",{attrs:{id:"fedora"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#fedora"}},[t._v("#")]),t._v(" Fedora")]),t._v(" "),a("p",[t._v("Starting from a "),a("a",{attrs:{href:"http://fedoraproject.org/get-fedora",target:"_blank",rel:"noopener noreferrer"}},[t._v("fedora image"),a("OutboundLink")],1),t._v(" loaded in a virtual machine, with root privileges or via sudo.")]),t._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[t._v("yum "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("install")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("tar")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("git")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("make")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("curl")]),t._v(" python gcc-c++\n")])])]),a("h3",{attrs:{id:"suse"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#suse"}},[t._v("#")]),t._v(" SUSE")]),t._v(" "),a("p",[t._v("(to be verified)")]),t._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("zypper")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("install")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("git")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("make")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("curl")]),t._v(" python gcc-c++\n")])])]),a("h3",{attrs:{id:"mac-os-x"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#mac-os-x"}},[t._v("#")]),t._v(" Mac OS X")]),t._v(" "),a("p",[t._v("On your Mac, install "),a("strong",[t._v("Xcode")]),t._v(" and "),a("strong",[t._v("git")])]),t._v(" "),a("h3",{attrs:{id:"windows"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#windows"}},[t._v("#")]),t._v(" Windows")]),t._v(" "),a("p",[a("strong",[t._v("Windows")]),t._v(" support has been "),a("strong",[t._v("discontinued")]),t._v(", however you can use a virtual machine or a "),a("RouterLink",{attrs:{to:"/start/install.html#docker-and-compose"}},[t._v("Docker container")]),t._v(" to run ezPAARSE in a linux environment.")],1),t._v(" "),a("h2",{attrs:{id:"mongodb"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#mongodb"}},[t._v("#")]),t._v(" MongoDB")]),t._v(" "),a("p",[t._v("We only document the procedure for Debian and Ubuntu based systems (see below).\nThe installation instructions for other OSes are available in the "),a("a",{attrs:{href:"http://docs.mongodb.org/manual/installation/#tutorial-installation",target:"_blank",rel:"noopener noreferrer"}},[t._v("official MongoDB documentation"),a("OutboundLink")],1),t._v(".")]),t._v(" "),a("h3",{attrs:{id:"ubuntu-14-04-or-newer"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#ubuntu-14-04-or-newer"}},[t._v("#")]),t._v(" Ubuntu 14.04 or newer")]),t._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("sudo")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("apt-get")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("install")]),t._v(" mongodb\n")])])]),a("h3",{attrs:{id:"ubuntu-9-10-or-older"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#ubuntu-9-10-or-older"}},[t._v("#")]),t._v(" Ubuntu 9.10 or older")]),t._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("sudo")]),t._v(" apt-key adv "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("--keyserver")]),t._v(" hkp://keyserver.ubuntu.com:80 "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("--recv")]),t._v(" 7F0CEB10\n"),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v("echo")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen'")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("sudo")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("tee")]),t._v(" /etc/apt/sources.list.d/mongodb.list\n"),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("sudo")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("apt-get")]),t._v(" update\n"),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("sudo")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("apt-get")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("install")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("-y")]),t._v(" mongodb-org\n"),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("sudo")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("service")]),t._v(" mongod start\n")])])]),a("h3",{attrs:{id:"debian"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#debian"}},[t._v("#")]),t._v(" Debian")]),t._v(" "),a("p",[t._v("Please use the "),a("a",{attrs:{href:"https://docs.mongodb.org/master/tutorial/install-mongodb-on-debian/",target:"_blank",rel:"noopener noreferrer"}},[t._v("official MongoDB doc for Debian"),a("OutboundLink")],1)])])}),[],!1,null,null,null);a.default=n.exports}}]);