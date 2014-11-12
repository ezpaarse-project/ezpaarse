### Geolocalisation ###

La géolocalisation est basée sur l'adresse IP contenue dans le champ host des fichiers de log. Le header `Geoip` permet de choisir les données à ajouter aux résultats, ou de désactiver la géolocalisation.

La librairie utilisée est [geoip-lite](https://github.com/bluesmoon/node-geoip).

**Réserves sur la géolocalisation** : la géolocalisation par adresse IP est une méthode qui permet de déterminer la position géographique d'un terminal connecté à internet en se basant sur son adresse IP. Un niveau de précision de l'ordre de la ville est possible, mais parfois seul le pays est trouvé. Les données de [géolocalisation sont informatives](http://fr.wikipedia.org/wiki/G%C3%A9olocalisation#G.C3.A9olocalisation_par_adresse_IP_.28sur_internet.29) du fait des aléas liés à leur determination : elles dépendent du fournisseur d'accès internet avec une gestion différente selon les pays.

#### Paramètres (headers) ####

* **Geoip:** liste des informations de géolocalisation à ajouter aux résultats. Par défaut `geoip-longitude, geoip-latitude, geoip-country`. `all` peut être utilisé pour renvoyer tous les champs possibles, ou `none` pour désactiver la géolocalisation. Champs possibles : `geoip-host`, `geoip-addr`, `geoip-family`, `geoip-country`, `geoip-region`, `geoip-city`, `geoip-latitude`, `geoip-longitude`.

Exemple d'usage :
```shell
curl -v -X POST --proxy "" --no-buffer \
  -F "file=@test/dataset/geolocalize.log" \
  -H 'Geoip: all' \
 	http://127.0.0.1:59599
```
Exemple d'usage évolué :

Cet exemple utilise les librairies ''csv2geojson'' et ''geojsonio-cli''.

```shell
npm install csv2geojson geojsonio-cli
```
Par la suite il est possible de visualiser directement sur une carte le résultat du traitement 
```shell
curl -X POST http://127.0.0.1:59599 \
  --proxy "" \
  --no-buffer \
  --data-binary @./test/dataset/edp.2013-01-23.log  \
  -H 'Geoip: geoip-latitude, geoip-longitude' \
  -H 'Output-Fields: -doi,-identd,-url,-status,-size,+datetime' \
  | csv2geojson --lat "geoip-latitude" --lon "geoip-longitude" --delimiter ";" 2> /dev/null \
  | geojsonio
```

Qui ouvre votre navigateur avec la visualisation suivante :

<img src="images/ezPAARSE-SR16-02.jpg" alt="EDP Sciences Anonyme" style="width: 600px"/>

