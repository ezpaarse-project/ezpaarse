# Tree structure


```
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
├── client [frontend application]
├── logs
├── middlewares [middleware modul directory]
│   ├── <.modul.>
│   │   └── index.js
│   └── crossref
│       └── index.js
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
├── mail-templates [emails templates]
├── platforms [platform plugin directory]
│   ├── .lib [common stuff]
│   ├── <.platform.>
│   │   ├── test
│   │   ├── pkb [KBART files]
│   │   │   ├── <.platform.>_AllTitles_<.YYYY-MM-DD.>.txt
│   │   │   └── <...>
│   │   ├── scrapers [KBART files generators]
│   │   │    ├── scrape_<.platform.>_<.file.>.js
│   │   │    └── <...>
│   │   └── parser.js
│   ├── wiley
│   │   ├── test
│   │   ├── pkb [KBART files]
│   │   │   ├── wiley_journals_2016-11-14.txt
│   │   │   └── wiley_Books_2016-11-14.txt
│   │   ├── scrapers [KBART files generators]
│   │   │    ├── scrape_wiley_books_from_xls.js
│   │   │    └── scrape_wiley_journals_from_xls.js
│   │   └── parser.js
│   └── <...>
├── public [static web pages]
│   ├── doc
│   │   └── images
│   ├── img
│   ├── js
│   └── stylesheets
├── recources [Resources that should be updated independently from ezPAARSE]
│   ├── README.md
│   ├── auto-formats.js
│   └── predefined-settings.json
├── routes [REST routes files]
├── test [test files and data]
│   └── dataset
│       └── multiformat
├── tmp
│   └── jobs
```
