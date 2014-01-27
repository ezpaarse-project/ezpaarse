# Démarrage rapide #

ezPAARSE se présente sous la forme d'un Web service dans lequel vous pouvez
injecter vos logs et récupérer les événements de consultation correspondants.
Cette procédure décrit comment installer ezPAARSE sur votre ordinateur.

## Pré-requis ##

Voici les outils dont vous avez besoin pour faire fonctionner ezPAARSE :

* Système d'exploitation Linux : [voir les pré-requis par systèmes](https://github.com/ezpaarse-project/ezpaarse/blob/master/doc/multi-os.md)
* Outils standards Linux : bash, make, grep, sed ... 
* curl (utilisé par nvm)
* git >= 1.7.10 (demandé par github)

ezPAARSE embarque tous les éléments nécessaires à son fonctionnement. 
Lorsque les pré-requis sont remplis, le lancement de la commande **make** (voir ci-dessous) **réalise toutes les opérations d'installation**.

## Installation ##

Si vous êtes utilisateur du système d'exploitation Windows, vous pouvez
installer ezPAARSE sur votre ordinateur en [téléchargeant le setup](http://analogist.couperin.org/ezpaarse/download) et en lançant l'installation comme n'importe quel autre programme.

Pour installer la dernière version stable d'ezPAARSE sur un système de type Unix, ouvrez un terminal et tapez :
```console
git clone https://github.com/ezpaarse-project/ezpaarse.git
cd ezpaarse
git checkout `git describe --tags --abbrev=0`
make
```

Vous pouvez également télécharger une version stable au format [tar.gz](http://analogist.couperin.org/ezpaarse/download) et entrer dans un terminal :
```console
tar -xzvf ezpaarse-X.X.X.tar.gz
cd ezpaarse-X.X.X
make
```

Si vous souhaitez installer la version de développement, tapez :
```console
git clone https://github.com/ezpaarse-project/ezpaarse.git
cd ezpaarse
make
```

Vous avez également la possibilité de [télécharger une archive .deb](http://analogist.couperin.org/ezpaarse/download) et de l'installer sur votre système Debian/Ubuntu de cette façon :
```console
sudo -E dpkg -i ezpaarse-X.X.X.deb
sudo /etc/init.d/ezpaarse start
```

## Tester l'installation ##

Cette étape vous permettra de valider que votre installation est fonctionnelle.

```console
make start
make test
```

## Usage ##

Des [fichiers de logs d'exemple anonymisés](https://raw.github.com/ezpaarse-project/ezpaarse/master/test/dataset/sd.2012-11-30.300.log)
sont disponibles dans les répertoires d'ezPAARSE.

Vous devez tout d'abord démarrer ezPAARSE en lançant la commande suivante :
```console
make start
```

Vous pouvez vérifier à tout moment l'état du programme en lançant la commande :
```console
make status
```

Pour arrêter ezPAARSE, utilisez la commande :
```console
make stop
```

Si vous n'êtes pas informaticien, la méthode la plus simple pour utiliser ezPAARSE est de
passer par son formulaire HTML directement accessible depuis votre navigateur Web favori.
Il suffit pour cela d'ouvrir cette adresse : [http://localhost:59599/](http://localhost:59599/)

Si vous êtes informaticien, vous pouvez utiliser un client HTTP (ici curl) pour envoyer un
fichier de données de log (ici ./test/dataset/sd.2012-11-30.300.log) sur le Web service
d'ezPAARSE et obtenir en réponse un flux CSV d'événements de consultation :

```console
curl -X POST http://127.0.0.1:59599 \
             -v --proxy "" --no-buffer \
             --data-binary @./test/dataset/sd.2012-11-30.300.log
```

Alternativement, vous pouvez utiliser la commande ``./bin/loginjector`` fournie par ezPAARSE
pour injecter plus simplement le fichier de log dans le Web service d'ezPAARSE :

```console
. ./bin/env
cat ./test/dataset/sd.2012-11-30.300.log | ./bin/loginjector
```
Vous pouvez également réaliser des comptages rapides en rajoutant
la commande ``./bin/csvtotalizer`` à la suite de la ligne de commande.
Vous aurez entre autre un aperçu des événements de consultation reconnus
par ezPAARSE sur vos logs :

```console
. ./bin/env
cat ./test/dataset/sd.2012-11-30.300.log | ./bin/loginjector | ./bin/csvtotalizer
```

## Paramétrage avancé ##

* Le port d'écoute du Web service d'ezPAARSE peut être réglé en modifiant la variable ``EZPAARSE_NODEJS_PORT``
dans le fichier ``config.json`` (par défaut 59599)
