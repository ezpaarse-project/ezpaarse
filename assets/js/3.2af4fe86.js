(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{358:function(t,e,n){"use strict";n.d(e,"d",(function(){return i})),n.d(e,"a",(function(){return a})),n.d(e,"i",(function(){return s})),n.d(e,"f",(function(){return l})),n.d(e,"g",(function(){return u})),n.d(e,"h",(function(){return c})),n.d(e,"b",(function(){return p})),n.d(e,"e",(function(){return h})),n.d(e,"k",(function(){return f})),n.d(e,"l",(function(){return d})),n.d(e,"c",(function(){return v})),n.d(e,"j",(function(){return m}));n(36),n(88),n(363),n(120),n(400),n(211),n(87),n(118),n(8),n(119),n(41),n(127),n(198);var i=/#.*$/,r=/\.(md|html)$/,a=/\/$/,s=/^[a-z]+:/i;function o(t){return decodeURI(t).replace(i,"").replace(r,"")}function l(t){return s.test(t)}function u(t){return/^mailto:/.test(t)}function c(t){return/^tel:/.test(t)}function p(t){if(l(t))return t;var e=t.match(i),n=e?e[0]:"",r=o(t);return a.test(r)?t:r+".html"+n}function h(t,e){var n=decodeURIComponent(t.hash),r=function(t){var e=t.match(i);if(e)return e[0]}(e);return(!r||n===r)&&o(t.path)===o(e)}function f(t,e,n){if(l(e))return{type:"external",path:e};n&&(e=function(t,e,n){var i=t.charAt(0);if("/"===i)return t;if("?"===i||"#"===i)return e+t;var r=e.split("/");n&&r[r.length-1]||r.pop();for(var a=t.replace(/^\//,"").split("/"),s=0;s<a.length;s++){var o=a[s];".."===o?r.pop():"."!==o&&r.push(o)}""!==r[0]&&r.unshift("");return r.join("/")}(e,n));for(var i=o(e),r=0;r<t.length;r++)if(o(t[r].regularPath)===i)return Object.assign({},t[r],{type:"page",path:p(t[r].path)});return console.error('[vuepress] No matching page found for sidebar item "'.concat(e,'"')),{}}function d(t,e,n,i){var r=n.pages,a=n.themeConfig,s=i&&a.locales&&a.locales[i]||a;if("auto"===(t.frontmatter.sidebar||s.sidebar||a.sidebar))return g(t);var o=s.sidebar||a.sidebar;if(o){var l=function(t,e){if(Array.isArray(e))return{base:"/",config:e};for(var n in e)if(0===(i=t,/(\.html|\/)$/.test(i)?i:i+"/").indexOf(encodeURI(n)))return{base:n,config:e[n]};var i;return{}}(e,o),u=l.base,c=l.config;return"auto"===c?g(t):c?c.map((function(t){return function t(e,n,i){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1;if("string"==typeof e)return f(n,e,i);if(Array.isArray(e))return Object.assign(f(n,e[0],i),{title:e[1]});var a=e.children||[];return 0===a.length&&e.path?Object.assign(f(n,e.path,i),{title:e.title}):{type:"group",path:e.path,title:e.title,sidebarDepth:e.sidebarDepth,initialOpenGroupIndex:e.initialOpenGroupIndex,children:a.map((function(e){return t(e,n,i,r+1)})),collapsable:!1!==e.collapsable}}(t,r,u)})):[]}return[]}function g(t){var e=v(t.headers||[]);return[{type:"group",collapsable:!1,title:t.title,path:null,children:e.map((function(e){return{type:"auto",title:e.title,basePath:t.path,path:t.path+"#"+e.slug,children:e.children||[]}}))}]}function v(t){var e;return(t=t.map((function(t){return Object.assign({},t)}))).forEach((function(t){2===t.level?e=t:e&&(e.children||(e.children=[])).push(t)})),t.filter((function(t){return 2===t.level}))}function m(t){return Object.assign(t,{type:t.items&&t.items.length?"links":"link"})}},363:function(t,e,n){"use strict";var i=n(12),r=n(196),a=n(9),s=n(89),o=n(16),l=n(27),u=n(60),c=n(203),p=n(197);r("match",(function(t,e,n){return[function(e){var n=l(this),r=null==e?void 0:u(e,t);return r?i(r,e,n):new RegExp(e)[t](o(n))},function(t){var i=a(this),r=o(t),l=n(e,i,r);if(l.done)return l.value;if(!i.global)return p(i,r);var u=i.unicode;i.lastIndex=0;for(var h,f=[],d=0;null!==(h=p(i,r));){var g=o(h[0]);f[d]=g,""===g&&(i.lastIndex=c(r,s(i.lastIndex),u)),d++}return 0===d?null:f}]}))},364:function(t,e,n){},370:function(t,e,n){},371:function(t,e,n){},372:function(t,e,n){},373:function(t,e,n){},374:function(t,e,n){},375:function(t,e){t.exports=function(t){return null==t}},376:function(t,e,n){},377:function(t,e,n){},378:function(t,e,n){},379:function(t,e,n){},380:function(t,e,n){},381:function(t,e,n){},393:function(t,e,n){"use strict";n.r(e);n(117),n(8);var i=n(358),r={name:"SidebarGroup",components:{DropdownTransition:n(395).a},props:["item","open","collapsable","depth"],beforeCreate:function(){this.$options.components.SidebarLinks=n(393).default},methods:{isActive:i.e}},a=(n(421),n(35)),s=Object(a.a)(r,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("section",{staticClass:"sidebar-group",class:[{collapsable:t.collapsable,"is-sub-group":0!==t.depth},"depth-"+t.depth]},[t.item.path?n("RouterLink",{staticClass:"sidebar-heading clickable",class:{open:t.open,active:t.isActive(t.$route,t.item.path)},attrs:{to:t.item.path},nativeOn:{click:function(e){return t.$emit("toggle")}}},[n("span",[t._v(t._s(t.item.title))]),t._v(" "),t.collapsable?n("span",{staticClass:"arrow",class:t.open?"down":"right"}):t._e()]):n("p",{staticClass:"sidebar-heading",class:{open:t.open},on:{click:function(e){return t.$emit("toggle")}}},[n("span",[t._v(t._s(t.item.title))]),t._v(" "),t.collapsable?n("span",{staticClass:"arrow",class:t.open?"down":"right"}):t._e()]),t._v(" "),n("DropdownTransition",[t.open||!t.collapsable?n("SidebarLinks",{staticClass:"sidebar-group-items",attrs:{items:t.item.children,"sidebar-depth":t.item.sidebarDepth,"initial-open-group-index":t.item.initialOpenGroupIndex,depth:t.depth+1}}):t._e()],1)],1)}),[],!1,null,null,null).exports;n(422),n(36),n(120),n(87);function o(t,e,n,i,r){var a={props:{to:e,activeClass:"",exactActiveClass:""},class:{active:i,"sidebar-link":!0}};return r>2&&(a.style={"padding-left":r+"rem"}),t("RouterLink",a,n)}function l(t,e,n,r,a){var s=arguments.length>5&&void 0!==arguments[5]?arguments[5]:1;return!e||s>a?null:t("ul",{class:"sidebar-sub-headers"},e.map((function(e){var u=Object(i.e)(r,n+"#"+e.slug);return t("li",{class:"sidebar-sub-header"},[o(t,n+"#"+e.slug,e.title,u,e.level-1),l(t,e.children,n,r,a,s+1)])})))}var u={functional:!0,props:["item","sidebarDepth"],render:function(t,e){var n=e.parent,r=n.$page,a=(n.$site,n.$route),s=n.$themeConfig,u=n.$themeLocaleConfig,c=e.props,p=c.item,h=c.sidebarDepth,f=Object(i.e)(a,p.path),d="auto"===p.type?f||p.children.some((function(t){return Object(i.e)(a,p.basePath+"#"+t.slug)})):f,g="external"===p.type?function(t,e,n){return t("a",{attrs:{href:e,target:"_blank",rel:"noopener noreferrer"},class:{"sidebar-link":!0}},[n,t("OutboundLink")])}(t,p.path,p.title||p.path):o(t,p.path,p.title||p.path,d),v=[r.frontmatter.sidebarDepth,h,u.sidebarDepth,s.sidebarDepth,1].find((function(t){return void 0!==t})),m=u.displayAllHeaders||s.displayAllHeaders;return"auto"===p.type?[g,l(t,p.children,p.basePath,a,v)]:(d||m)&&p.headers&&!i.d.test(p.path)?[g,l(t,Object(i.c)(p.headers),p.path,a,v)]:g}};n(423);function c(t,e){if("group"===e.type){var n=e.path&&Object(i.e)(t,e.path),r=e.children.some((function(e){return"group"===e.type?c(t,e):"page"===e.type&&Object(i.e)(t,e.path)}));return n||r}return!1}var p={name:"SidebarLinks",components:{SidebarGroup:s,SidebarLink:Object(a.a)(u,void 0,void 0,!1,null,null,null).exports},props:["items","depth","sidebarDepth","initialOpenGroupIndex"],data:function(){return{openGroupIndex:this.initialOpenGroupIndex||0}},watch:{$route:function(){this.refreshIndex()}},created:function(){this.refreshIndex()},methods:{refreshIndex:function(){var t=function(t,e){for(var n=0;n<e.length;n++){var i=e[n];if(c(t,i))return n}return-1}(this.$route,this.items);t>-1&&(this.openGroupIndex=t)},toggleGroup:function(t){this.openGroupIndex=t===this.openGroupIndex?-1:t},isActive:function(t){return Object(i.e)(this.$route,t.regularPath)}}},h=Object(a.a)(p,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.items.length?n("ul",{staticClass:"sidebar-links"},t._l(t.items,(function(e,i){return n("li",{key:i},["group"===e.type?n("SidebarGroup",{attrs:{item:e,open:i===t.openGroupIndex,collapsable:e.collapsable||e.collapsible,depth:t.depth},on:{toggle:function(e){return t.toggleGroup(i)}}}):n("SidebarLink",{attrs:{"sidebar-depth":t.sidebarDepth,item:e}})],1)})),0):t._e()}),[],!1,null,null,null);e.default=h.exports},395:function(t,e,n){"use strict";var i={name:"DropdownTransition",methods:{setHeight:function(t){t.style.height=t.scrollHeight+"px"},unsetHeight:function(t){t.style.height=""}}},r=(n(413),n(35)),a=Object(r.a)(i,(function(){var t=this.$createElement;return(this._self._c||t)("transition",{attrs:{name:"dropdown"},on:{enter:this.setHeight,"after-enter":this.unsetHeight,"before-leave":this.setHeight}},[this._t("default")],2)}),[],!1,null,null,null);e.a=a.exports},397:function(t,e,n){"use strict";var i=n(1),r=n(398);i({target:"String",proto:!0,forced:n(399)("link")},{link:function(t){return r(this,"a","href",t)}})},398:function(t,e,n){var i=n(2),r=n(27),a=n(16),s=/"/g,o=i("".replace);t.exports=function(t,e,n,i){var l=a(r(t)),u="<"+e;return""!==n&&(u+=" "+n+'="'+o(a(i),s,"&quot;")+'"'),u+">"+l+"</"+e+">"}},399:function(t,e,n){var i=n(3);t.exports=function(t){return i((function(){var e=""[t]('"');return e!==e.toLowerCase()||e.split('"').length>3}))}},400:function(t,e,n){"use strict";var i=n(31),r=n(12),a=n(2),s=n(196),o=n(199),l=n(9),u=n(27),c=n(125),p=n(203),h=n(89),f=n(16),d=n(60),g=n(200),v=n(197),m=n(92),b=n(195),_=n(3),k=b.UNSUPPORTED_Y,x=Math.min,C=[].push,L=a(/./.exec),$=a(C),y=a("".slice);s("split",(function(t,e,n){var a;return a="c"=="abbc".split(/(b)*/)[1]||4!="test".split(/(?:)/,-1).length||2!="ab".split(/(?:ab)*/).length||4!=".".split(/(.?)(.?)/).length||".".split(/()()/).length>1||"".split(/.?/).length?function(t,n){var a=f(u(this)),s=void 0===n?4294967295:n>>>0;if(0===s)return[];if(void 0===t)return[a];if(!o(t))return r(e,a,t,s);for(var l,c,p,h=[],d=(t.ignoreCase?"i":"")+(t.multiline?"m":"")+(t.unicode?"u":"")+(t.sticky?"y":""),v=0,b=new RegExp(t.source,d+"g");(l=r(m,b,a))&&!((c=b.lastIndex)>v&&($(h,y(a,v,l.index)),l.length>1&&l.index<a.length&&i(C,h,g(l,1)),p=l[0].length,v=c,h.length>=s));)b.lastIndex===l.index&&b.lastIndex++;return v===a.length?!p&&L(b,"")||$(h,""):$(h,y(a,v)),h.length>s?g(h,0,s):h}:"0".split(void 0,0).length?function(t,n){return void 0===t&&0===n?[]:r(e,this,t,n)}:e,[function(e,n){var i=u(this),s=null==e?void 0:d(e,t);return s?r(s,e,i,n):r(a,f(i),e,n)},function(t,i){var r=l(this),s=f(t),o=n(a,r,s,i,a!==e);if(o.done)return o.value;var u=c(r,RegExp),d=r.unicode,g=(r.ignoreCase?"i":"")+(r.multiline?"m":"")+(r.unicode?"u":"")+(k?"g":"y"),m=new u(k?"^(?:"+r.source+")":r,g),b=void 0===i?4294967295:i>>>0;if(0===b)return[];if(0===s.length)return null===v(m,s)?[s]:[];for(var _=0,C=0,L=[];C<s.length;){m.lastIndex=k?0:C;var O,w=v(m,k?y(s,C):s);if(null===w||(O=x(h(m.lastIndex+(k?C:0)),s.length))===_)C=p(s,C,d);else{if($(L,y(s,_,C)),L.length===b)return L;for(var S=1;S<=w.length-1;S++)if($(L,w[S]),L.length===b)return L;C=_=O}}return $(L,y(s,_)),L}]}),!!_((function(){var t=/(?:)/,e=t.exec;t.exec=function(){return e.apply(this,arguments)};var n="ab".split(t);return 2!==n.length||"a"!==n[0]||"b"!==n[1]})),k)},401:function(t,e,n){"use strict";n(364)},402:function(t,e,n){var i=n(1),r=n(403);i({global:!0,forced:parseInt!=r},{parseInt:r})},403:function(t,e,n){var i=n(0),r=n(3),a=n(2),s=n(16),o=n(206).trim,l=n(207),u=i.parseInt,c=i.Symbol,p=c&&c.iterator,h=/^[+-]?0x/i,f=a(h.exec),d=8!==u(l+"08")||22!==u(l+"0x16")||p&&!r((function(){u(Object(p))}));t.exports=d?function(t,e){var n=o(s(t));return u(n,e>>>0||(f(h,n)?16:10))}:u},408:function(t,e,n){"use strict";n(370)},409:function(t,e,n){var i=n(7),r=n(0),a=n(2),s=n(91),o=n(128),l=n(18),u=n(11).f,c=n(43).f,p=n(28),h=n(199),f=n(16),d=n(201),g=n(195),v=n(14),m=n(3),b=n(10),_=n(37).enforce,k=n(208),x=n(5),C=n(202),L=n(210),$=x("match"),y=r.RegExp,O=y.prototype,w=r.SyntaxError,S=a(d),I=a(O.exec),E=a("".charAt),j=a("".replace),T=a("".indexOf),N=a("".slice),R=/^\?<[^\s\d!#%&*+<=>@^][^\s!#%&*+<=>@^]*>/,A=/a/g,P=/a/g,D=new y(A)!==A,U=g.MISSED_STICKY,H=g.UNSUPPORTED_Y,G=i&&(!D||U||C||L||m((function(){return P[$]=!1,y(A)!=A||y(P)==P||"/a/i"!=y(A,"i")})));if(s("RegExp",G)){for(var B=function(t,e){var n,i,r,a,s,u,c=p(O,this),d=h(t),g=void 0===e,v=[],m=t;if(!c&&d&&g&&t.constructor===B)return t;if((d||p(O,t))&&(t=t.source,g&&(e="flags"in m?m.flags:S(m))),t=void 0===t?"":f(t),e=void 0===e?"":f(e),m=t,C&&"dotAll"in A&&(i=!!e&&T(e,"s")>-1)&&(e=j(e,/s/g,"")),n=e,U&&"sticky"in A&&(r=!!e&&T(e,"y")>-1)&&H&&(e=j(e,/y/g,"")),L&&(t=(a=function(t){for(var e,n=t.length,i=0,r="",a=[],s={},o=!1,l=!1,u=0,c="";i<=n;i++){if("\\"===(e=E(t,i)))e+=E(t,++i);else if("]"===e)o=!1;else if(!o)switch(!0){case"["===e:o=!0;break;case"("===e:I(R,N(t,i+1))&&(i+=2,l=!0),r+=e,u++;continue;case">"===e&&l:if(""===c||b(s,c))throw new w("Invalid capture group name");s[c]=!0,a[a.length]=[c,u],l=!1,c="";continue}l?c+=e:r+=e}return[r,a]}(t))[0],v=a[1]),s=o(y(t,e),c?this:O,B),(i||r||v.length)&&(u=_(s),i&&(u.dotAll=!0,u.raw=B(function(t){for(var e,n=t.length,i=0,r="",a=!1;i<=n;i++)"\\"!==(e=E(t,i))?a||"."!==e?("["===e?a=!0:"]"===e&&(a=!1),r+=e):r+="[\\s\\S]":r+=e+E(t,++i);return r}(t),n)),r&&(u.sticky=!0),v.length&&(u.groups=v)),t!==m)try{l(s,"source",""===m?"(?:)":m)}catch(t){}return s},W=function(t){t in B||u(B,t,{configurable:!0,get:function(){return y[t]},set:function(e){y[t]=e}})},M=c(y),Y=0;M.length>Y;)W(M[Y++]);O.constructor=B,B.prototype=O,v(r,"RegExp",B)}k("RegExp")},410:function(t,e,n){var i=n(0),r=n(7),a=n(202),s=n(23),o=n(11).f,l=n(37).get,u=RegExp.prototype,c=i.TypeError;r&&a&&o(u,"dotAll",{configurable:!0,get:function(){if(this!==u){if("RegExp"===s(this))return!!l(this).dotAll;throw c("Incompatible receiver, RegExp required")}}})},411:function(t,e,n){var i=n(0),r=n(7),a=n(195).MISSED_STICKY,s=n(23),o=n(11).f,l=n(37).get,u=RegExp.prototype,c=i.TypeError;r&&a&&o(u,"sticky",{configurable:!0,get:function(){if(this!==u){if("RegExp"===s(this))return!!l(this).sticky;throw c("Incompatible receiver, RegExp required")}}})},412:function(t,e,n){"use strict";var i=n(2),r=n(90).PROPER,a=n(14),s=n(9),o=n(28),l=n(16),u=n(3),c=n(201),p=RegExp.prototype,h=p.toString,f=i(c),d=u((function(){return"/a/b"!=h.call({source:"a",flags:"b"})})),g=r&&"toString"!=h.name;(d||g)&&a(RegExp.prototype,"toString",(function(){var t=s(this),e=l(t.source),n=t.flags;return"/"+e+"/"+l(void 0===n&&o(p,t)&&!("flags"in p)?f(t):n)}),{unsafe:!0})},413:function(t,e,n){"use strict";n(371)},414:function(t,e,n){"use strict";n(372)},415:function(t,e,n){"use strict";n(373)},416:function(t,e,n){"use strict";n(374)},417:function(t,e,n){"use strict";n(376)},418:function(t,e,n){var i=n(46),r=n(19),a=n(38);t.exports=function(t){return"string"==typeof t||!r(t)&&a(t)&&"[object String]"==i(t)}},419:function(t,e,n){"use strict";n(377)},420:function(t,e,n){"use strict";n(378)},421:function(t,e,n){"use strict";n(379)},422:function(t,e,n){"use strict";var i=n(1),r=n(44).find,a=n(123),s=!0;"find"in[]&&Array(1).find((function(){s=!1})),i({target:"Array",proto:!0,forced:s},{find:function(t){return r(this,t,arguments.length>1?arguments[1]:void 0)}}),a("find")},423:function(t,e,n){"use strict";n(380)},424:function(t,e,n){"use strict";n(381)},451:function(t,e,n){"use strict";n.r(e);n(397),n(117),n(8),n(121);var i=n(358),r={name:"NavLink",props:{item:{required:!0}},computed:{link:function(){return Object(i.b)(this.item.link)},exact:function(){var t=this;return this.$site.locales?Object.keys(this.$site.locales).some((function(e){return e===t.link})):"/"===this.link},isNonHttpURI:function(){return Object(i.g)(this.link)||Object(i.h)(this.link)},isBlankTarget:function(){return"_blank"===this.target},isInternal:function(){return!Object(i.f)(this.link)&&!this.isBlankTarget},target:function(){return this.isNonHttpURI?null:this.item.target?this.item.target:Object(i.f)(this.link)?"_blank":""},rel:function(){return this.isNonHttpURI||!1===this.item.rel?null:this.item.rel?this.item.rel:this.isBlankTarget?"noopener noreferrer":null}},methods:{focusoutAction:function(){this.$emit("focusout")}}},a=n(35),s=Object(a.a)(r,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.isInternal?n("RouterLink",{staticClass:"nav-link",attrs:{to:t.link,exact:t.exact},nativeOn:{focusout:function(e){return t.focusoutAction.apply(null,arguments)}}},[t._v("\n  "+t._s(t.item.text)+"\n")]):n("a",{staticClass:"nav-link external",attrs:{href:t.link,target:t.target,rel:t.rel},on:{focusout:t.focusoutAction}},[t._v("\n  "+t._s(t.item.text)+"\n  "),t.isBlankTarget?n("OutboundLink"):t._e()],1)}),[],!1,null,null,null).exports,o={name:"Home",components:{NavLink:s},computed:{data:function(){return this.$page.frontmatter},actionLink:function(){return{link:this.data.actionLink,text:this.data.actionText}}}},l=(n(401),Object(a.a)(o,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("main",{staticClass:"home",attrs:{"aria-labelledby":null!==t.data.heroText?"main-title":null}},[n("header",{staticClass:"hero"},[t.data.heroImage?n("img",{attrs:{src:t.$withBase(t.data.heroImage),alt:t.data.heroAlt||"hero"}}):t._e(),t._v(" "),null!==t.data.heroText?n("h1",{attrs:{id:"main-title"}},[t._v("\n      "+t._s(t.data.heroText||t.$title||"Hello")+"\n    ")]):t._e(),t._v(" "),null!==t.data.tagline?n("p",{staticClass:"description"},[t._v("\n      "+t._s(t.data.tagline||t.$description||"Welcome to your VuePress site")+"\n    ")]):t._e(),t._v(" "),t.data.actionText&&t.data.actionLink?n("p",{staticClass:"action"},[n("NavLink",{staticClass:"action-button",attrs:{item:t.actionLink}})],1):t._e()]),t._v(" "),t.data.features&&t.data.features.length?n("div",{staticClass:"features"},t._l(t.data.features,(function(e,i){return n("div",{key:i,staticClass:"feature"},[n("h2",[t._v(t._s(e.title))]),t._v(" "),n("p",[t._v(t._s(e.details))])])})),0):t._e(),t._v(" "),n("Content",{staticClass:"theme-default-content custom"}),t._v(" "),t.data.footer?n("div",{staticClass:"footer"},[t._v("\n    "+t._s(t.data.footer)+"\n  ")]):n("Content",{staticClass:"footer",attrs:{"slot-key":"footer"}})],1)}),[],!1,null,null,null).exports),u=(n(402),n(394)),c=(n(408),Object(a.a)({},(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"sidebar-button",on:{click:function(e){return t.$emit("toggle-sidebar")}}},[n("svg",{staticClass:"icon",attrs:{xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",role:"img",viewBox:"0 0 448 512"}},[n("path",{attrs:{fill:"currentColor",d:"M436 124H12c-6.627 0-12-5.373-12-12V80c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12z"}})])])}),[],!1,null,null,null).exports),p=n(58),h=(n(87),n(36),n(88),n(212),n(120),n(363),n(409),n(410),n(411),n(412),n(395)),f=n(213),d=n.n(f),g={name:"DropdownLink",components:{NavLink:s,DropdownTransition:h.a},props:{item:{required:!0}},data:function(){return{open:!1}},computed:{dropdownAriaLabel:function(){return this.item.ariaLabel||this.item.text}},watch:{$route:function(){this.open=!1}},methods:{setOpen:function(t){this.open=t},isLastItemOfArray:function(t,e){return d()(e)===t},handleDropdown:function(){0===event.detail&&this.setOpen(!this.open)}}},v=(n(414),{name:"NavLinks",components:{NavLink:s,DropdownLink:Object(a.a)(g,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"dropdown-wrapper",class:{open:t.open}},[n("button",{staticClass:"dropdown-title",attrs:{type:"button","aria-label":t.dropdownAriaLabel},on:{click:t.handleDropdown}},[n("span",{staticClass:"title"},[t._v(t._s(t.item.text))]),t._v(" "),n("span",{staticClass:"arrow down"})]),t._v(" "),n("button",{staticClass:"mobile-dropdown-title",attrs:{type:"button","aria-label":t.dropdownAriaLabel},on:{click:function(e){return t.setOpen(!t.open)}}},[n("span",{staticClass:"title"},[t._v(t._s(t.item.text))]),t._v(" "),n("span",{staticClass:"arrow",class:t.open?"down":"right"})]),t._v(" "),n("DropdownTransition",[n("ul",{directives:[{name:"show",rawName:"v-show",value:t.open,expression:"open"}],staticClass:"nav-dropdown"},t._l(t.item.items,(function(e,i){return n("li",{key:e.link||i,staticClass:"dropdown-item"},["links"===e.type?n("h4",[t._v("\n          "+t._s(e.text)+"\n        ")]):t._e(),t._v(" "),"links"===e.type?n("ul",{staticClass:"dropdown-subitem-wrapper"},t._l(e.items,(function(i){return n("li",{key:i.link,staticClass:"dropdown-subitem"},[n("NavLink",{attrs:{item:i},on:{focusout:function(n){t.isLastItemOfArray(i,e.items)&&t.isLastItemOfArray(e,t.item.items)&&t.setOpen(!1)}}})],1)})),0):n("NavLink",{attrs:{item:e},on:{focusout:function(n){t.isLastItemOfArray(e,t.item.items)&&t.setOpen(!1)}}})],1)})),0)])],1)}),[],!1,null,null,null).exports},computed:{userNav:function(){return this.$themeLocaleConfig.nav||this.$site.themeConfig.nav||[]},nav:function(){var t=this,e=this.$site.locales;if(e&&Object.keys(e).length>1){var n=this.$page.path,i=this.$router.options.routes,r=this.$site.themeConfig.locales||{},a={text:this.$themeLocaleConfig.selectText||"Languages",ariaLabel:this.$themeLocaleConfig.ariaLabel||"Select language",items:Object.keys(e).map((function(a){var s,o=e[a],l=r[a]&&r[a].label||o.lang;return o.lang===t.$lang?s=n:(s=n.replace(t.$localeConfig.path,a),i.some((function(t){return t.path===s}))||(s=a)),{text:l,link:s}}))};return[].concat(Object(p.a)(this.userNav),[a])}return this.userNav},userLinks:function(){return(this.nav||[]).map((function(t){return Object.assign(Object(i.j)(t),{items:(t.items||[]).map(i.j)})}))},repoLink:function(){var t=this.$site.themeConfig.repo;return t?/^https?:/.test(t)?t:"https://github.com/".concat(t):null},repoLabel:function(){if(this.repoLink){if(this.$site.themeConfig.repoLabel)return this.$site.themeConfig.repoLabel;for(var t=this.repoLink.match(/^https?:\/\/[^/]+/)[0],e=["GitHub","GitLab","Bitbucket"],n=0;n<e.length;n++){var i=e[n];if(new RegExp(i,"i").test(t))return i}return"Source"}}}}),m=(n(415),Object(a.a)(v,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.userLinks.length||t.repoLink?n("nav",{staticClass:"nav-links"},[t._l(t.userLinks,(function(t){return n("div",{key:t.link,staticClass:"nav-item"},["links"===t.type?n("DropdownLink",{attrs:{item:t}}):n("NavLink",{attrs:{item:t}})],1)})),t._v(" "),t.repoLink?n("a",{staticClass:"repo-link",attrs:{href:t.repoLink,target:"_blank",rel:"noopener noreferrer"}},[t._v("\n    "+t._s(t.repoLabel)+"\n    "),n("OutboundLink")],1):t._e()],2):t._e()}),[],!1,null,null,null).exports);function b(t,e){return t.ownerDocument.defaultView.getComputedStyle(t,null)[e]}var _={name:"Navbar",components:{SidebarButton:c,NavLinks:m,SearchBox:u.default,AlgoliaSearchBox:{}},data:function(){return{linksWrapMaxWidth:null}},computed:{algolia:function(){return this.$themeLocaleConfig.algolia||this.$site.themeConfig.algolia||{}},isAlgoliaSearch:function(){return this.algolia&&this.algolia.apiKey&&this.algolia.indexName}},mounted:function(){var t=this,e=parseInt(b(this.$el,"paddingLeft"))+parseInt(b(this.$el,"paddingRight")),n=function(){document.documentElement.clientWidth<719?t.linksWrapMaxWidth=null:t.linksWrapMaxWidth=t.$el.offsetWidth-e-(t.$refs.siteName&&t.$refs.siteName.offsetWidth||0)};n(),window.addEventListener("resize",n,!1)}},k=(n(416),Object(a.a)(_,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("header",{staticClass:"navbar"},[n("SidebarButton",{on:{"toggle-sidebar":function(e){return t.$emit("toggle-sidebar")}}}),t._v(" "),n("RouterLink",{staticClass:"home-link",attrs:{to:t.$localePath}},[t.$site.themeConfig.logo?n("img",{staticClass:"logo",attrs:{src:t.$withBase(t.$site.themeConfig.logo),alt:t.$siteTitle}}):t._e(),t._v(" "),t.$siteTitle?n("span",{ref:"siteName",staticClass:"site-name",class:{"can-hide":t.$site.themeConfig.logo}},[t._v(t._s(t.$siteTitle))]):t._e()]),t._v(" "),n("div",{staticClass:"links",style:t.linksWrapMaxWidth?{"max-width":t.linksWrapMaxWidth+"px"}:{}},[t.isAlgoliaSearch?n("AlgoliaSearchBox",{attrs:{options:t.algolia}}):!1!==t.$site.themeConfig.search&&!1!==t.$page.frontmatter.search?n("SearchBox"):t._e(),t._v(" "),n("NavLinks",{staticClass:"can-hide"})],1)],1)}),[],!1,null,null,null).exports),x=n(375),C=n.n(x),L={name:"PageEdit",computed:{lastUpdated:function(){return this.$page.lastUpdated},lastUpdatedText:function(){return"string"==typeof this.$themeLocaleConfig.lastUpdated?this.$themeLocaleConfig.lastUpdated:"string"==typeof this.$site.themeConfig.lastUpdated?this.$site.themeConfig.lastUpdated:"Last Updated"},editLink:function(){var t=C()(this.$page.frontmatter.editLink)?this.$site.themeConfig.editLinks:this.$page.frontmatter.editLink,e=this.$site.themeConfig,n=e.repo,i=e.docsDir,r=void 0===i?"":i,a=e.docsBranch,s=void 0===a?"master":a,o=e.docsRepo,l=void 0===o?n:o;return t&&l&&this.$page.relativePath?this.createEditLink(n,l,r,s,this.$page.relativePath):null},editLinkText:function(){return this.$themeLocaleConfig.editLinkText||this.$site.themeConfig.editLinkText||"Edit this page"}},methods:{createEditLink:function(t,e,n,r,a){if(/bitbucket.org/.test(e))return e.replace(i.a,"")+"/src"+"/".concat(r,"/")+(n?n.replace(i.a,"")+"/":"")+a+"?mode=edit&spa=0&at=".concat(r,"&fileviewer=file-view-default");return/gitlab.com/.test(e)?e.replace(i.a,"")+"/-/edit"+"/".concat(r,"/")+(n?n.replace(i.a,"")+"/":"")+a:(i.i.test(e)?e:"https://github.com/".concat(e)).replace(i.a,"")+"/edit"+"/".concat(r,"/")+(n?n.replace(i.a,"")+"/":"")+a}}},$=(n(417),Object(a.a)(L,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("footer",{staticClass:"page-edit"},[t.editLink?n("div",{staticClass:"edit-link"},[n("a",{attrs:{href:t.editLink,target:"_blank",rel:"noopener noreferrer"}},[t._v(t._s(t.editLinkText))]),t._v(" "),n("OutboundLink")],1):t._e(),t._v(" "),t.lastUpdated?n("div",{staticClass:"last-updated"},[n("span",{staticClass:"prefix"},[t._v(t._s(t.lastUpdatedText)+":")]),t._v(" "),n("span",{staticClass:"time"},[t._v(t._s(t.lastUpdated))])]):t._e()])}),[],!1,null,null,null).exports),y=n(418),O=n.n(y),w={name:"PageNav",props:["sidebarItems"],computed:{prev:function(){return I(S.PREV,this)},next:function(){return I(S.NEXT,this)}}};var S={NEXT:{resolveLink:function(t,e){return E(t,e,1)},getThemeLinkConfig:function(t){return t.nextLinks},getPageLinkConfig:function(t){return t.frontmatter.next}},PREV:{resolveLink:function(t,e){return E(t,e,-1)},getThemeLinkConfig:function(t){return t.prevLinks},getPageLinkConfig:function(t){return t.frontmatter.prev}}};function I(t,e){var n=e.$themeConfig,r=e.$page,a=e.$route,s=e.$site,o=e.sidebarItems,l=t.resolveLink,u=t.getThemeLinkConfig,c=t.getPageLinkConfig,p=u(n),h=c(r),f=C()(h)?p:h;return!1===f?void 0:O()(f)?Object(i.k)(s.pages,f,a.path):l(r,o)}function E(t,e,n){var i=[];!function t(e,n){for(var i=0,r=e.length;i<r;i++)"group"===e[i].type?t(e[i].children||[],n):n.push(e[i])}(e,i);for(var r=0;r<i.length;r++){var a=i[r];if("page"===a.type&&a.path===decodeURIComponent(t.path))return i[r+n]}}var j=w,T=(n(419),{components:{PageEdit:$,PageNav:Object(a.a)(j,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.prev||t.next?n("div",{staticClass:"page-nav"},[n("p",{staticClass:"inner"},[t.prev?n("span",{staticClass:"prev"},[t._v("\n      ←\n      "),"external"===t.prev.type?n("a",{staticClass:"prev",attrs:{href:t.prev.path,target:"_blank",rel:"noopener noreferrer"}},[t._v("\n        "+t._s(t.prev.title||t.prev.path)+"\n\n        "),n("OutboundLink")],1):n("RouterLink",{staticClass:"prev",attrs:{to:t.prev.path}},[t._v("\n        "+t._s(t.prev.title||t.prev.path)+"\n      ")])],1):t._e(),t._v(" "),t.next?n("span",{staticClass:"next"},["external"===t.next.type?n("a",{attrs:{href:t.next.path,target:"_blank",rel:"noopener noreferrer"}},[t._v("\n        "+t._s(t.next.title||t.next.path)+"\n\n        "),n("OutboundLink")],1):n("RouterLink",{attrs:{to:t.next.path}},[t._v("\n        "+t._s(t.next.title||t.next.path)+"\n      ")]),t._v("\n      →\n    ")],1):t._e()])]):t._e()}),[],!1,null,null,null).exports},props:["sidebarItems"]}),N=(n(420),Object(a.a)(T,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("main",{staticClass:"page"},[t._t("top"),t._v(" "),n("Content",{staticClass:"theme-default-content"}),t._v(" "),n("PageEdit"),t._v(" "),n("PageNav",t._b({},"PageNav",{sidebarItems:t.sidebarItems},!1)),t._v(" "),t._t("bottom")],2)}),[],!1,null,null,null).exports),R={name:"Sidebar",components:{SidebarLinks:n(393).default,NavLinks:m},props:["items"]},A=(n(424),{name:"Layout",components:{Home:l,Page:N,Sidebar:Object(a.a)(R,(function(){var t=this.$createElement,e=this._self._c||t;return e("aside",{staticClass:"sidebar"},[e("NavLinks"),this._v(" "),this._t("top"),this._v(" "),e("SidebarLinks",{attrs:{depth:0,items:this.items}}),this._v(" "),this._t("bottom")],2)}),[],!1,null,null,null).exports,Navbar:k},data:function(){return{isSidebarOpen:!1}},computed:{shouldShowNavbar:function(){var t=this.$site.themeConfig;return!1!==this.$page.frontmatter.navbar&&!1!==t.navbar&&(this.$title||t.logo||t.repo||t.nav||this.$themeLocaleConfig.nav)},shouldShowSidebar:function(){var t=this.$page.frontmatter;return!t.home&&!1!==t.sidebar&&this.sidebarItems.length},sidebarItems:function(){return Object(i.l)(this.$page,this.$page.regularPath,this.$site,this.$localePath)},pageClasses:function(){var t=this.$page.frontmatter.pageClass;return[{"no-navbar":!this.shouldShowNavbar,"sidebar-open":this.isSidebarOpen,"no-sidebar":!this.shouldShowSidebar},t]}},mounted:function(){var t=this;this.$router.afterEach((function(){t.isSidebarOpen=!1}))},methods:{toggleSidebar:function(t){this.isSidebarOpen="boolean"==typeof t?t:!this.isSidebarOpen,this.$emit("toggle-sidebar",this.isSidebarOpen)},onTouchStart:function(t){this.touchStart={x:t.changedTouches[0].clientX,y:t.changedTouches[0].clientY}},onTouchEnd:function(t){var e=t.changedTouches[0].clientX-this.touchStart.x,n=t.changedTouches[0].clientY-this.touchStart.y;Math.abs(e)>Math.abs(n)&&Math.abs(e)>40&&(e>0&&this.touchStart.x<=80?this.toggleSidebar(!0):this.toggleSidebar(!1))}}}),P=Object(a.a)(A,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"theme-container",class:t.pageClasses,on:{touchstart:t.onTouchStart,touchend:t.onTouchEnd}},[t.shouldShowNavbar?n("Navbar",{on:{"toggle-sidebar":t.toggleSidebar}}):t._e(),t._v(" "),n("div",{staticClass:"sidebar-mask",on:{click:function(e){return t.toggleSidebar(!1)}}}),t._v(" "),n("Sidebar",{attrs:{items:t.sidebarItems},on:{"toggle-sidebar":t.toggleSidebar},scopedSlots:t._u([{key:"top",fn:function(){return[t._t("sidebar-top")]},proxy:!0},{key:"bottom",fn:function(){return[t._t("sidebar-bottom")]},proxy:!0}],null,!0)}),t._v(" "),t.$page.frontmatter.home?n("Home"):n("Page",{attrs:{"sidebar-items":t.sidebarItems},scopedSlots:t._u([{key:"top",fn:function(){return[t._t("page-top")]},proxy:!0},{key:"bottom",fn:function(){return[t._t("page-bottom")]},proxy:!0}],null,!0)})],1)}),[],!1,null,null,null);e.default=P.exports}}]);