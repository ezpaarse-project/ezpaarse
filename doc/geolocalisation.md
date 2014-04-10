### Geolocalisation ###

La géolocalisation est basée sur l'adresse IP contenue dans le champ host trouvé dans les fichiers de log.
Les headers `Geoip-Localization` et `Geoip-Output-Fields` permettent d'en contrôler le comportement.

La librairie utilisée pour la géolocalisation est [geoip-lite](https://github.com/bluesmoon/node-geoip).


#### Paramètres (headers) ####

* **Geoip-Localization:** renvoi des informations de géolocalisation dans les résultats. La géolocalisation se base sur l'adresse IP contenue dans le champ `host` et est activée par défaut mais peut être désactivée en positionnant ce paramètre à `none`. 
Les paramètres possibles sont :
    * `none` : desactivé
    * `geoip-lookup` : (défaut) résoud les adresses IP uniquement
    * `dns-lookup` : résoud les adresses IP et les noms de domaine (potentiellement 30% plus long, attention aux accès DNS)
* **Geoip-Output-Fields:** liste des informations de géolocalisation dans les résultats. Par défaut `geoip-longitude, geoip-latitude, geoip-country`. `all` peut être utilisé pour renvoyer tous les champs possibles soit l'équivalent de `geoip-host, geoip-addr, geoip-family, geoip-country, geoip-region, geoip-city, geoip-latitude, geoip-longitude` .

Exemple d'usage :
```shell
curl -v -X POST --proxy "" --no-buffer \
  -F "file=@test/dataset/geolocalize.log" \
  -H 'Geoip-Localization: dns-lookup'\
  -H 'Geoip-Output-Fields: all' \
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
  -H 'Geoip-Output-Fields: geoip-latitude, geoip-longitude' \
  -H 'Geoip-Localization: geoip-lookup' \
  -H 'Output-Fields: -doi,-identd,-url,-status,-size,+datetime' \
  | csv2geojson --lat "geoip-latitude" --lon "geoip-longitude" --delimiter ";" 2> /dev/null \
  | geojsonio
```

Qui ouvre votre navigateur avec la visualisation suivante :

<img src="images/ezPAARSE-SR16-02.jpg" alt="EDP Sciences Anonyme" style="width: 600px"/>

