# Changelog #

## 3.0.0 - 3.0.6 ##
##### 2019/05/23 #####
- Update client interface
- Adding new features
- Code refactoring

## 2.13.0 - 2.14.3 ##
##### 2019/01/31 #####
- Display certifications (H and P) in platforms page
- Adding new methal module
- Fix csvextractor tests
- Update node version
- Update modules
- Replace mongo deprecated methods
- Fix pkb-cleaner
- Update DOC
- Update linter
- Update externals library
- Fix somes errors
- Update nvm installation

## 2.12.0 - 2.12.12 ##
##### 2018/08/22 #####
- Update node version
- Adding ezp command
- Update bower
- Adding new fields in ECs (ezpaarse, middlewares, platforms version)
- Update ISTEX tests
- Update npm version
- Fix ISTEX tests
- Fix HAL tests
- Update node version
- Update DOC
- Formatting code
- Adding tests (csv files)

## 2.11.1 ##
##### 2017/06/15 #####
- Update docker usage
- Update DOC

## 2.11.0 ##
##### 2017/06/06 #####
- Adding test
- Update nvm version
- Fix mongo connection

## 2.9.6 - 2.10.1 ##
##### 2017/04/03 #####
- Bug fix
- Update debian and mongo version
- Code refactoring
- Update DOC

## 2.9.5 - 2.9.6 ##
##### 2016/12/29 #####
- Updated DOC
- Text update

## 2.9.4 ##
##### 2016/11/16 #####
- Updated DOC

## 2.9.3 ##
##### 2016/09/27 #####
- Updated NodeJS and dependencies

## 2.9.2 ##
##### 2016/09/12 - bug fix #####
- Bug fix: basic connection dialog poping up on the login page

