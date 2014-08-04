# Routes #

ezPAARSE est une application RESTful.  
**REST**: Representational State Transfer

## Soumission de log ##
La route principale d'ezPAARSE, elle correspond à la **racine** du service web. La méthode **GET** donne accès au formulaire de soumission de logs, et la méthode **POST** permet de soumettre des logs. Les fichiers soumis sont parsés et des événements de consultation sont envoyés en retour. L'opération se fait entièrement en streaming.

<table>
  <tr>
      <th style="text-align:left;width:140px;">PATH</th>
      <th> GET </th>
      <th> POST </th>
  </tr>
  <tr>
    <td>/</td>
    <td>Formulaire de soumission</td>
    <td>Parse un fichier de log</td>
  </tr>
</table>

 
### Détail de la requête POST ###

*POST / HTTP/1.1*

#### Paramètres (headers) ####
-   **Content-Encoding:** encodage des données envoyées. *(supportés : gzip, deflate)*  
-   **Accept-Encoding:** encodage des données renvoyées par le serveur. *(supportés : gzip, deflate)*  
-   **Accept:** format de sortie. Sont supportés :  
  - text/csv (par défaut)
  - text/tab-separated-values (pour une sortie TSV : comme CSV mais avec tabulations)
  - application/json
  - application/jsonstream (une ligne de json par ligne)
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

