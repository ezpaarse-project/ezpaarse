# Installation #

## Pré-requis ##
A partir d'une image de "troie"

```bash
sudo apt-get update
sudo apt-get install php5-cli
sudo apt-get install tmpreaper
sudo apt-get install build-essential
sudo apt-get install libldap2-dev
sudo apt-get install uuid-dev
sudo apt-get install expect
```

## Procédure d`installation ##

  * Récupération des sources :
```bash
svn checkout https://svn.inist.fr/repository/ezpaarse/trunk/ ezpaarse
```
(création du répertoire ''ezpaarse'' dans le répertoire courant)

  * Instanciation pkgi 
    * pour la preprod :
```bash
cd ezpaarse
EZPAARSE_VERSION="preprod"
EZPAARSE_HOME="`pwd`"
EZPAARSE_NODEJS_HOME="`pwd`/usr/share/ezpaarse"
EZPAARSE_NODEJS_PORT="51444"
./pkgi/build --modules="logrotate,cron,tmpreaper,nodejs,php,mysql,ezpaarse"
```

  * Utilisation de NVM
```bash
cd nvm
export NVM_DIR="`pwd`"
. ./nvm.sh
nvm use 0.8.8
```

  * Configuration de npm
```bash
npm config set registry=http://registry.npmjs.org/
```

  * Mise à jour des modules
```bash
make setup
```

## Lancement du serveur ##

<note>On suppose que l'installation est faite dans ~/ezpaarse</note>

### Classique avec PKGI ###

```bash
. ~/ezpaarse/etc/init.d/appli start
```


### Lancement direct de node (en mode DEBUG) ###


```bash
cd ~/ezpaarse/usr/share/ezpaarse
DEBUG=* node app.js
```

