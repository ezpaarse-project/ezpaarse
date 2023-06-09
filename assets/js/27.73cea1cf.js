(window.webpackJsonp=window.webpackJsonp||[]).push([[27],{315:function(e,t,a){"use strict";a.r(t);var r=a(10),n=Object(r.a)({},(function(){var e=this,t=e._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h1",{attrs:{id:"knowledge-bases"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#knowledge-bases"}},[e._v("#")]),e._v(" Knowledge bases")]),e._v(" "),t("h2",{attrs:{id:"what-is-a-knowledge-base"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#what-is-a-knowledge-base"}},[e._v("#")]),e._v(" What is a knowledge base?")]),e._v(" "),t("p",[e._v("A "),t("strong",[e._v("PKB")]),e._v(" (read "),t("em",[e._v("Publisher Knowledge Base")]),e._v(") is simply an organized list making the link between normalized metadata (eg. ISSN, DOI, journal title, etc.) and proprietary resource identifier(s) used by a vendor.")]),e._v(" "),t("p",[e._v("A "),t("strong",[e._v("PKB")]),e._v(" is composed of one or more "),t("a",{attrs:{href:"http://en.wikipedia.org/wiki/Tab-separated_values",target:"_blank",rel:"noopener noreferrer"}},[e._v("tab separed value"),t("OutboundLink")],1),e._v(" text files that conforms to the "),t("a",{attrs:{href:"http://www.niso.org/workrooms/kbart",target:"_blank",rel:"noopener noreferrer"}},[e._v("KBART format"),t("OutboundLink")],1)]),e._v(" "),t("p",[e._v("The KBART field named "),t("strong",[e._v("title_id")]),e._v(" represents the vendor's identifier that will be linked to a normalized identifier like "),t("strong",[e._v("print_identifier")]),e._v(" (very often: print ISSN) or "),t("strong",[e._v("online_identifier")]),e._v(".")]),e._v(" "),t("p",[e._v("The KBART files used by ezPAARSE can contain additional non-KBART fields (that will be prefixed with "),t("code",[e._v("pkb-")]),e._v(", like: "),t("code",[e._v("pkb-domain")]),e._v("), depending on the richness of the metadata available.")]),e._v(" "),t("p",[e._v("In order to be taken in account by ezPAARSE, the PKB files need to respect the KBART standard file naming pattern: "),t("strong",[e._v("[ProviderName]_"),t("em",[e._v("[Region/Consortium]")]),e._v("_[PackageName]_[YYYY-MM-DD].txt")]),e._v(", and be located in a folder named after the platform's parser.")]),e._v(" "),t("p",[e._v("For example:")]),e._v(" "),t("ul",[t("li",[e._v("cairn/cairn_ebooks_2014-02-13.txt")]),e._v(" "),t("li",[e._v("cairn/cairn_journals_part1_2014-02-13.txt")])]),e._v(" "),t("p",[t("strong",[e._v("Warning")]),e._v(" : PKB identifiers "),t("strong",[e._v("must be unique")]),e._v(". If an identifier appears more than once (in one or more PKB files), "),t("strong",[e._v("only one occurrence")]),e._v(" will be taken in account.")]),e._v(" "),t("h2",{attrs:{id:"how-is-a-knowledge-base-used"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#how-is-a-knowledge-base-used"}},[e._v("#")]),e._v(" How is a Knowledge Base used?")]),e._v(" "),t("h3",{attrs:{id:"ezpaarse-2-1-0"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-2-1-0"}},[e._v("#")]),e._v(" ezPAARSE < 2.1.0")]),e._v(" "),t("p",[e._v("When a resource carrying a vendor identifier "),t("code",[e._v("title_id")]),e._v(" is met, the associated knowledge base is built from the KBART files and loaded to memory. ezPAARSE can then link the proprietary identifier with all the metadata available and add it to the access event that has been generated.")]),e._v(" "),t("h3",{attrs:{id:"ezpaarse-since-2-1-0"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#ezpaarse-since-2-1-0"}},[e._v("#")]),e._v(" ezPAARSE since 2.1.0")]),e._v(" "),t("p",[e._v("As knowledge bases are growing and take too much RAM space, ezPAARSE stores them in a mongoDB database to query the metadata associated with the proprietary identifiers. For that purpose, ezPAARSE runs "),t("a",{attrs:{href:"https://github.com/castorjs/castor-load",target:"_blank",rel:"noopener noreferrer"}},[e._v("CastorJS"),t("OutboundLink")],1),e._v(" in the background to keep the database and PKB files synchronized. This keeps the memory footprint of ezPAARSE at a minimum, but also requires additional startup time to perform the synchronization, especially on first startup.")]),e._v(" "),t("p",[e._v("Please note that processing logs without waiting for the initial synchronization to be over may result in incomplete enrichment of the access events.")]),e._v(" "),t("p",[t("strong",[e._v("Warning")]),e._v(": some ezPAARSE output formats will force you to explicitely ask for some information you are interested in. If you don't, you will only get a minimal set of information as a result. This is the case with the CSV output.\nOther output formats, like JSON, will automatically return all the data available.")])])}),[],!1,null,null,null);t.default=n.exports}}]);