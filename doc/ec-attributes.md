# Attributs d'une EC #

## Identifiants de ressources ##

L'identifiant d'une ressource permet de caractériser les événements de consultations associés à cette ressource, il peut prendre les valeurs définies dans le tableau ci-dessous (chargées depuis [le paramétrage d'ezPAARSE](https://github.com/ezpaarse-project/ezpaarse/blob/master/platforms/rid.json)). Il est possible qu'une ressource soit caractérisée par plusieurs identifiants (par exemple un identifiant interne de l'éditeur et un ISBN).

<table>
  <tr><th>Code</th><th>Description</th><th>Commentaires</th></tr>
  <tr><td>pid</td><td>reconnaissance de l'identifiant éditeur</td><td>L'identifiant éditeur est ensuite utilisé avec la pkb (base de connaissance éditeur associée)</td></tr>
  <tr><td>issn</td><td>reconnaissance de l'ISSN</td><td></td></tr>
  <tr><td>doi</td><td>reconnaissance du DOI</td><td>Le DOI est ensuite utilisé pour retrouver un ISSN</td></tr>
  <tr><td>isbn</td><td>reconnaissance de l'ISBN</td><td></td></tr>
  <tr><td>eissn</td><td>reconnaissance de l'EISSN</td><td></td></tr>
  <tr><td>eisbn</td><td>reconnaissance de l'EISBN</td><td></td></tr>
  <tr><td>unitid</td><td>reconnaissance de l'unitid</td><td>unitid est l'identification la plus précise d'un événement de consultation</td></tr>
</table>

### Description de unitid ###

Unitid contient l'identifiant complet d'un événement de consultation sur une plateforme. Cet identifiant n'exclue pas l'usage d'autres identifiants, mais a un usage ciblé de dédoublonnage des EC dans leur ensemble selon leur type et permet d'obtenir des indicateurs utiles pour les documentalistes.

Il peut s'agir du DOI ou d'un identifiant plus complexe permettant de savoir le plus précisément possible ce qui a été consulté (par exemple un paragraphe d'un article d'une page d'un livre).

## Types de ressources ##

Le type d'une ressource permet de connaître la forme de la ressource et de caractériser les EC associés, il peut prendre les valeurs définies dans le tableau ci-dessous (chargées depuis [le paramétrage d'ezPAARSE](https://github.com/ezpaarse-project/ezpaarse/blob/master/platforms/rtype.json)).

<table>
  <tr><th>Code</th><th>Description</th><th>Commentaires</th></tr>
  <tr><td>ARTICLE</td><td>consultation d'un article</td><td></td></tr>
  <tr><td>ABS</td><td>consultation d'un résumé de l'article</td><td></td></tr>
  <tr><td>TOC</td><td>consultation d'un sommaire de numéro de revue</td><td></td></tr>
  <tr><td>BOOKSERIE</td><td>consultation d'un sommaire d'une monographie en série</td><td></td></tr>
  <tr><td>HANDBOOK</td><td>consultation d'un sommaire d'un handbook</td><td></td></tr>
  <tr><td>REF</td><td>consultation de référence de document</td><td></td></tr>
  <tr><td>ENCYCLOPEDIES</td><td>consultation d'une encyclopédie</td><td>Cas des bases de données juridiques</td></tr>
  <tr><td>CODES</td><td>consultation d'un code juridique</td><td>Cas des bases de données juridiques</td></tr>
  <tr><td>PREVIEW</td><td>consultation des premières lignes d'un article</td><td></td></tr>
  <tr><td>BOOKMARK</td><td>ajout de l'article dans un panier ou favoris</td><td>rencontré dans ajouter panier de cairn</td></tr>
  <tr><td>BOOK</td><td>consultation d'un ouvrage complet</td><td></td></tr>
  <tr><td>BOOK_SECTION</td><td>consultation d'une partie d'ouvrage</td><td></td></tr>
  <tr><td>FORMULES</td><td>consultation d'une formule juridique</td><td>Cas des bases de données juridiques</td></tr>
  <tr><td>BROCHES</td><td>consultation d'un livre broché</td><td>Cas des bases de données juridiques</td></tr>
</table>

## Formats de ressources ##

Le format d'une ressource permet de caractériser les EC associés, il peut prendre les valeurs définies dans le tableau ci-dessous (chargées depuis [le paramétrage d'ezPAARSE](https://github.com/ezpaarse-project/ezpaarse/blob/master/platforms/mime.json)).

<table>
  <tr><th>Code</th><th>Description</th><th>Commentaires</th></tr>
  <tr><td>PDF</td><td>consultation d'un document au format PDF</td><td></td></tr>
  <tr><td>HTML</td><td>consultation d'un document au format HTML</td><td></td></tr>
  <tr><td>MISC</td><td>consultation d'un document dont le format n'est ni PDF ni HTML</td><td></td></tr>
</table>