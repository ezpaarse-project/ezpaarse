# Versions ezPAARSE #

## 0.0.7  ## 
##### 05/06/2013 - Consolidation du coeur #####
- meilleure caractérisation des EC (rtype, MIME, unitid)
- test de gros volume
- ajout de nouveaux parseurs (BMC, lamyline, lextenso, lexisnexis)
- refonte du formulaire avec métriques dynamiques
- accès aux traces et aux fichiers des lignes filtrées (formats non reconnus, domaines non reconnus, ...)

## 0.0.6  ## 
##### 18/04/2013 - Consolidation des reconnaissances de plateforme #####
- Passage en node V 0.10
- ajout de nouveaux parseurs (dalloz, wiley)
- ajout de nouvelles traces

## 0.0.5  ## 
##### 27/03/2013 - Utilisabilité d'ezPAARSE #####
- Mise à disposition d'un installeur Windows
- Mise en place d'un formulaire d'envoi des log

## 0.0.4  ## 
##### 21/02/2013 - Extension des cas d'usage #####
Extension de la reconnaissance des formats de log des fichiers de journalisations des serveurs mandataires (de type EZproxy, Bibliopam, Squid)

## 0.0.3  ## 
##### 31/01/2013 - Extension du domaine des parseurs #####

- Documentation précise de comment faire pour reconnaître des EC
- Développement de nouveaux parseurs pour différents types de plateformes
  - sd (Science Direct) : parseur pour plateforme sans base de connaissance, un identifiant normalisé est disponible dans l'URL
  - npg (Nature Publishing Group) : parseur pour plateforme avec base de connaissance, un identifiant interne est utilisé
  - edp (EDP Sciences) : parseur pour plateforme mono-revue (une plateforme correspond à une revue, mais les plateformes utilisent le même logiciel de mise en ligne)

## 0.0.2  ## 
##### 20/12/2012 - Installation générique #####
Installation du MVP produit au sprint 1 dans des environnements multiples (OS différents : Ubuntu, fedora, RedHat, Suse)

## 0.0.1  ## 
##### 06/12/2012 - Minimum Viable Product #####
Production d’événements de consultations (EC) à partir de fichiers de log pour la plateforme Science Direct via un web service RESTful

