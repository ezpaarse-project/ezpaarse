(window.webpackJsonp=window.webpackJsonp||[]).push([[89],{405:function(e,t,s){"use strict";s.r(t);var a=s(10),r=Object(a.a)({},(function(){var e=this,t=e._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h1",{attrs:{id:"how-to-use"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#how-to-use"}},[e._v("#")]),e._v(" How to use")]),e._v(" "),t("h2",{attrs:{id:"run-the-server"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#run-the-server"}},[e._v("#")]),e._v(" Run the server")]),e._v(" "),t("p",[e._v("ezPAARSE launches from the command line. Use the following commands from the installation directory to start and stop the server.")]),e._v(" "),t("p",[e._v("If you want to launch ezPAARSE without the web client, set the "),t("code",[e._v("EZPAARSE_NO_WEB_CLIENT")]),e._v(" environment variable with any value. This is not necessary if ezPAARSE has been installed without client dependencies.")]),e._v(" "),t("h3",{attrs:{id:"without-docker"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#without-docker"}},[e._v("#")]),e._v(" Without Docker")]),e._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[t("span",{pre:!0,attrs:{class:"token function"}},[e._v("make")]),e._v(" start   "),t("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# start the server")]),e._v("\n"),t("span",{pre:!0,attrs:{class:"token function"}},[e._v("make")]),e._v(" stop    "),t("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# stop the server")]),e._v("\n"),t("span",{pre:!0,attrs:{class:"token function"}},[e._v("make")]),e._v(" restart "),t("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# restart the server")]),e._v("\n"),t("span",{pre:!0,attrs:{class:"token function"}},[e._v("make")]),e._v(" status  "),t("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# check the server status")]),e._v("\n")])])]),t("h3",{attrs:{id:"with-docker-and-compose"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#with-docker-and-compose"}},[e._v("#")]),e._v(" With Docker and Compose")]),e._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[t("span",{pre:!0,attrs:{class:"token function"}},[e._v("docker")]),e._v(" compose up "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("-d")]),e._v("   "),t("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# start the server")]),e._v("\n"),t("span",{pre:!0,attrs:{class:"token function"}},[e._v("docker")]),e._v(" compose stop    "),t("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# stop the server")]),e._v("\n"),t("span",{pre:!0,attrs:{class:"token function"}},[e._v("docker")]),e._v(" compose restart "),t("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# restart the server")]),e._v("\n"),t("span",{pre:!0,attrs:{class:"token function"}},[e._v("docker")]),e._v(" compose "),t("span",{pre:!0,attrs:{class:"token function"}},[e._v("ps")]),e._v("      "),t("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# check the server status")]),e._v("\n")])])]),t("p",[t("strong",[e._v("NB")]),e._v(": for docker-compose version 1, replace "),t("code",[e._v("docker compose")]),e._v(" by "),t("code",[e._v("docker-compose")]),e._v(".")]),e._v(" "),t("h2",{attrs:{id:"use-with-web-client"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#use-with-web-client"}},[e._v("#")]),e._v(" Use with web client")]),e._v(" "),t("p",[e._v("Visit "),t("a",{attrs:{href:"http://localhost:59599/",target:"_blank",rel:"noopener noreferrer"}},[e._v("http://localhost:59599/"),t("OutboundLink")],1),e._v(" and create the first administrator of your local ezPAARSE instance. Administrators can manage the registered users and trigger updates from the web interface.")]),e._v(" "),t("p",[e._v("Once logged in, try drag-and-dropping a log file on the online form and processing it. If your logs are standard, you should be able to get a result immediately and see what ezPAARSE can produce for you.")]),e._v(" "),t("p",[e._v("Now you're up and ready to use ezPAARSE. Head onto the next section to learn about the basics.")]),e._v(" "),t("h2",{attrs:{id:"use-with-command-line"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#use-with-command-line"}},[e._v("#")]),e._v(" Use with command line")]),e._v(" "),t("p",[e._v("ezPAARSE ships with an utility called "),t("code",[e._v("ezp")]),e._v(", which allows for processing files through the command line. To make it available in your terminal, you'll need to load the ezPAARSE environment. This is done by sourcing the "),t("code",[e._v("bin/env")]),e._v(" file located in the installation directory:")]),e._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v("cd")]),e._v(" ezpaarse\n"),t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v(".")]),e._v(" bin/env\n")])])]),t("p",[e._v("Once the environment is loaded, you get access to the "),t("code",[e._v("ezp")]),e._v(" command:")]),e._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[e._v("ezp "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("--help")]),e._v("\n")])])]),t("p",[e._v("You can then use "),t("a",{attrs:{href:"#ezp-process"}},[e._v("ezp process")]),e._v(" to process a list of files, or "),t("a",{attrs:{href:"#ezp-bulk"}},[e._v("ezp bulk")]),e._v(" to process an entire directory in a more automated way.")]),e._v(" "),t("h3",{attrs:{id:"ezp-process"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#ezp-process"}},[e._v("#")]),e._v(" ezp process")]),e._v(" "),t("p",[e._v("Let you process one or more files with an instance of ezPAARSE. If no files are provided, the command will listen to "),t("code",[e._v("stdin")]),e._v(". The results are printed to "),t("code",[e._v("stdout")]),e._v(", unless you set an output file with "),t("code",[e._v("--out")]),e._v(".")]),e._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[e._v("Options:\n  --output, --out, "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("-o")]),e._v("       Output "),t("span",{pre:!0,attrs:{class:"token function"}},[e._v("file")]),e._v("\n  --header, --headers, "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("-H")]),e._v("   Add a header to the request "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),e._v("ex: "),t("span",{pre:!0,attrs:{class:"token string"}},[e._v('"'),t("span",{pre:!0,attrs:{class:"token variable"}},[t("span",{pre:!0,attrs:{class:"token variable"}},[e._v("`")]),e._v("Reject-Files: all"),t("span",{pre:!0,attrs:{class:"token variable"}},[e._v("`")])]),e._v('"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),e._v("\n  --download, "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("-d")]),e._v("            Download a "),t("span",{pre:!0,attrs:{class:"token function"}},[e._v("file")]),e._v(" from the job directory\n  --verbose, "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("-v")]),e._v("             Shows detailed operations.\n  --settings, "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("-s")]),e._v("            Set a predefined setting.\n")])])]),t("p",[e._v("Examples of use :")]),e._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# Simple case, process ezproxy.log and write results to result.csv")]),e._v("\nezp process ezproxy.log "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("--out")]),e._v(" result.csv\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# Same as above, and download the report file")]),e._v("\nezp process ezproxy.log "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("--out")]),e._v(" result.csv "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("--download")]),e._v(" report.json\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# Download the report file with a custom path")]),e._v("\nezp process ezproxy.log "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("--out")]),e._v(" result.csv "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("--download")]),e._v(" report.json:./reports/job-report.json\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# Reading from stdin and redirecting stdout to a file")]),e._v("\n"),t("span",{pre:!0,attrs:{class:"token function"}},[e._v("cat")]),e._v(" ezproxy.log "),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v("|")]),e._v(" ezp process "),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v(" result.csv\n")])])]),t("h3",{attrs:{id:"ezp-bulk"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#ezp-bulk"}},[e._v("#")]),e._v(" ezp bulk")]),e._v(" "),t("p",[e._v("Process files in "),t("code",[e._v("sourceDir")]),e._v(" and save results in "),t("code",[e._v("destDir")]),e._v(". If "),t("code",[e._v("destDir")]),e._v(" is not provided, results will be stored in "),t("code",[e._v("sourceDir")]),e._v(", aside the source files. When processing files recursively with the "),t("code",[e._v("-r")]),e._v(" option, "),t("code",[e._v("destDir")]),e._v(" will mimic the structure of "),t("code",[e._v("sourceDir")]),e._v(". Files will use the same or Files with existing results are skipped, unless the "),t("code",[e._v("--force")]),e._v(" flag is set. By default, the result file and the job report are downloaded, but you can get additionnal files from the job directory by using the "),t("code",[e._v("--download")]),e._v(" option.")]),e._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[e._v("Options:\n  --header, --headers, "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("-H")]),e._v("   Add a header to the request "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),e._v("ex: "),t("span",{pre:!0,attrs:{class:"token string"}},[e._v('"'),t("span",{pre:!0,attrs:{class:"token variable"}},[t("span",{pre:!0,attrs:{class:"token variable"}},[e._v("`")]),e._v("Reject-Files: all"),t("span",{pre:!0,attrs:{class:"token variable"}},[e._v("`")])]),e._v('"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),e._v("\n  --settings, "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("-s")]),e._v("            Set a predefined setting.\n  --recursive, "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("-r")]),e._v("           Look "),t("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("for")]),e._v(" log files into subdirectories\n  --download, "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("-d")]),e._v("            Download a "),t("span",{pre:!0,attrs:{class:"token function"}},[e._v("file")]),e._v(" from the job directory\n  --overwrite, --force, "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("-f")]),e._v("  Overwrite existing files\n  --verbose, "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("-v")]),e._v("             Shows detailed operations.\n  --list, "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("-l")]),e._v("                Only list log files "),t("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("in")]),e._v(" the directory\n")])])]),t("p",[e._v("Examples of use :")]),e._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# Simple case, processing files recursively from ezproxy-logs and storing results in ezproxy-results")]),e._v("\nezp bulk "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("-r")]),e._v(" ezproxy-logs/ ezproxy-results/\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# Activating reject files and downloading unqualified log lines along results")]),e._v("\nezp bulk "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("-r")]),e._v(" ezproxy-logs/ ezproxy-results/ "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("-H")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[e._v('"Reject-Files: all"')]),e._v(" "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[e._v("--download")]),e._v(" lines-unqualified-ecs.log\n")])])]),t("p",[e._v("A result file ("),t("code",[e._v(".ec.csv")]),e._v(" extension) and a report in JSON format (extension"),t("code",[e._v(".report.json")]),e._v(") are generated in the output directory for each log file. If the destination directory is not specified, they are generated in the same directory as the file being processed.\nIf an error occurs when processing a file, the incomplete result file is named with the "),t("code",[e._v(".ko")]),e._v(" extension.\nRejects files are not retained by ezPAARSE.")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("Inject files to ezPAARSE (for batch purpose)\n  Usage: /home/yan/ezpaarse/bin/ecbulkmaker [-rflvH] SOURCE_DIR [RESULT_DIR]\n\nOptions:\n  --recursive, -r  If provided, files in subdirectories will be processed. (preserves the file tree)\n  --list, -l       If provided, only list files.\n  --force, -f      override existing result (default false).\n  --header, -H     header parameter to use.\n  --verbose, -v    Shows detailed operations.\n\n")])])]),t("h3",{attrs:{id:"video-demonstration"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#video-demonstration"}},[e._v("#")]),e._v(" Video Demonstration")]),e._v(" "),t("p",[e._v("This "),t("a",{attrs:{href:"https://www.youtube.com/watch?v=5Tlk6GECSTI",target:"_blank",rel:"noopener noreferrer"}},[e._v("screencast"),t("OutboundLink")],1),e._v(" demonstrates the usage of ecbulkmaker (ie process a directory containing log files and outputting a mirror directory with the results)")])])}),[],!1,null,null,null);t.default=r.exports}}]);