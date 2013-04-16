### POST d'un log ###
Parse un fichier de log et retourne des évènements de consultation. L'opération se fait entièrement en streaming.
 
#### Requête ####

*POST / HTTP/1.1*

##### Paramètres #####
-   **Content-Encoding:** encodage des données envoyées. *(supportés : gzip, deflate)*  
-   **Accept-Encoding:** encodage des données renvoyées par le serveur. *(supportés : gzip, deflate)*  
-   **Accept:** format de sortie. Sont supportés :  
  - text/csv (par défaut).
  - application/json.
-   **Log-Format-*xxx*:** format des lignes de log en entrée, dépend du proxy *xxx* utilisé. [Voir les formats disponibles](./formats.html).
-   **Date-Format:** format de date utilisé dans les logs envoyés. Par défaut : 'DD/MMM/YYYY:HH:mm:ss Z'.  
-   **Anonymize-host:** anonymise la valeur du host des lignes de log. Par défaut : 'none'. *(supportés : md5, none)*.  
-   **Anonymize-login:** anonymise la valeur du login des lignes de log. Par défaut : 'none'. *(supportés : md5, none)*.  
-   **Output-Fields:** champs à retrouver dans les données en sortie (si le format le permet). [(Plus de détails)](./outputfields.html)  
-   **Traces-Level:** détermine le niveau de verbosité des traces liées au fonctionnement d'ezPAARSE. Les niveaux les plus bas incluent les plus élevés.  
Niveaux disponibles :
  - **error** : erreurs bloquantes entraînant une interruption anormale du traitement.  
  - **warn** : erreurs sans incidence sur le traitement.  
  - **info** : informations générales (format demandé, notification de fin de réponse, nombre d'ECs générés...).  
  - **verbose** : plus précis qu'info, notifie plus finement les étapes du traitement.  
  - **silly** : tous détails du traitement (parseur non trouvé, ligne ignorée, recherche non fructueuse dans une PKB...).  

##### Body #####

Fichier de log généré par un proxy.

[Doc EZProxy](http://www.oclc.org/support/documentation/ezproxy/cfg/logformat/)  
[Doc Squid](http://www.squid-cache.org/Doc/config/logformat/)

#### Réponse ####

##### Status code #####

-   **200 OK:** logs traités avec succès.
-   **400 Bad Request:** un élément de la requête rend impossible le traitement des logs.
-   **406 Not Acceptable:** encodage ou format de sortie non supporté.

##### Headers #####
-   **Job-ID:** contient l'identifiant unique associé au traitement.  

Headers contenant des URLs d'accès aux logs :  

-   **Job-Traces:** traces du fonctionnement d'ezPAARSE. (verbosité modifiable via le header Traces-Level)  
-   **Job-Unknown-Formats:** lignes dont le format n'a pas été reconnu.  
-   **Job-Ignored-Domains:** lignes dont le domaine est ignoré.  
-   **Job-Unknown-Domains:** lignes dont le domaine n'est pas associé à un parseur.  
-   **Job-Unqualified-ECs:** lignes ayant généré des ECs trop pauvres en information.  
-   **Job-PKB-Miss-ECs:** lignes ayant généré des identifiants introuvables dans la PKB de la plateforme associée.  

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
curl -X POST http://127.0.0.1:59599 --no-buffer --data-binary @file.log -v
curl -X POST --proxy "" --no-buffer --data-binary @test/dataset/sd.2012-11-30.log  http://127.0.0.1:59599 -v
curl -X POST --proxy "" --no-buffer -H "Accept: application/json" --data-binary @test/dataset/sd.2012-11-30.log  http://127.0.0.1:59599 -v
```
