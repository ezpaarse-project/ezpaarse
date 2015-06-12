# ezPAARSE Versions #

## 2.3.0  ## 
##### 2015/04/09 - Minimal Viable Product for Open Access repositories #####
- Gestion de l'exclusion des adresses IP des robots
- Nouvel outil d'aide à la détermination du format de log
- Dédoublonnage inter-format
- mémorisation des prédéfinis dans les instances locales

## 2.2.0  ## 
##### 2015/02/05 - Large volume PKB management #####
- optimisation de la gestion NoSQL des PKB via castor-js
- amélioration des temps d'initialisation de l'application
- Améliorations ergonomiques du formulaire (nom de fichiers, headers avancés, messages d'alerte)

## 2.1.0  ## 
##### 2014/10/31 - embedded NoSQL #####
- Mise à jour de semantic-UI
- NoSQL embarqué dans la branche castor
- Ajout des génériques dans les pré-definis
- Ajout de nouveaux parseurs (juridique)
- Fichier des domaines inconnus téléchargeable

## 2.0.0  ## 
##### 2014/09/01 - PKB Administration #####
- Interface de visualisation des PKB
- Mise à jour via l'interface des PKB
- Mise à jour via l'interface du logiciel
- Outil de dédoublonnage des PKB
- MVP de la page mon profil
- ajout du publisher_name dans les EC

## 1.9.0  ## 
##### 2014/06/23 - Parsathon #####
- Reconnaissance de 50 plateformes
- Debut de travail Open Access

## 1.8.0  ## 
##### 2014/03/13 - Minimal Viable Product for anomalies alerts #####
- Notification de fin de traitement
- Alerte sur domaine inconnu dans le traitement

## 1.7.0  ## 
##### 2014/03/13 - Web interface Validation #####
- Validation de l'interface Web
- Refactoring platform-plugin

## 1.6.0  ## 
##### 2014/03/13 - Web interface redesign #####
- Refonte de l'interface Web avec AngularJS
- Geolocalisation des ECs

## 1.5.0  ## 
##### 2014/02/01 - KBART standardization #####
- normalisation KBART des PKB
- version Libre Office de la macro de rendu

## 1.4.0  ## 
##### 2014/01/30 - COUNTER Export #####
- export COUNTER JR1
- gestion des informations de non-usage

## 1.3.0  ## 
##### 2013/12/19 - Multilingualism #####
- multilinguisme (interface, version windows)
- MVP export COUNTER

## 1.2.0  ## 
##### 2013/11/14 - Security #####
- sécurisation des accès aux pages (possiblité de protection par mot de passe)

## 1.1.0  ## 
##### 2013/10/10 - Minimal Viable Product for synchronising the Platform Knowledge Bases #####
- réorganisation des modules de dépôt
- apport des scrapers (génération automatique de PKB)
- gestion de la synchronisation automatique des PKB

## 1.0.0  ## 
##### 2013/09/09 - Version 1.0 #####
- Windows packaging improvement, meeting the goal of demonstrating the steps from a log file to the macro rendering
- Browser bug correction

## 0.9.0  ## 
##### 2013/08/08 - COUNTER deduplicating - candidate version 1 #####
- Publisher knowledge base automation / ezPAARSE tools
- better code quality
- COUNTER deduplicating for consultation events

## 0.8.0  ## 
##### 2013/06/27 - Minimal Viable Product for the User Knowledge Bases #####
- management of User-Fields
- management of advanced options and predefined values in the form
- translation to cURL for the form actions (to allow for task-automation)
- new traces and bug corrections

## 0.7.0  ## 
##### 2013/06/05 - Consolidation of the software's core #####
- better ECs definition (rtype, MIME, unitid)
- testing for large log quantities
- new parsers (BMC, lamyline, lextenso, lexisnexis)
- form redesign with dynamic metrics
- access to traces and reject files (not recognized formats, unknown domains, etc)

## 0.6.0  ## 
##### 2013/04/18 - Consolidation of plaftorms' recognitions #####
- upgrade to node v0.10
- new parsers (dalloz, wiley)
- new execution traces 

## 0.5.0  ## 
##### 2013/03/27 - ezPAARSE usability #####
- a windows installer is provided
- a form for submitting logs is provided

## 0.4.0  ## 
##### 2013/02/21 - More use cases #####
More log formats are accepted by ezPAARSE: EZproxy, Bibliopam, Squid

## 0.3.0  ## 
##### 2013/01/31 - More parsers #####

- Clear documentation describing how accesses events are recognized
- New parsers developped for various platforms
  - sd (Science Direct) : a parser without a knowledge base because a normalized identifier is found in the URL
  - npg (Nature Publishing Group) : a parser with a knowledge base because the publisher's platform uses proprietary identifiers
  - edp (EDP Sciences) : a parser for a platform that only publishes one journal (every journal is hosted on a distinct plaform but all platforms work the same way)

## 0.2.0  ## 
##### 2012/12/20 - Generic installation #####
The MVP implemented in the first sprint can now be installed on various OSes: Ubuntu, fedora, RedHat, Suse

## 0.1.0  ## 
##### 2012/12/06 - Minimum Viable Product #####
Accesses events are produced for ScienceDirect only from log files via a RESTful web service.

