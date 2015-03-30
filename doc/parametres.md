# Parameters #

The ezPAARSE treatments can be congured using HTTP headers. Please find below the list of available headers.


### Content-Encoding ###
Encoding of the data sent  *(supported : gzip, deflate)*  

### Response-Encoding ###
Encoding of the data sent back by server. *(supported : gzip, deflate)*  

### Accept ###
Output format. Supported :
  - text/csv (by default)
  - text/tab-separated-values (for a TSV output : as CSV but tab-delimited)
  - application/json
  - application/jsonstream (one JSON object per line)

### Log-Format-xxx ###
Format of the log lines in input, depend on the proxy *xxx* used. [See the available formats](./formats.html)

### Date-Format ###
Date format used in the logs sent. Default is : 'DD/MMM/YYYY:HH:mm:ss Z'.  

### Anonymize-host ###
Anonymizes the values found as 'host' in the logfile. By default : 'none'. *(supported : md5, none)*

### Anonymize-login ###
Anynymizes the values found as 'login' in the logfile. By default : 'none'. *(supported : md5, none)*

### Output-Fields ###
To specify the fields to include in the output (if the format allows it). [(More information)](./outputfields.html)  

### Traces-Level ###
Allows to specify the verbosity level desired for ezPAARSE's feedback. The higher levels include the lower ones.
Niveaux disponibles :
  - **error** : blocking errors, abnormal treatment termination.  
  - **warn** : errors not fatal to the treatment.  
  - **info** : general informations (requested format, ending notification, number of ECs generated...).  
  - **verbose** : more precise than info, gives more information about each stage of the treatment.  
  - **silly** : every detail of the treatment (parser not found, line ignored, unsuccessful search in a pkb...).  


### Reject-Files ###
List of the reject files to create, separated by commas. (`none` by default, `all`)
Possible values : Unknown-Formats, Ignored-Domains, Unknown-Domains, Unqualified-ECs, PKB-Miss-ECs, Duplicate-ECs, Unordered-ECs, Filtered-ECs, Ignored-Hosts, Robots-ECs.

### User-field[n]-xxx ###
Extacts user information from a field of the imput logfile [(More information)](./userfields.html).

### Double-Click-xxx ###
Précision des paramètres utilisés pour réaliser le dédoublonnage [(plus de détails)](./doubleclick.html).  

### Request-Charset ###
Jeu de caractères utilisé dans les données en entrée [(voir les encodages supportés)](https://github.com/ashtuchkin/iconv-lite#supported-encodings).  

### Response-Charset ###
Jeu de caractères utilisé pour le résultat. [(voir les encodages supportés)](https://github.com/ashtuchkin/iconv-lite#supported-encodings).  

### Clean-Only ###
Si placé à `true`, ezPAARSE se contentera de filtrer les lignes de log inutiles, et retournera les lignes pertinentes.  

### Relative-Domain ###
Si des URLs relatives sont rencontrées, elle seront considérées comme appartenant à ce domaine (et seront donc traitées par le parseur correspondant).  

### COUNTER-Reports ###
Liste des rapports COUNTER à générer (ex: JR1,BR2). Les liens de téléchargement sont accessibles dans la section `stats` du raport de traitement. [(plus de détails)](./counter.html) 

### COUNTER-Format ###
Format des rapports COUNTER : `XML` (par défaut) ou `CSV`.  

### COUNTER-Customer ###
Nom et/ou email du client à renseigner dans les rapports, sous la forme `nom`, `<email>` ou `nom<email>`. (Par défaut `ezPAARSE<mail de l'administrateur>`)  

### COUNTER-Vendor ###
Nom et/ou email de l'éditeur à renseigner dans les rapports, sous la forme `nom`, `<email>` ou `nom<email>`. (Par défaut `platform42`, sans mail)  

### Geoip ###
Liste d'informations de géolocalisation à ajouter aux résultats. Par défaut `geoip-longitude, geoip-latitude, geoip-country`. `all` peut être utilisé pour renvoyer tous les champs possibles, ou `none` pour désactiver la géolocalisation. [(plus de détails)](./geolocalisation.html)

### ezPAARSE-Job-Notifications ###
Liste de notifications à envoyer en fin de traitement, sous la forme `action<cible>` et séparées par des virgules. Actuellement disponible : `mail<adresse>`

### ezPAARSE-Enrich ###
Indiquer `false` pour désactiver l'enrichissement (geoip et bases de connaissances). Toute autre valeur laisse l'enrichissement actif.

### ezPAARSE-Predefined-Settings ###
Indique à ezPAARSE qu'il doit utiliser les paramètres prédéfinis correspondant à la clé donnée. Ex: `inist` pour le paramétarge de l'INIST-CNRS. ([voir liste complète](/info/predefined-settings))

### ezPAARSE-Filter-Redirects ###
Set false to prevent lines with HTTP status codes 301, 302 from being filtered and discarded.

### Disable-Filters ###
Disable filters applying to robots or arbitrary hosts/domains. (defaults to `none`).  
Possible values (separated by commas) : `robots`, `ignored-hosts`, `ignored-domains`.  
Set to `all` to disable all above filters.  

**NB**: when robots are not filtered, add the `robot` field to the output in order to know which consultations were made by robots.
