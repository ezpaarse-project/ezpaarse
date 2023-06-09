(window.webpackJsonp=window.webpackJsonp||[]).push([[25],{297:function(e,t,r){"use strict";r.r(t);var s=r(295);const a=(e,t)=>e.code>t.code?1:-1;var o={data:()=>({rtypes:[],mimes:[],rids:[]}),async mounted(){const{data:e}=await s.a.get("https://raw.githubusercontent.com/ezpaarse-project/ezpaarse-platforms/master/fields.json");this.rtypes=(e.rtype||[]).sort(a),this.mimes=(e.mime||[]).sort(a),this.rids=(e.rid||[]).sort(a)}},i=r(10),n=Object(i.a)(o,(function(){var e=this,t=e._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h1",{attrs:{id:"consultation-access-events"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#consultation-access-events"}},[e._v("#")]),e._v(" Consultation/Access Events")]),e._v(" "),t("p",[e._v('A consultation event (also known as "access event") is what ezPAARSE produces when it detects an actual consultation of e-resource in the logs. Each consultation event is generated with some generic data found in the original log line (date, user login, URL of the resource...), and is enriched with various methods.')]),e._v(" "),t("p",[e._v("By default, ezPAARSE produces a CSV output with a limited amount of fields. You can add or remove some fields by using the "),t("RouterLink",{attrs:{to:"/features/outputfields.html"}},[e._v("Output-Fields")]),e._v(" header. You can also choose a "),t("RouterLink",{attrs:{to:"/configuration/parametres.html#accept"}},[e._v("JSON output")]),e._v(" to get access events with all their properties.")],1),e._v(" "),t("p",[e._v("Here is a list of fields that can be found in the consultation events :")]),e._v(" "),t("h2",{attrs:{id:"typical-properties-of-an-access-event"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#typical-properties-of-an-access-event"}},[e._v("#")]),e._v(" Typical Properties of an Access Event")]),e._v(" "),t("table",[t("thead",[t("tr",[t("th",[e._v("Attribute Name")]),e._v(" "),t("th",[e._v("Description")]),e._v(" "),t("th",[e._v("Example")])])]),e._v(" "),t("tbody",[t("tr",[t("td",[e._v("date")]),e._v(" "),t("td",[e._v("Date of the consultation event")]),e._v(" "),t("td",[e._v("2014-12-16")])]),e._v(" "),t("tr",[t("td",[e._v("login")]),e._v(" "),t("td",[e._v("Login, encrypted or not")]),e._v(" "),t("td",[e._v("8olq8")])]),e._v(" "),t("tr",[t("td",[e._v("platform")]),e._v(" "),t("td",[e._v("ezPAARSE Platform's short code (ie. parser's name) eg: sd for siencedirect")]),e._v(" "),t("td",[e._v("hw")])]),e._v(" "),t("tr",[t("td",[e._v("platform_name")]),e._v(" "),t("td",[e._v("long name of the vendor's platform")]),e._v(" "),t("td",[e._v("Highwire")])]),e._v(" "),t("tr",[t("td",[e._v("publisher_name")]),e._v(" "),t("td",[e._v("Long name of the publisher (can be different from the platform name)")]),e._v(" "),t("td",[e._v("American Physiological Society")])]),e._v(" "),t("tr",[t("td",[e._v("rtype")]),e._v(" "),t("td",[e._v("Resource type")]),e._v(" "),t("td",[e._v("ARTICLE")])]),e._v(" "),t("tr",[t("td",[e._v("mime")]),e._v(" "),t("td",[e._v("Mime type of the ressource")]),e._v(" "),t("td",[e._v("PDF")])]),e._v(" "),t("tr",[t("td",[e._v("print_identifier")]),e._v(" "),t("td",[e._v("usually ISSN (paper)")]),e._v(" "),t("td",[e._v("0021-9797")])]),e._v(" "),t("tr",[t("td",[e._v("online_identifier")]),e._v(" "),t("td",[e._v("usually eISSN (electronic)")]),e._v(" "),t("td",[e._v("0021-9898")])]),e._v(" "),t("tr",[t("td",[e._v("title_id")]),e._v(" "),t("td",[e._v("Title identifier (see KBART specification)")]),e._v(" "),t("td",[e._v("ACHRE")])]),e._v(" "),t("tr",[t("td",[e._v("doi")]),e._v(" "),t("td"),e._v(" "),t("td",[e._v("10.1007/s10557-015-6582-9")])]),e._v(" "),t("tr",[t("td",[e._v("publication_Title")]),e._v(" "),t("td",[e._v("Book or journal title")]),e._v(" "),t("td",[e._v("Journal of Pediatric Surgery")])]),e._v(" "),t("tr",[t("td",[e._v("unitid")]),e._v(" "),t("td",[e._v("see below")]),e._v(" "),t("td",[e._v("SOO21979714009205")])]),e._v(" "),t("tr",[t("td",[e._v("domain")]),e._v(" "),t("td",[e._v("domain name as found in the requested URL")]),e._v(" "),t("td",[e._v("ac.els-cdn.com")])]),e._v(" "),t("tr",[t("td",[e._v("geoip-country")]),e._v(" "),t("td",[e._v("Country abbrev. found for the host's IP address")]),e._v(" "),t("td",[e._v("FR")])]),e._v(" "),t("tr",[t("td",[e._v("geoip-latitude")]),e._v(" "),t("td",[e._v("Latitude found for the host's IP address")]),e._v(" "),t("td",[e._v("62")])]),e._v(" "),t("tr",[t("td",[e._v("geoip-longitude")]),e._v(" "),t("td",[e._v("Longitude found for the host's IP address")]),e._v(" "),t("td",[e._v("15")])]),e._v(" "),t("tr",[t("td",[e._v("datetime")]),e._v(" "),t("td",[e._v("Time for the consultation event")]),e._v(" "),t("td",[e._v("2014-12-16T09:58:43")])]),e._v(" "),t("tr",[t("td",[e._v("host")]),e._v(" "),t("td",[e._v("IP address of the user")]),e._v(" "),t("td",[e._v("62.247.28.26")])]),e._v(" "),t("tr",[t("td",[e._v("url")]),e._v(" "),t("td",[e._v("URL requested by the user to access a resource")]),e._v(" "),t("td",[e._v("http://link.springer.com:80/article/10.1007/s10557-015-6582-9")])]),e._v(" "),t("tr",[t("td",[e._v("status")]),e._v(" "),t("td",[e._v("HTTP status")]),e._v(" "),t("td",[e._v("200")])]),e._v(" "),t("tr",[t("td",[e._v("size")]),e._v(" "),t("td",[e._v("Request size (in bytes)")]),e._v(" "),t("td",[e._v("65816")])]),e._v(" "),t("tr",[t("td",[e._v("log_id")]),e._v(" "),t("td",[e._v("Unique ID calculated by applying a SHA1 on the log line")]),e._v(" "),t("td",[e._v("f9c2c138f4998573b893696c3de3341cdabd1fb0")])])])]),e._v(" "),t("p",[e._v("For more information, see all the "),t("RouterLink",{attrs:{to:"/configuration/parametres.html#output-fields"}},[e._v("fields")]),e._v(" you can request.")],1),e._v(" "),t("h2",{attrs:{id:"resources-identifiers"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#resources-identifiers"}},[e._v("#")]),e._v(" Resources' identifiers")]),e._v(" "),t("p",[e._v("The identifier of a resource allows to characterize the access events associated with it. It can take the values defined in the table below (loaded from "),t("a",{attrs:{href:"https://github.com/ezpaarse-project/ezpaarse-platforms/blob/master/fields.json",target:"_blank",rel:"noopener noreferrer"}},[e._v("the settings of ezPAARSE"),t("OutboundLink")],1),e._v("). A resource can also be characterized by several identifiers at the same time (eg. a proprietary identifier and an ISBN).")]),e._v(" "),t("FieldsTable",{attrs:{rows:e.rids}}),e._v(" "),t("h3",{attrs:{id:"unitid"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#unitid"}},[e._v("#")]),e._v(" UnitId")]),e._v(" "),t("p",[e._v("The unitid contains the most accurate identifier for a consultation event on a platform (ie. which describes it with the finest granularity). This identifier does not exclude the use of other identifiers. It is used for the deduplication of access events according to the "),t("a",{attrs:{href:"http://www.projectcounter.org/",target:"_blank",rel:"noopener noreferrer"}},[e._v("COUNTER"),t("OutboundLink")],1),e._v(" standard in use and provides librarians with useful indicators.")]),e._v(" "),t("p",[e._v("This may be the "),t("code",[e._v("DOI")]),e._v(" or a more complex identifier that will spot as precisely as possible what has been consulted (eg. a paragraph of an article of a page of a book).")]),e._v(" "),t("h2",{attrs:{id:"resources-types-rtype"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#resources-types-rtype"}},[e._v("#")]),e._v(" Resources Types (rtype)")]),e._v(" "),t("p",[e._v("The type of a resource allows to know the nature of a resource and characterize the associated access event. It can take one of the values defined in the table below (loaded from "),t("a",{attrs:{href:"https://github.com/ezpaarse-project/ezpaarse-platforms/blob/master/fields.json",target:"_blank",rel:"noopener noreferrer"}},[e._v("settings of ezPAARSE"),t("OutboundLink")],1),e._v(").")]),e._v(" "),t("FieldsTable",{attrs:{rows:e.rtypes}}),e._v(" "),t("h2",{attrs:{id:"resources-formats-mime"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#resources-formats-mime"}},[e._v("#")]),e._v(" Resources Formats (mime)")]),e._v(" "),t("p",[e._v("The format of a resource allows to characterize the associated access event. It can take one of the values defined in the table below (loaded from the "),t("a",{attrs:{href:"https://github.com/ezpaarse-project/ezpaarse-platforms/blob/master/fields.json",target:"_blank",rel:"noopener noreferrer"}},[e._v("settings of ezPAARSE"),t("OutboundLink")],1),e._v(").")]),e._v(" "),t("FieldsTable",{attrs:{rows:e.mimes}})],1)}),[],!1,null,null,null);t.default=n.exports}}]);