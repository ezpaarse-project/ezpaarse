### POST d'un log ###
Parse un fichier de log et retourne des évènements de consultation. L'opération se fait entièrement en streaming.
 
#### Requête ####

*POST /ws/ HTTP/1.1*

##### Paramètres #####
-   **Content-Encoding:** encodage des données envoyées. *(supportés : gzip, deflate)*  
-   **Accept-Encoding:** encodage des données renvoyées par le serveur. *(supportés : gzip, deflate)*  
-   **Accept:** format de sortie. Sont supportés :  
    - text/csv (par défaut).
    - application/json.
-   **LogFormat-*xxx*:** format des lignes de log en entrée, dépend du proxy *xxx* utilisé. [Voir les formats disponibles](./formats.html).
-   **DateFormat:** format de date utilisé dans les logs envoyés. Par défaut : 'DD/MMM/YYYY:HH:mm:ss Z'.  
-   **Anonymise-host:** anonymise la valeur du host des lignes de log. Par défaut : 'md5'. *(supportés : md5, none)*.  
-   **Anonymise-login:** anonymise la valeur du login des lignes de log. Par défaut : 'none'. *(supportés : md5, none)*.  

##### Body #####

Fichier de log généré par un proxy.

[Doc EZProxy](http://www.oclc.org/support/documentation/ezproxy/cfg/logformat/)  
[Doc Squid](http://www.squid-cache.org/Doc/config/logformat/)

#### Réponse ####

##### Status code #####

  -   **200 OK:** logs traités avec succès.
  -   **400 Bad Request:** un élément de la requête rend impossible le traitement des logs.
  -   **406 Not Acceptable:** encodage ou format de sortie non supporté.

##### Body #####

CSV ou Json contenant l'ensemble des évènements de consultation générés.

Exemple d'évènement de consultation :

```
{
  "host": "1234567d6b8dd5dddc87939c4a407987",
  "login": "IDEXEMPLE",
  "date": "2011-12-31T10:42:42+01:00",
  "url": "http://www.une-adresse.com/exemple.php?id=16",
  "status": "200",
  "size": "0",
  "domain": "www.une-adresse.com",
  "type": "PDF",
  "issn": "1111-1111"
}
```

#### Exemple de requête ####
```shell
curl -X POST http://127.0.0.1:59599/ws/ --no-buffer --data-binary @file.log -v
curl -X POST --proxy "" --no-buffer --data-binary @test/dataset/sd.2012-11-30.log  http://127.0.0.1:59599/ws/ -v
curl -X POST --proxy "" --no-buffer -H "Accept: application/json" --data-binary @test/dataset/sd.2012-11-30.log  http://127.0.0.1:59599/ws/ -v
```
