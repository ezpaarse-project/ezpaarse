# Installation #

## Pré-requis ##
A partir d'une image iso Linux

```bash
sudo apt-get update
sudo apt-get install php5-cli
sudo apt-get install tmpreaper
sudo apt-get install build-essential
sudo apt-get install libldap2-dev
sudo apt-get install uuid-dev
sudo apt-get install expect
```

## Procédure d'installation ##

```console
git clone http://github.com/ezpaarse-project/ezpaarse.git
cd ezpaarse
make
```

## Lancement du serveur ##

```bash
make start
```

## Arrêt du serveur ##

```bash
make stop
```

## État du serveur ##

```bash
make status
```

### Lancement direct de node (en mode DEBUG) ###


```bash
cd ~/ezpaarse/usr/share/ezpaarse
DEBUG=* node app.js
```