-   **Reject-Files:** liste des fichiers de rejet à générer, séparés par des virgules. (ou `none` pour les désactiver)  
Valeurs possibles : Unknown-Formats, Ignored-Domains, Unknown-Domains, Unqualified-ECs, PKB-Miss-ECs, Duplicate-ECs, Unordered-ECs.
-   **User-fieldN-xxxx:** extraction des informations utilisateurs d'un champ des logs en entrée [(plus de détails)](./userfields.html).  
-   **Double-Click-xxxx:** précision des paramètres utilisés pour réaliser le dédoublonnage [(plus de détails)](./doubleclick.html).  
-   **Request-Charset:** jeu de caractères utilisé dans les données en entrée [(voir les encodages supportés)](https://github.com/ashtuchkin/iconv-lite#supported-encodings).  
-   **Response-Charset:** jeu de caractères utilisé pour le résultat. [(voir les encodages supportés)](https://github.com/ashtuchkin/iconv-lite#supported-encodings).  
-   **Clean-Only:** si placé à `true`, ezPAARSE se contentera de filtrer les lignes de log inutiles, et retournera les lignes pertinentes.  
-   **Relative-Domain:** si des URLs relatives sont rencontrées, elle seront considérées comme appartenant à ce domaine (et seront donc traitées par le parseur correspondant).  
-   **COUNTER-Reports:** liste des rapports COUNTER à générer (ex: JR1,BR2). Les liens de téléchargement sont accessibles dans la section `stats` du raport de traitement. [(plus de détails)](./counter.html) 
-   **COUNTER-Format:** format des rapports COUNTER : `XML` (par défaut) ou `CSV`.  
-   **COUNTER-Customer:** nom et/ou email du client à renseigner dans les rapports, sous la forme `nom`, `<email>` ou `nom<email>`. (Par défaut `ezPAARSE<mail de l'administrateur>`)  
-   **COUNTER-Vendor:** nom et/ou email de l'éditeur à renseigner dans les rapports, sous la forme `nom`, `<email>` ou `nom<email>`. (Par défaut `platform42`, sans mail)  
-   **Geoip-Localization:** renvoi des informations de géolocalisation dans les résultats. La géolocalisation se base sur l'adresse IP contenue dans le champ `host` et est activée par défaut mais peut être désactivée en positionnant ce paramètre à `none`. [(plus de détails)](./geolocalisation.html)
-   **Geoip-Output-Fields:** liste des informations de géolocalisation dans les résultats. Par défaut `geoip-longitude, geoip-latitude, geoip-country`. `all` peut être utilisé pour renvoyer tous les champs possibles.
-   **ezPAARSE-Job-Notifications:** liste de notifications à envoyer en fin de traitement, sous la forme `action<cible>` et séparées par des virgules. Actuellement disponible : `mail<adresse>`
-   **ezPAARSE-Enrich:** indiquer `false` pour désactiver l'enrichissement (geoip et bases de connaissances). Toute autre valeur laisse l'enrichissement actif.
-   **ezPAARSE-Buffer-Size:** permet de changer la taille du buffer (taille des paquets d'ECs à envoyer aux parseurs). `100` par défaut. Le mettre à zéro revient à désactiver le buffering. Cette option est utile pour générer des ECs instantanément au moment même où la ligne de log pertinente est reçue.



#### Body ####

Lignes de log générées par un proxy.

[Doc EZProxy](http://www.oclc.org/support/documentation/ezproxy/cfg/logformat/)  
[Doc Squid](http://www.squid-cache.org/Doc/config/logformat/)

### Réponse à une requête POST ###

#### Status code ####

-   **200 OK:** logs traités avec succès.
-   **400 Bad Request:** un élément de la requête rend impossible le traitement des logs.
-   **406 Not Acceptable:** encodage ou format de sortie non supporté.

#### Headers ####
-   **Job-ID:** identifiant unique associé au traitement.  
-   **Job-Report:** URL du rapport détaillé sur le traitement. Ce rapport inclut tous les headers envoyés par ezPAARSE.  
-   **ezPAARSE-Status:** code de retour d'ezPAARSE en cas d'erreur. ([liste des codes](/info/codes))  
-   **ezPAARSE-Status-Message:** message explicatif sur le code retour.  

Headers contenant des URLs d'accès aux logs :  

-   **Job-Traces:** traces du fonctionnement d'ezPAARSE. (verbosité modifiable via le header Traces-Level)  
-   **Lines-Unknown-Formats:** lignes dont le format n'a pas été reconnu.  
-   **Lines-Ignored-Domains:** lignes dont le domaine est ignoré.  
-   **Lines-Unknown-Domains:** lignes dont le domaine n'est pas associé à un parseur.  
-   **Lines-Unqualified-ECs:** lignes ayant généré des ECs trop pauvres en information. [(Plus de détails)](./qualification.html)  
-   **Lines-PKB-Miss-ECs:** lignes ayant généré des identifiants introuvables dans la PKB de la plateforme associée.  
-   **Lines-Duplicate-ECs:** lignes filtrées par l'algorithme de détection des doubles-clics.  
-   **Lines-Unordered-ECs:** lignes rejetées pour cause de rupture de l'ordre chronologique.  

#### Body ####

CSV ou JSON contenant l'ensemble des événements de consultation générés.

Exemple d'événement de consultation :

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

### Exemple de requêtes ###
```shell
curl -X POST http://127.0.0.1:59599 --no-buffer --data-binary @file.log -v
curl -X POST --proxy "" --no-buffer --data-binary @test/dataset/sd.2012-11-30.log  http://127.0.0.1:59599 -v
curl -X POST --proxy "" --no-buffer -H "Accept: application/json" --data-binary @test/dataset/sd.2012-11-30.log  http://127.0.0.1:59599 -v
```

## Consultation des traces/rejets ##

Lors du traitement d'un job (requête), ezPAARSE génère des fichiers informatifs liés à son activité. Ces derniers peuvent être consultés en utilisant l'identifiant unique attribué au job.

<table>
    <tr>
        <th style="text-align:left;width:240px;">PATH</th>
        <th>Information retournée</th>
    </tr>
    <tr>
      <td>/{jobID}/job-traces.log</td>
      <td>Traces du fonctionnement interne d'ezPAARSE. Ne présente d'utilité qu'en cas de comportement anormal du traitement.</td>
    </tr>
    <tr>
      <td>/{jobID}/job-report.(json|html)</td>
      <td>Rapport regroupant diverses informations sur le traitement : nombre de lignes rejetées, taux de rejet, date et longueur du traitement...L'usage sous la forme /{jobID}/job-report.html?standalone=1 permet de générer un rapport html indépendant</td>
    </tr>
    <tr>
      <td>/{jobID}/lines-unknown-formats.log</td>
      <td>Lignes dont le format n'a pas été reconnu.</td>
    </tr>
    <tr>
      <td>/{jobID}/lines-ignored-domains.log</td>
      <td>Lignes dont le domaine est ignoré.</td>
    </tr>
    <tr>
      <td>/{jobID}/lines-unknown-domains.log</td>
      <td>Lignes dont le domaine n'est pas associé à un parseur.</td>
    </tr>
    <tr>
      <td>/{jobID}/lines-unqualified-ecs.log</td>
      <td>Lignes ayant généré des ECs trop pauvres en information. [(Plus de détails)](./qualification.html)</td>
    </tr>
    <tr>
      <td>/{jobID}/lines-pkb-miss-ecs.log</td>
      <td>Lignes ayant généré des identifiants introuvables dans la PKB de la plateforme associée.</td>
    </tr>
    <tr>
      <td>/{jobID}/lines-duplicate-ecs.log</td>
      <td>Lignes filtrées par l'algorithme de détection des doubles-clics.</td>
    </tr>
    <tr>
      <td>/{jobID}/lines-unordered-ecs.log</td>
      <td>Lignes rejetées pour cause de rupture de l'ordre chronologique.</td>
    </tr>
</table>

####Légende####

- jobID: identifiant unique attribué au job.

## Infos générales ##
Ces routes permettent de récupérer diverses informations, comme la liste des plateformes et les types d'événements générés. Elles supportent uniquement la méthode *GET*.

<table>
    <tr>
        <th style="text-align:left;width:140px;">URL</th>
        <th>Information retournée</th>
    </tr>
    <tr>
      <td>/info/platforms</td>
      <td>Liste les plateformes disponibles</td>
    </tr>
    <tr>
      <td>/info/rid</td>
      <td>Liste les identifiants de ressources</td>
    </tr>
    <tr>
      <td>/info/rtype</td>
      <td>Liste les types de ressources</td>
    </tr>
    <tr>
      <td>/info/mime</td>
      <td>Liste les formats de ressources</td>
    </tr>
    <tr>
      <td>/info/codes</td>
      <td>Liste les codes de retour de l'application et leur signification</td>
    </tr>
    <tr>
      <td>/info/codes/{code}</td>
      <td>Retourne la signification d'un code</td>
    </tr>
    <tr>
      <td>/info/form-predefined</td>
      <td>Liste de valeurs prédéfinies pour les options avancées du formulaire</td>
    </tr>
    <tr>
      <td>/info/usage</td>
      <td>Statistiques d'usage général</td>
    </tr>
</table>

## Administration ##
Ces routes servent à administrer ezPAARSE, et sont pour la plupart utilisables via la page admin de l'appplication. Elles requièrent toutes une authentification, à l'exception de /register.

<table>
    <tr>
        <th style="text-align:left;width:140px;">PATH</th>
        <th style="text-align:left;width:80px;">Méthode</th>
        <th>Utilisation</th>
    </tr>
    <tr>
      <td>/register</td>
      <td>POST</td>
      <td>Permet de créer le premier administrateur. Ne fonctionne pas si un ou plusieurs utilisateurs sont déjà enregistrés.
        <br/>Paramètres: <strong>username</strong>, <strong>password</strong></td>
    </tr>
    <tr>
      <td>/pkb/status</td>
      <td>GET</td>
      <td>Donne l'état des bases de connaissance
        <br/>Retourne: <strong>uptodate</strong> ou <strong>outdated</strong></td>
    </tr>
    <tr>
      <td>/pkb/status</td>
      <td>PUT</td>
      <td>Met à jour les bases de connaissance
        <br/>Le body doit contenir <strong>uptodate</strong></td>
    </tr>
    <tr>
      <td>/parsers/status</td>
      <td>GET</td>
      <td>Donne l'état des parseurs
        <br/>Retourne: <strong>uptodate</strong> ou <strong>outdated</strong></td>
    </tr>
    <tr>
      <td>/parsers/status</td>
      <td>PUT</td>
      <td>Met à jour les parseurs
        <br/>Le body doit contenir <strong>uptodate</strong></td>
    </tr>
    <tr>
      <td>/users</td>
      <td>GET</td>
      <td>Retourne la liste des utilisateurs locaux</td>
    </tr>
    <tr>
      <td>/users/</td>
      <td>POST</td>
      <td>Crée un utilisateur local
        <br/>Paramètres: <strong>username</strong>, <strong>password</strong></td>
    </tr>
    <tr>
      <td>/users/{username}</td>
      <td>DELETE</td>
      <td>Supprime un utilisateur local</td>
    </tr>
</table>
