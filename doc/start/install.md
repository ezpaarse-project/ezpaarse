# Installation #

Make sure you fulfilled the [requirements](requirements.md) before going any further.

For an ezPAARSE installation on a Windows OS, you only have to [download the setup.exe](http://analogist.couperin.org/ezpaarse/download)
and launch the install process like for any other program.

## Stable version ##
To install the last stable version on a Unix system, open a console and enter:
```console
git clone https://github.com/ezpaarse-project/ezpaarse.git
cd ezpaarse
git checkout `git describe --tags --abbrev=0`
make
```
### Video Demonstration ###
This [screencast](https://www.youtube.com/watch?v=W77vPsgC1A8) demonstrates the previous instructions

## Development version ##
If you wish to install the development version, enter:
```console
git clone https://github.com/ezpaarse-project/ezpaarse.git
cd ezpaarse
make
```

## Docker version ##

ezPAARSE is available as a [docker image](https://registry.hub.docker.com/u/ezpaarseproject/ezpaarse/), to run it with docker:
```bash
mkdir ezpaarse/
wget https://raw.githubusercontent.com/ezpaarse-project/ezpaarse/master/docker-compose.yml
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

If using the docker version, to delete the docker containers:
```bash
docker rm -f ezpaarse ezpaarse_db
```
