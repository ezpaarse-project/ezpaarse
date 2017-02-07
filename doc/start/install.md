# Installation #

Make sure you fulfilled the [requirements](./requirements.html) before going any further.

For an ezPAARSE installation on a **Windows** OS, you will have to use a dockerized container, please see [below](install.html#docker-and-compose).

## Stable version ##
To install the last stable version on a Unix system, open a console and enter:
```console
git clone https://github.com/ezpaarse-project/ezpaarse.git
cd ezpaarse
git checkout `git describe --tags --abbrev=0`
make
```
### Video Demonstration ###
This [screencast](https://www.youtube.com/watch?v=W77vPsgC1A8) demonstrates the previous instructions.

## Development version ##
If you wish to install the development version, open a console and enter:
```console
git clone https://github.com/ezpaarse-project/ezpaarse.git
cd ezpaarse
make
```

## Docker and Compose ##

ezPAARSE is available as a [docker image](https://registry.hub.docker.com/u/ezpaarseproject/ezpaarse/).

To run it with docker, you will need to install [Docker](https://www.docker.com/) and [Docker-Compose](https://docs.docker.com/compose/install/).

Then, you can either grab the 'docker-compose.yml' file alone and start the containers:
```bash
mkdir ezpaarse/
wget https://raw.githubusercontent.com/ezpaarse-project/ezpaarse/master/docker-compose.yml
docker-compose up -d
```
or simply start the containers from your local github cloned repository:
```console
git clone https://github.com/ezpaarse-project/ezpaarse.git
cd ezpaarse
docker-compose up -d
```

## Uninstall ezPAARSE ##

Remove the ezpaarse folder:
```bash
rm -rf ezpaarse
```

Delete the database:
```bash
mongo ezpaarse
db.dropDatabase()
```

If using the docker version, delete the Docker containers:
```bash
docker rm -f ezpaarse ezpaarse_db
```
