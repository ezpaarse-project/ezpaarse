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
