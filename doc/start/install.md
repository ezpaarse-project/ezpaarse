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

ezPAARSE is available as a [docker image](https://registry.hub.docker.com/u/ezpaarseproject/ezpaarse/).

You need:

- [Docker](https://docs.docker.com/engine/installation/) (Version >= 1.12)
- [Docker Compose](https://docs.docker.com/compose/install/) (Version >= 1.7)

Then, you can run the dockerized ezpaarse this way:

```
mkdir ezpaarse/
wget https://raw.githubusercontent.com/ezpaarse-project/ezpaarse/master/docker-compose.yml
docker-compose up -d
```

Then ezpaarse is available at this URL: http://127.0.0.1:59599

To have a look to the ezpaarse system logs, you can run: ``docker logs -f ezpaarse``

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
