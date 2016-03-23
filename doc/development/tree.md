# ezPAARSE folder structure #


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
├── locales [i18n]
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
├── platforms [platform plugin directory]
│   ├── .lib [common stuff]
│   ├── <.platform.>
│   │   ├── test
│   │   ├── pkb [KBART files]
│   │   │   ├── <.platform.>_AllTitles_<.YYYY-MM-DD.>.txt
│   │   │   └── <...>
│   │   └── scrapers [KBART files generators]
│   │       ├── scrape_<.platform.>_<.file.>.js
│   │       └── <...>
│   └── <...>
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
