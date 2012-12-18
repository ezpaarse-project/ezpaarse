# Démarrage rapide #

## Pré-requis ##

* Système d'exploitation Linux
* Outils standards Linux : bash, make, grep, sed ... 
* curl (utilisé par nvm)
* git >= 1.7.10 (pour être compatible avec github)

## Téléchargement ##
```bash
git clone http://github.com/ezpaarse-project/ezpaarse.git
```
## Installation ##
```bash
cd ~/ezpaarse

make
```
## Test de l'Installation ##

```bash
cd ~/ezpaarse
. ./bin/env
make start
make test
```
## Exemple d'utilisation ##

Le serveur est lancé sur la machine locale sur le port ``EZPAARSE_NODEJS_PORT``, par defaut 59599

``
make start
``


Un client HTTP (ici curl) peut envoyer un fichier de données de log (ici test/dataset/sd.2012-11-30.log) sur le web service (route /ws/) et obtenir en réponse un flux json d'événements de consultation

``
curl -X POST --proxy "" --no-buffer --data-binary @test/dataset/sd.2012-11-30.300.log  http://127.0.0.1:59599/ws/ -v
``
## Paramétrage avancé ##

TODO
