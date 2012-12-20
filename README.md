# Démarrage rapide #

ezPAARSE se présente sous la forme d'un Web service dans lequel vous pourrez injecter vos logs et récupérer les évènements de consultation correspondants. Voici une procédure simplifiée décrivant comment installer ezPAARSE sur votre serveur.

## Pré-requis ##

Voici les outils dont vous avez besoin pour faire fonctionner ezPAARSE :

* Système d'exploitation Linux : [voir les pré-requis selon les versions] (https://github.com/ezpaarse-project/ezpaarse/blob/master/doc/multi-os.md)
* Outils standards Linux : bash, make, grep, sed ... 
* curl (utilisé par nvm)
* git >= 1.7.10 (pour être compatible avec github)

Remarque : nous préconiserons prochainement un dimenssionnement pour le serveur au niveau du CPU et de la RAM. Pour cela, nous attendons de pouvoir disposer d'un panel de parseurs plus complet pour pouvoir lancer des benchmark intenssifs et en déduire des préconisations matériels.

## Installation ##

Ouvrez un terminal est tapez :

```bash
git clone http://github.com/ezpaarse-project/ezpaarse.git
cd ~/ezpaarse
make
```

## Tests ##

Cette étape vous permettra de valider que votre installation est fonctionnelle.

```bash
cd ~/ezpaarse
. ./bin/env
make start
make test
```

## Usage ##

Des [fichiers de logs exemple et anonymisés](https://raw.github.com/ezpaarse-project/ezpaarse/master/test/dataset/sd.2012-11-30.300.log) sont disponibles dans les répertoires d'ezPAARSE.

Vous devez tout d'abord vous assurer qu'ezPAARSE est démarré (par défaut le Web service écoute sur le port 59599) :

```bash
make start
```

Un client HTTP (ici curl) peut envoyer un fichier de données de log (ici ./test/dataset/sd.2012-11-30.300.log) sur le Web service d'ezPAARSE (route /ws/) et obtenir en réponse un flux JSON d'événements de consultation.

```bash
curl -X POST http://127.0.0.1:59599/ws/ \
             -v --no-proxy --no-buffer \
             --data-binary @./test/dataset/sd.2012-11-30.300.log
```

Alternativement, vous pouvez également utiliser la commande ``bin/loginjector`` fournie par ezPAARSE pour injecter encore plus simplement le fichier de log dans ezPAARSE :

```bash
. ./bin/env
cat ./test/dataset/sd.2012-11-30.300.log | ./bin/loginjector
```

## Paramétrage avancé ##

* Le port d'écoute du Web service d'ezPAARSE peut être réglé en modifiant la variable ``EZPAARSE_NODEJS_PORT`` dans le fichier ``config.json`` (par défaut 59599)
