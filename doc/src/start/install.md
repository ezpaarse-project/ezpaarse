# Installation

Make sure you fulfilled the [requirements](./requirements.html) before going any further.

For an ezPAARSE installation on a **Windows** OS, you will have to use a dockerized container. Please see [below](install.html#docker-and-compose).

## Without Docker

### Stable version
To install the last stable version on a Unix system, open a console and enter:
```bash
git clone https://github.com/ezpaarse-project/ezpaarse.git
cd ezpaarse
git checkout `git describe --tags --abbrev=0`
make
```
#### Video Demonstration
This [screencast](https://www.youtube.com/watch?v=W77vPsgC1A8) demonstrates the previous instructions.

### Development version
If you wish to install the development version, open a console and enter:
```bash
git clone https://github.com/ezpaarse-project/ezpaarse.git
cd ezpaarse
make
```

## With Docker and Compose

ezPAARSE is available as a [docker image](https://registry.hub.docker.com/r/ezpaarseproject/ezpaarse).

To run it with docker, you will need to install [Docker](https://docs.docker.com/engine/install/) and [Docker-Compose](https://docs.docker.com/compose/install/).

Then, you can either grab the `docker-compose.yml` file alone:
```bash
mkdir ezpaarse/
wget https://raw.githubusercontent.com/ezpaarse-project/ezpaarse/master/docker-compose.yml
test -f config.local.json || echo '{}' > config.local.json
```

or clone the github repository:
```bash
git clone https://github.com/ezpaarse-project/ezpaarse.git
cd ezpaarse
test -f config.local.json || echo '{}' > config.local.json
```
