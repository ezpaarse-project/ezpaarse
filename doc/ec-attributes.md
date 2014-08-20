# Attributs d'un EC #

## Identifiants de ressources ##

L'identifiant d'une ressource permet de caractériser les événements de consultations qui lui sont associés, il peut prendre les valeurs définies dans le tableau ci-dessous (chargées depuis [le paramétrage d'ezPAARSE](https://github.com/ezpaarse-project/ezpaarse-platforms/blob/master/rid.json)). Il est possible qu'une ressource soit caractérisée par plusieurs identifiants (par exemple un identifiant interne de l'éditeur et un ISBN).

<div>
  <table class="inline">
    <tbody id="ridTable">
      <tr class="row0">
        <th class="col0">Code</th><th class="col1">Description</th><th class="col2">Commentaires</th>
      </tr>
    </tbody>
  </table>
</div>

<script type="text/javascript">
jQuery(document).ready(function($) {
  var dom_ec = $('#ridTable');
  $.ajax({
    url: "http://ezpaarse.couperin.org/info/rid?sort=asc",
    dataType: 'json'
  }).done(function(rids) {
    $.each(rids, function (i, rid) {
      var line = '<tr class="row' + i + '"><td class="col0">' + rid.code + '</td><td class="col1">' + rid.description + '</td><td class="col2">' + rid.comment + '</td></tr>';
      dom_ec.append(line);
    });
  }).error(function() {
    var line = '<tr class="row1"><td class="col0" colspan="3" style="color: red">Erreur lors de la récupération des données</td></tr>';
    dom_ec.append(line);
  });

});
</script>

### Description de unitid ###

Le unitid contient l'identifiant le plus précis (qui décrit la granularité la plus fine) pour un événement de consultation sur une plateforme. Cet identifiant n'exclut pas l'usage d'autres identifiants. Il est utilisé pour le dédoublonnage des EC selon la norme [COUNTER](http://www.projectcounter.org/) en vigueur et permet d'obtenir des indicateurs utiles pour les documentalistes.

Il peut s'agir du DOI ou d'un identifiant plus complexe permettant de savoir le plus précisément possible ce qui a été consulté (par exemple : un paragraphe d'un article d'une page d'un livre).

## Types de ressources (rtype) ##

Le type d'une ressource permet de connaître la forme de la ressource et de caractériser les EC associés, il peut prendre les valeurs définies dans le tableau ci-dessous (chargées depuis [le paramétrage d'ezPAARSE](https://github.com/ezpaarse-project/ezpaarse-platforms/blob/master/rtype.json)).

<div>
  <table class="inline">
    <tbody id="rtypeTable">
      <tr class="row0">
        <th class="col0">Code</th><th class="col1">Description</th><th class="col2">Commentaires</th>
      </tr>
    </tbody>
  </table>
</div>

<script type="text/javascript">
jQuery(document).ready(function($) {
  var dom_ec = $('#rtypeTable');
  $.ajax({
    url: "http://ezpaarse.couperin.org/info/rtype?sort=asc",
    dataType: 'json'
  }).done(function(rtypes) {
    $.each(rtypes, function (i, rtype) {
      var line = '<tr class="row' + i + '"><td class="col0">' + rtype.code + '</td><td class="col1">' + rtype.description + '</td><td class="col2">' + rtype.comment + '</td></tr>';
      dom_ec.append(line);
    });
  }).error(function() {
    var line = '<tr class="row1"><td class="col0" colspan="3" style="color: red">Erreur lors de la récupération des données</td></tr>';
    dom_ec.append(line);
  });

});
</script>

## Formats de ressources (mime) ##

Le format d'une ressource permet de caractériser les EC associés, il peut prendre les valeurs définies dans le tableau ci-dessous (chargées depuis [le paramétrage d'ezPAARSE](https://github.com/ezpaarse-project/ezpaarse-platforms/blob/master/mime.json)).

<div>
  <table class="inline">
    <tbody id="mimeTable">
      <tr class="row0">
        <th class="col0">Code</th><th class="col1">Description</th><th class="col2">Commentaires</th>
      </tr>
    </tbody>
  </table>
</div>

<script type="text/javascript">
jQuery(document).ready(function($) {
  var dom_ec = $('#mimeTable');
  $.ajax({
    url: "http://ezpaarse.couperin.org/info/mime?sort=asc",
    dataType: 'json'
  }).done(function(mimes) {
    $.each(mimes, function (i, mime) {
      var line = '<tr class="row' + i + '"><td class="col0">' + mime.code + '</td><td class="col1">' + mime.description + '</td><td class="col2">' + mime.comment + '</td></tr>';
      dom_ec.append(line);
    });
  }).error(function() {
    var line = '<tr class="row1"><td class="col0" colspan="3" style="color: red">Erreur lors de la récupération des données</td></tr>';
    dom_ec.append(line);
  });

});
</script>
