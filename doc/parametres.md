# Paramètres de traitement #

Les traitements d'ezPAARSE sont configurables en utilisant des headers HTTP. Vous trouverez ci-dessous la liste des headers disponibles.


### Content-Encoding ###
Encodage des données envoyées. *(supportés : gzip, deflate)*  

### Response-Encoding ###
Encodage des données renvoyées par le serveur. *(supportés : gzip, deflate)*  

### Accept ###
Format de sortie. Sont supportés :  
  - text/csv (par défaut)
  - text/tab-separated-values (pour une sortie TSV : comme CSV mais avec tabulations)
  - application/json
  - application/jsonstream (un objet json par ligne)

### Log-Format-xxx ###
Format des lignes de log en entrée, dépend du proxy *xxx* utilisé. [Voir les formats disponibles](./formats.html).

### Date-Format ###
Format de date utilisé dans les logs envoyés. Par défaut : 'DD/MMM/YYYY:HH:mm:ss Z'.  

### Anonymize-host ###
Anonymise la valeur du host des lignes de log. Par défaut : 'none'. *(supportés : md5, none)*.  

### Anonymize-login ###
Anonymise la valeur du login des lignes de log. Par défaut : 'none'. *(supportés : md5, none)*.  

### Output-Fields ###
Champs à retrouver dans les données en sortie (si le format le permet). [(Plus de détails)](./outputfields.html)  

### Traces-Level ###
Détermine le niveau de verbosité des traces liées au fonctionnement d'ezPAARSE. Les niveaux les plus bas incluent les plus élevés.  
Niveaux disponibles :
  - **error** : erreurs bloquantes entraînant une interruption anormale du traitement.  
  - **warn** : erreurs sans incidence sur le traitement.  
  - **info** : informations générales (format demandé, notification de fin de réponse, nombre d'ECs générés...).  
  - **verbose** : plus précis qu'info, notifie plus finement les étapes du traitement.  
  - **silly** : tous détails du traitement (parseur non trouvé, ligne ignorée, recherche non fructueuse dans une PKB...).  


### Reject-Files ###
Liste des fichiers de rejet à générer, séparés par des virgules. (aucun par défaut, `all` pour tous)  
Valeurs possibles : Unknown-Formats, Ignored-Domains, Unknown-Domains, Unqualified-ECs, PKB-Miss-ECs, Duplicate-ECs, Unordered-ECs, Filtered-ECs, Ignored-Hosts, Robots-ECs.

### User-field[n]-xxx ###
Extraction des informations utilisateurs d'un champ des logs en entrée [(plus de détails)](./userfields.html).  

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
