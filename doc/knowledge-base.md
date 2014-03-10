# Les bases de connaissance #

## Qu'est-ce qu'une PKB ? ##
Une **PKB** (traduisez _Publisher Knowledge Base_) est une liste de correspondances associant des métadonnées aux identifiants de ressources propres à un éditeur. Elle permet notamment d'obtenir le/les identifiants normalisés d'une ressource (ISSN, DOI...), ou encore son titre.  

Une **PKB** se présente sous la forme d'un ou plusieurs fichiers [texte au format tabulé](http://fr.wikipedia.org/wiki/Tabulation-separated_values).
Ce fichier respecte le [format KBART](http://www.couperin.org/groupes-de-travail-et-projets-deap/acces-aux-ressources-cat/bases-de-connaissances/kbart) destiné à améliorer la chaine d’alimentation des données des résolveurs de liens et des bases de connaissance afin de perfectionner leur fonctionnement et d’augmenter l’efficacité du processus de construction de liens OpenURL.

Le champ KBART **title_id** correspondant à l'identifiant éditeur des ressources permet d'établir la correspondance avec un identifiant normalisé **print_identifier** (la plupart du temps l'ISSN papier) ou **online_identifier** (dans le cas d'une version numérique), et peut avoir un nombre indéfini de colonnes supplémentaires placées après les champs KBART en fonction de la richesse des métadonnées disponibles (les champs supplémentaires sont préfixés par pkb- par exemple pkb-domain) .

Pour être reconnaissables par ezPAARSE, les fichiers d'une PKB doivent avoir respecter la nomenclature KBART **[ProviderName]\_*[Region/Consortium]*\_[PackageName]\_[YYYY-MM-DD].txt**, et se trouver dans un dossier dont le nom correspond à la plateforme (ex: **sd** pour Science Direct).  

Exemples :  
cairn/cairn_ebooks_2014-02-13.txt
cairn/cairn_journals_part1_2014-02-13.txt

**Attention** : les identifiants d'une PKB **doivent être uniques**. Si un identifiant est présent à plusieurs endroits, dans un ou plusieurs fichiers de la base de connaissance, **une seule occurrence** sera utilisée.

## Comment sont-elles utilisées ? ##
Lorsqu'une ressource avec un identifiant éditeur (_title_id_) est rencontrée, la base de connaissance associée à ce dernier est construite à partir des fichiers pkb KBART, et chargée en mémoire. Dès lors, ezPAARSE cherchera des correspondances avec les identifiants de cet éditeur, et ajoutera l'ensemble des métadonnées résultantes aux événements de consultations générés.  

**Attention** : certains formats de sortie d'ezPAARSE vous obligeront à demander explicitement l'affichage des données qui vous intéressent, sans quoi seules les informations essentielles vous seront retournées. C'est par exemple le cas de la sortie CSV. D'autres, comme le format JSON, afficheront systématiquement l'ensemble des données disponibles.

## Les PKB-miss ##
Lorsqu'ezPAARSE rencontre un identifiant éditeur pour lequel il ne trouve pas de correspondance dans la PKB associée, il le renseigne dans un fichier appelé **PKB-miss**. Ce dernier est similaire à un fichier de PKB, à ceci près que les identifiants qu'il contient sont ceux pour lesquels il n'existe **aucune correspondance**. Ceci permet d'identifier plus facilement les manques d'une base de connaissance en vue de la compléter.  

Le fichier PKB-miss est créé à côté des fichiers de PKB, et est nommé comme suit : le nom court de la plate-forme, suivie de l'extension **.pkb.miss.txt**. (ex: sd.pkb.miss.txt)