# Outils #

## loginjector

Commande permettant d'envoyer un fichier de log en streaming vers une instance locale d'ezPAARSE. Le fichier de log doit être envoyé sur l'entrée système (stdin) de la commande.

Exemple d'utilisation:
```bash
zcat monezproxy.log.gz | ./bin/loginjector
```

Usage:
```
Usage: node ./bin/loginjector
```

Cette commande simplifie l'envoi des logs vers l'instance d'ezPAARSE par rapport à l'utilisation de la commande cURL.

## logextractor

Commande permettant d'extraire un ou des champs d'un fichier de log. Le fichier de log doit être envoyé sur l'entrée système (stdin) de la commande.

Exemples d'utilisation:
```bash
zcat monezproxy.log.gz | ./bin/logextractor --field=url
zcat monezproxy.log.gz | ./bin/logextractor --field=login,url --separator="|"
```

Usage:
```
Usage: node ./bin/logextractor --field=[string] --separator=";"
```

Cette commande est utile pour manipuler les fichiers de logs. Un usage récurrent est l'extraction des URL d'un fichier de log pour pouvoir analyser une plate-forme d'un éditeur. Voici par exemple comment procéder pour récupérer les URL concernant la plate-forme sciencedirect en les triant alphabétiquement et en les dédoublonnant :
```bash
zcat monezproxy.log.gz | ./bin/logextractor --field=url | grep "sciencedirect" | sort | uniq
```

## loganonymizer

Commande permettant d'anonymiser un fichier de log. Les éléments sensibles comme le login identifié ou le nom de machine sont remplacés par des valeurs aléatoires. Le fichier de log doit être envoyé sur l'entrée système (stdin) de la commande.

Exemple d'utilisation:
```bash
zcat monezproxy.log.gz | ./bin/loganonymizer
```

Usage:
```
Usage: node ./bin/loganonymizer
```

Cette commande est utile pour constituer des fichiers de test en y retirant les éléments sensibles liés à la protection des données personnelles. Chaque valeur est remplacée par la même valeur aléatoire de façon à pouvoir faire les associations et dédoublonnages nécessaires aux traitements.

## csvtotalizer

Commande permettant de produire un résumé du contennu d'un fichier CSV résultat d'un traitement d'ezPAARSE. Le fichier CSV doit être envoyé sur l'entrée système (stdin) de la commande.

Exemple d'utilisation:
```bash
cat monresultat.csv | ./bin/csvtotalizer
```

Usage:
```
Usage: node ./bin/csvtotalizer --fields=domain,host,login,type --output=text|json
```

Cette commande est utile pour avoir un aperçu rapide du résultat du traitement d'un fichier de log par ezPAARSE.
Par défaut, les champs domain,host,login et type sont proposés en format texte.
Voici par exemple comment savoir combien d'événements de consultation différents ont été reconnu dans un fichier exemple :
```bash
cat ./test/dataset/sd.2012-11-30.300.log | ./bin/loginjector | ./bin/csvtotalizer
```
