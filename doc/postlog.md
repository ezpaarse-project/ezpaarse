### POST d'un log ###
Parse un fichier de log et retourne des évènements de consultation. L'opération se fait entièrement en streaming.
 
#### Requête ####

*POST /ws/ HTTP/1.1*

##### Paramètres #####
Aucun

##### Body #####

Fichier de log généré par un proxy.

[Doc EZProxy](http://www.oclc.org/support/documentation/ezproxy/cfg/logformat/)  
[Doc Squid](http://wiki.squid-cache.org/Features/LogFormat)

#### Réponse ####

##### Status code #####

  -   **204 No Content:** log parsé sans encombre.

##### Body #####

Json contenant l'ensemble des évènements de consultations générés.

Exemple d'évènement de consultation :

```
{
  "host": "1234567d6b8dd5dddc87939c4a407987",
  "login": "IDEXEMPLE",
  "date": "2011-12-31T10:42:42+01:00",
  "url": "http://www.une-adresse.com/exemple.php?id=16",
  "httpCode": "200",
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
```
