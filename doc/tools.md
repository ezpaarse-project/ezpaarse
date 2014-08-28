# Outils #


## platform-init
Commande servant à créer la structure de base d'une plateforme. Pose une série de questions puis crée l'arborescence de la plateforme avec le fichier manifest.json, un squelette de parseur et un fichier de test vide. La commande est interactive et ne nécessite aucun paramètre.

Usage:
```
cd ezpaarse/
. ./bin/env
platform-init
```

## loginjector

Commande permettant d'envoyer un fichier de log en streaming vers une instance locale d'ezPAARSE.

Exemple d'utilisation:
```bash
zcat monezproxy.log.gz | ./bin/loginjector
```

Usage:
```
Inject data into ezPAARSE and gets the response
Usage: node ./loginjector

Options:
  --input, -i     a file to inject into ezPAARSE (default: stdin)
  --output, -o    a file to send the result to (default: stdout)
  --server, -s    the server to send the request to (ex: http://ezpaarse.com:80). If none, will send to a local instance.
  --proxy, -p     the proxy which generated the log file
  --format, -f    the format of log lines (ex: %h %u [%t] "%r")
  --encoding, -e  encoding of sent data (gzip, deflate)
  --accept, -a    wanted type for the response (text/csv, application/json)
```

Cette commande simplifie l'envoi des logs vers l'instance d'ezPAARSE par rapport à l'utilisation de la commande cURL.

## loganonymizer

Commande permettant d'anonymiser un fichier de log. Les éléments sensibles comme le login identifié ou le nom de machine sont remplacés par des valeurs aléatoires. Le fichier de log doit être envoyé sur l'entrée système (stdin) de la commande.

Exemple d'utilisation:
```bash
zcat monezproxy.log.gz | ./bin/loganonymizer
```

Usage:
```
Anonymize critical data in a log file
Usage: node ./loganonymizer --input=[string] --output=[string] --proxy=[string] --format[string]

Options:
  --input, -i   the input data to clean                      
  --output, -o  the destination where to send the result to  
  --proxy, -p   the proxy which generated the log file       
  --format, -f  the format of log lines (ex: %h %u [%t] "%r")
```

Cette commande est utile pour constituer des fichiers de test en y retirant les éléments sensibles liés à la protection des données personnelles. Chaque valeur est remplacée par la même valeur aléatoire de façon à pouvoir faire les associations et dédoublonnages nécessaires aux traitements.


## logextractor

Commande permettant d'extraire un ou des champs d'un fichier de log. Le fichier de log doit être envoyé sur l'entrée système (stdin) de la commande.

Exemples d'utilisation:
```bash
zcat monezproxy.log.gz | ./bin/logextractor --fields=url
zcat monezproxy.log.gz | ./bin/logextractor --fields=login,url --separator="|"
```

Usage:
```
Extract specific fields from a log stream
Usage: node ./logextractor --fields=[string] --separator=";"

Options:
  --fields, -f            fields to extract from log lines (ex: url,login,host)  [required]
  --separator, --sep, -s  character to use between each field                    [required]  [default: "\t"]
  --input, -i             a file to extract the fields from (default: stdin)   
  --output, -o            a file to write the result into (default: stdout)
  --proxy, -p             the proxy which generated the log file               
  --format, -t            the format of log lines (ex: %h %u [%t] "%r")        

```

Cette commande est utile pour manipuler les fichiers de logs. Un usage récurrent est l'extraction des URL d'un fichier de log pour pouvoir analyser une plate-forme d'un éditeur. Voici par exemple comment procéder pour récupérer les URL concernant la plate-forme sciencedirect en les triant alphabétiquement et en les dédoublonnant :
```bash
zcat monezproxy.log.gz | ./bin/logextractor --field=url | grep "sciencedirect" | sort | uniq
```

## csvextractor

Commande permettant du contenu d'un fichier CSV. Le fichier CSV doit être envoyé sur l'entrée système (stdin) de la commande.

Exemple d'utilisation:
```bash
cat monfichier.csv | ./bin/csvextractor
```

Usage:
```
Parse a csv source into json.
  Usage: node csvextractor [-sc] [-f string | -d string | -k string]

Options:
  --file, -f    A csv file to parse. If absent, will read from standard input.                  
  --fields, -d  A list of fields to extract. Default extract all fields. (Ex: --fields issn,pid)
  --key, -k     If provided, the matching field will be used as a key in the resulting json.    
  --silent, -s  If provided, empty values or unexisting fields won't be showed in the results.  
  --csv, -c     If provided, the result will be a csv.                                          
```

Cette commande est utile pour tester le parseur directement à partir du fichier de test en extrayant la colonne URL du fichier.

Exemple de test direct du parseur:
```bash
cat ./test/npg.2013-01-16.csv | ../../bin/csvextractor --fields='url' -c | ./parser.js 
```

## csvtotalizer

Commande permettant de produire un résumé du contenu d'un fichier CSV résultat d'un traitement d'ezPAARSE. Le fichier CSV doit être envoyé sur l'entrée système (stdin) de la commande.

Exemple d'utilisation:
```bash
cat monresultat.csv | ./bin/csvtotalizer
```

Usage:
```
Totalize fields from a CSV stream
Usage: node ./bin/csvtotalizer --fields=[string] --output="text|json"

Options:
  --output, -o  output : text or json                                        [required]  [default: "text"]
  --sort, -s    sort : asc or desc in text mode                              [required]  [default: "desc"]
  --fields, -f  fields to compute from the CSV (ex: domain;host;login;type)  [required]  [default: "domain;host;login;type"]
```

