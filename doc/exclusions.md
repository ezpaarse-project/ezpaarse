# Filtrage d'IPs et domaines #

ezPAARSE utilise plusieurs filtres afin de réduire le "bruit" engendré par les lignes de logs non pertinentes.

## Les consultations de robots ##
Par défaut, une base d'adresses IPs est utilisée pour détecter les consulations engendrées par des robots. Les lignes concernées sont rejetées.

Pour ajouter des adresses à considérer comme des robots, créez un fichier dans le répertoire `exclusions`. Son nom doit commencer par `robots.`, et doit contenir une adresse par ligne.

## Exclusions d'IPs arbitraires ##
Il est possible de filtrer volontairement des adresses pouvant être à l'origine de véritable consultations. Les lignes concernées sont rejetées dans un fichier différent de celui des robots.

Pour ajouter des adresses à filtrer, créez un fichier dans le répertoire `exclusions`. Son nom doit commencer par `hosts.`, et doit contenir une adresse par ligne.

## Les domaines non pertinents ##
Il est possible de filtrer les domaines de sites n'ayant pas de rapport avec la consultation de ressources numériques, de sorte que les lignes rejetées ne soient pas mélangées avec les lignes pertinentes pour lesquelles aucun parseur n'existe.

Pour ajouter des domaines à ignorer, créez un fichier dans le répertoire `exclusions`. Son nom doit commencer par `domains.`, et doit contenir un domaine par ligne.
