# Outils #

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

TODO

...