## 2.9.1 ##
##### 2016/09/09 - bug fix #####
- Added compatibility with [ezMASTER](https://github.com/Inist-CNRS/ezmaster)
- Bug fix: added missing dependency in production environments
- Bug fix: unstable results due to some problems in the read process

## 2.9.0 ##
##### 2016/08/30 - ezPLAAGE #####
- Bug fix: crash on startup when the PKBs had issues
- Access events have a new unique ID, created with a hash of their log line
- Similar values are now aggregated into a single field, no matter the source
- Ajax requests can now use all available headers
- Middlewares have been [externalized](https://github.com/ezpaarse-project/ezpaarse-middlewares)

## 2.8.1 ##
##### 2016/06/03 - bug fix #####
- Serverside timeout increased and configurable

## 2.8.0 ##
##### 2016/05/31 - ezMESURE - Halte ! Kibana #####
- Bug fix: error on module dependencies
- Bug fix: remove timeout on diluated logs files
- New ISTEX and cut middleware

## 2.7.0 ##
##### 2015/11/05 - Cash Enrichment #####
- Data caching of API requests from middlewares
- Enrichment activated by default

## 2.6.0 ##
##### 2015/10/08 - New BACON scraper tool #####
- Minor doc updates
- New BACON scraper tool

## 2.5.0 ##
##### 2015/09/03 - EC enrichment via APIs #####
- Automatic access events enrichment with crossref and elsevier
- Light Windows version

## 2.4.0 ##
##### 2015/06/11 - Optimized Installation - Docker #####
- Introduction of Docker for deploiment process
- New Windows version
- Filtering by middleware functionality

## 2.3.0 ##
##### 2015/04/09 - Minimal Viable Product for Open Access repositories #####
- IP addresses exclusion for indexing robots and spiders
- New form tab for a log format helper tool
- Multi-format deduplication
- Storing predefined parameters in the local instances

## 2.2.0 ##
##### 2015/02/05 - Large volume PKB management #####
- Optimizing the management of NoSQL PKB via castor-js
- Improving the initialization time of the application
- Ergonomic improvements in the angular form (file name, advanced headers, alert messages)

## 2.1.0 ##
##### 2014/10/31 - embedded NoSQL #####
- Update of semantic-UI
- NoSQL embedded in the castor branch
- Added generic profiles in the pre-defined parameters
- Added new parsers (for legal resources)
- Downloading a deduplicated unknown-domains file now possible

## 2.0.0 ##
##### 2014/09/01 - PKB Administration #####
- Visualization interface for the PKBs
- PKB updates possible in the admin section
- Software update in the admin section
- Deduplicating the PKBs tool
- MVP of a "my profile" page
- Addition of publisher_name in access events (for COUNTER reports exports)

## 1.9.0 ##
##### 2014/06/23 - Parsathon #####
- 50 parsers are now available
- Open Access repositories first approach

## 1.8.0 ##
##### 2014/03/13 - Minimal Viable Product for anomalies alerts #####
- End of processing notification
- Alert on the unknown-domains while processing

## 1.7.0 ##
##### 2014/03/13 - Web interface Validation #####
- New Web interface validation
- Platform-plugin Refactoring

## 1.6.0 ##
##### 2014/03/13 - Web interface redesign #####
- Web interface redesign with AngularJS
- Access events' Geolocation

## 1.5.0 ##
##### 2014/02/01 - KBART standardization #####
- PKBs' KBART standardization
- LibreOffice macro rendering

## 1.4.0 ##
##### 2014/01/30 - COUNTER Export #####
- COUNTER JR1 export
- non-usage information (denied accesses) now taken in account

## 1.3.0 ##
##### 2013/12/19 - Multilingualism #####
- multilingualism (web interface, windows installer)
- MVP COUNTER export

## 1.2.0 ##
##### 2013/11/14 - Security #####
- securing access to the web form (password protection possibility)

## 1.1.0 ##
##### 2013/10/10 - Minimal Viable Product for synchronising the Platform Knowledge Bases #####
- Reorganization of the git repos
- new repo for scrapers
- Automatic synchronization of the PKBs

## 1.0.0 ##
##### 2013/09/09 - Version 1.0 #####
- Windows packaging improvement, meeting the goal of demonstrating the steps from a log file to the macro rendering
- Browser bug correction

## 0.9.0 ##
##### 2013/08/08 - COUNTER deduplicating - candidate version 1 #####
- Publisher knowledge base automation / ezPAARSE tools
- better code quality
- COUNTER deduplicating for consultation events

## 0.8.0 ##
##### 2013/06/27 - Minimal Viable Product for the User Knowledge Bases #####
- management of User-Fields
- management of advanced options and predefined values in the form
- translation to cURL for the form actions (to allow for task-automation)
- new traces and bug corrections

## 0.7.0 ##
##### 2013/06/05 - Consolidation of the software's core #####
- better access events definition (rtype, MIME, unitid)
- testing for large log quantities
- new parsers (BMC, lamyline, lextenso, lexisnexis)
- form redesign with dynamic metrics
- access to traces and reject files (not recognized formats, unknown domains, etc)

## 0.6.0 ##
##### 2013/04/18 - Consolidation of plaftorms' recognitions #####
- upgrade to node v0.10
- new parsers (dalloz, wiley)
- new execution traces

## 0.5.0 ##
##### 2013/03/27 - ezPAARSE usability #####
- a windows installer is provided
- a form for submitting logs is provided

## 0.4.0 ##
##### 2013/02/21 - More use cases #####
More log formats are accepted by ezPAARSE: EZproxy, Bibliopam, Squid

## 0.3.0 ##
##### 2013/01/31 - More parsers #####

- Clear documentation describing how accesses events are recognized
- New parsers developped for various platforms
 - sd (Science Direct) : a parser without a knowledge base because a normalized identifier is found in the URL
 - npg (Nature Publishing Group) : a parser with a knowledge base because the publisher's platform uses proprietary identifiers
 - edp (EDP Sciences) : a parser for a platform that only publishes one journal (every journal is hosted on a distinct plaform but all platforms work the same way)

## 0.2.0 ##
##### 2012/12/20 - Generic installation #####
The MVP implemented in the first sprint can now be installed on various OSes: Ubuntu, fedora, RedHat, Suse

## 0.1.0 ##
##### 2012/12/06 - Minimum Viable Product #####
Accesses events are produced for ScienceDirect only from log files via a RESTful web service.