Cette commande est utile pour avoir un aperçu rapide du résultat du traitement d'un fichier de log par ezPAARSE.
Par défaut, les champs domain,host,login et type sont proposés en format texte.
Voici par exemple comment savoir combien d'événements de consultation différents ont été reconnu dans un fichier exemple :
```bash
cat ./test/dataset/sd.2012-11-30.300.log | ./bin/loginjector | ./bin/csvtotalizer
```

## logfaker

Commande permettant de produire sur stdout un flux correspondant à des lignes de log d'une plateforme donnée en paramètre.

Exemple d'utilisation:
```bash
./logfaker | ./loginjector
```

Usage:
```
Usage: node ./logfaker --platform=[string] --nb=[num] --rate=[num] --duration=[num]

Options:
  --platform      the publisher platform code used as a source for generating url  [required]  [default: "sd"]
  --nb, -n        number of lines of log to generate                               [required]  [default: "nolimit"]
  --rate, -r      number of lines of log to generate per second (max 1000)         [required]  [default: 10]
  --duration, -d  stop log generation after a specific number of seconds           [required]  [default: "nolimit"]
```

Cette commande est utile pour tester les performances d'ezPAARSE.

## pkbvalidator

Commande permettant de vérifier la validité des informations présentes dans un fichier de base de connaissance d'une plateforme.
Ce fichier doit être conforme au format KBART.

Cette commande vérifie les points suivants :

- présence de l'extension du nom de fichier .txt
- unicité du title_id
- information minimale d'identification disponible
- contrôle syntaxique de l'écriture des identifiants normalisés (ISSN, ISBN, DOI)

Usage:
```
Check a platform knowledge base file.
  Usage: node ./bin/pkbvalidator [-cfsv] pkb_file1.txt [pkb_file2.txt]

Options:
  --silent, -s   If provided, no output generated.           
  --csv, -c      If provided, the error-output will be a csv.
  --verbose, -v  show stats of checking.                     
```


## ecmaker

Commande permettant de lancer un traitement batch d'un fichier de log sur l'instance ezPAARSE locale.

Exemple d'utilisation test via logfaker avec l'entrée standard :
```bash
./logfaker -d 5 | ./ecmaker

ll tmp
ecmake-2014-01-29_11-08-15.ec.csv
ecmake-2014-01-29_11-08-15.report.html
```
Par defaut un fichier résultat et un fichier rapport statique sont générés dans le repertoire destination.

Exemple d'utilisation réelle avec un fichier de log :
```bash
./ecmaker --input=/home/ubuntu/ezpaarse/test/dataset/sd.2012-11-30.300.log --outpath=tmp/test

ll tmp/test
sd.2012-11-30.300.ec.csv
sd.2012-11-30.300.report.html
```
Par defaut un fichier résultat (extension ec.csv) et un fichier rapport statique (extension report.html) sont générés dans le repertoire destination.

```
Usage:
Inject a file to ezPAARSE (for batch purpose)
  Usage: node ./bin/ecmaker [-hiofvH]

Options:
  --input, -i    Input log file (if omited, wait for standard input)
  --outpath, -o  If provided, output directory (default tmp).       
  --force, -f    override existing result (default false).          
  --headers, -H  headers parameters to use.                         
  --verbose, -v  Shows detailed operations.                                             
```

## ecbulkmaker

Commande permettant de lancer un traitement batch de fichiers de log contenus dans un répertoire sur l'instance ezPAARSE locale.  

Exemple d'utilisation :
```bash
./ecbulkmaker -r /applis/stats/home/archives/fede/bibliovie/2013 /applis/stats/home/ezresults/fede/bibliovie/2013

```
Un fichier résultat (extension `.ec.csv`) et un rapport au format HTML (extension `.report.html`) sont générés dans le repertoire de destination pour chaque fichier de log. Si le répertoire de destination n'est pas présicé, ils sont générés au même endroit que le fichier traité.  
Si une erreur survient lors du traitement d'un fichier, le fichier résultat incomplet est renommé avec l'extension `.ko`.  
Les fichiers de rejets ne sont pas conservés par ezPAARSE.  

```
Inject files to ezPAARSE (for batch purpose)
  Usage: /home/yan/ezpaarse/bin/ecbulkmaker [-rflvH] SOURCE_DIR [RESULT_DIR]

Options:
  --recursive, -r  If provided, files in subdirectories will be processed. (preserves the file tree)
  --list, -l       If provided, only list files.
  --force, -f      override existing result (default false).
  --header, -H     header parameter to use.
  --verbose, -v    Shows detailed operations.

```
## hostlocalize

Commande permettant d'enrichir un fichier résultat ezpaarse csv contenant un nom d'hôte avec la localisation issue de l'adresse IP

Exemple d'utilisation :
```bash
./hostlocalize -f ezpaarsedata.csv > ezpaarsedatalocalised.csv 

```
Le fichier en entrée est supposé comporter un champ contenant l'adresse ip à utiliser pour la localisation
```
Enrich a csv with geolocalisation from host ip.
  Usage: node ./bin/hostlocalize [-s] [-f string | -k string]

Options:
  --hostkey, -k  the field name containing host ip (default "host").           
  --file, -f     A csv file to parse. If absent, will read from standard input.

```
