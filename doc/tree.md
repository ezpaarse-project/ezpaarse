# Arborescence ezPAARSE #


<pre>
.
├── bin [ezpaarse ecosystem binaries commands]
├── doc [markdown documentation source files]
│   ├── images
│   └── templates [beautiful doc templates]
├── lib [javascript modules]
│   ├── bin
│   ├── init
│   ├── logformats
│   ├── outputformats
│   └── proxyformats
├── locales [multilinguisme]
│   ├── en.json
│   └── fr.json
├── logs
├── misc 
│   ├── deb [debian stuff]
│   │   ├── DEBIAN
│   │   └── etc
│   │       ├── init.d
│   │       └── logrotate.d
│   ├── gource [software version control visualisation]
│   │   └── avatars
│   ├── pkb-scrapers [automatic pkb creation scripts]
│   ├── shell-with-require
│   └── windows [windows stuff]
├── node_modules [modules for nodejs]
│   ├── ...
├── platforms-parsers [parsers directory]
│   ├── .lib [common parser stuff]
│   ├── <.platform.>
│   │   └── test
│   ├── <...>
├── platforms-kb [platform knoledge base directory]
│   ├── <.platform.>
│   │   └── <.platform.>_<.file.>.pkb.csv>
│   ├── <...>
├── platforms-scrapers [scrapers directory (to generate pkb files)]
│   ├── .lib [common scraper stuff]
│   ├── <.platform.>
│   │   └── scrape_<.platform.>_<.file.>.js
│   ├── <...>
├── public [static web pages]
│   ├── doc
│   │   └── images
│   ├── img
│   ├── js
│   └── stylesheets
├── routes [REST routes files]
├── test [test files and data]
│   └── dataset
│       └── multiformat
├── tmp
│   └── jobs
└── views [express/ejs templates directory]
</pre>