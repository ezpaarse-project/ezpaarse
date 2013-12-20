# Versions ezPAARSE #

## 1.3.0  ## 
##### 19/12/2013 - Multilinguisme #####
- multilinguisme (interface, version windows)
- MVP export COUNTER

## 1.2.0  ## 
##### 14/11/2013 - Sécurisation #####
- sécurisation des accès aux pages (possiblité de protection par mot de passe)

## 1.1.0  ## 
##### 10/10/2013 - Produit Minimum Viable de synchronisation des Platform Knowledge Bases #####
- réorganisation des modules de dépôt
- apport des scrapers (génération automatique de PKB)
- gestion de la synchronisation automatique des PKB

## 1.0.0  ## 
##### 09/09/2013 - Version 1 #####
- amélioration du package windows : objectif de démonstration d'usage du fichier de log jusqu'au rendu tableur
- correction de bug lié au navigateur

## 0.9.0  ## 
##### 08/08/2013 - Dédoublonnage COUNTER des événements de consultation - candidate version 1 #####
- automatisation pkb/outil ezPAARSE
- amélioration de la qualité du code
- dédoublonnage COUNTER des événements de consultation

## 0.8.0  ## 
##### 27/06/2013 - Produit Minimum Viable des User Knowledge Base #####
- gestion des User-Fields
- gestion des options avancées/valeurs pré-définies dans le formulaire
- traduction des requêtes produites par le formulaire en cURL en vue d'automatisation des traitements
- ajout de traces, corrections de bug

## 0.7.0  ## 
##### 05/06/2013 - Consolidation du coeur #####
- meilleure caractérisation des EC (rtype, MIME, unitid)
- test de gros volume
- ajout de nouveaux parseurs (BMC, lamyline, lextenso, lexisnexis)
- refonte du formulaire avec métriques dynamiques
- accès aux traces et aux fichiers des lignes filtrées (formats non reconnus, domaines non reconnus, ...)

## 0.6.0  ## 
##### 18/04/2013 - Consolidation des reconnaissances de plateforme #####
- Passage en node V 0.10
- ajout de nouveaux parseurs (dalloz, wiley)
- ajout de nouvelles traces

## 0.5.0  ## 
##### 27/03/2013 - Utilisabilité d'ezPAARSE #####
- Mise à disposition d'un installeur Windows
- Mise en place d'un formulaire d'envoi des log

## 0.4.0  ## 
##### 21/02/2013 - Extension des cas d'usage #####
Extension de la reconnaissance des formats de log des fichiers de journalisations des serveurs mandataires (de type EZproxy, Bibliopam, Squid)

## 0.3.0  ## 
##### 31/01/2013 - Extension du domaine des parseurs #####

- Documentation précise de comment faire pour reconnaître des EC
- Développement de nouveaux parseurs pour différents types de plateformes
  - sd (Science Direct) : parseur pour plateforme sans base de connaissance, un identifiant normalisé est disponible dans l'URL
  - npg (Nature Publishing Group) : parseur pour plateforme avec base de connaissance, un identifiant interne est utilisé
  - edp (EDP Sciences) : parseur pour plateforme mono-revue (une plateforme correspond à une revue, mais les plateformes utilisent le même logiciel de mise en ligne)

## 0.2.0  ## 
##### 20/12/2012 - Installation générique #####
Installation du MVP produit au sprint 1 dans des environnements multiples (OS différents : Ubuntu, fedora, RedHat, Suse)

## 0.1.0  ## 
##### 06/12/2012 - Minimum Viable Product #####
Production d'événements de consultations (EC) à partir de fichiers de log pour la plateforme Science Direct via un web service RESTful

