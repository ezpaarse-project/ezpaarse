# ezPAARSE #

[![Build Status](https://secure.travis-ci.org/ezpaarse-project/ezpaarse.png?branch=master)](http://travis-ci.org/ezpaarse-project/ezpaarse)
[![Dependencies Status](https://david-dm.org/ezpaarse-project/ezpaarse.png)](https://david-dm.org/ezpaarse-project/ezpaarse)
[![bitHound Overall Score](https://www.bithound.io/github/ezpaarse-project/ezpaarse/badges/score.svg)](https://www.bithound.io/github/ezpaarse-project/ezpaarse)
[![Docker stars](https://img.shields.io/docker/stars/ezpaarseproject/ezpaarse.svg)](https://registry.hub.docker.com/u/ezpaarseproject/ezpaarse/)
[![Docker Pulls](https://img.shields.io/docker/pulls/ezpaarseproject/ezpaarse.svg)](https://registry.hub.docker.com/u/ezpaarseproject/ezpaarse/)
[![Ezpaarse tweeter](https://img.shields.io/twitter/follow/ezpaarse.svg?style=social&label=Follow)](https://twitter.com/ezpaarse)



ezPAARSE is an open-source software that can ingest your (proxy) log files and show how users access subscribed electronic resources.
It filters, extracts and enriches the consultation events that were spotted and produces a CSV file following [COUNTER](http://www.projectcounter.org/) codes of practice.
This document describes how to install and run ezPAARSE on your computer.

Moreover, **have a look to the [ezpaarse demo](http://demo.ezpaarse.org)**, it will show you a nice user interface where you can register and test to process your own proxy logs.

Built-in proxies supported log formats are: [ezproxy](http://www.oclc.org/ezproxy.en.html), [bibliopam](http://mioga.alixen.fr/Mioga2/bibliopam/public/club/), and [squid](http://www.squid-cache.org/)

**Table of content**
- [Recommended system requirements](#recommended-system-requirements)
- [Prerequisites](#prerequisites)
- [Installation quickstart](#installation-quickstart)
- [Test the installation](#test-the-installation)
- [Usage](#usage)
- [Go further](#go-further)
- [Advanced parameters](#advanced-parameters)
- [Use with docker](#use-with-docker)

## Recommended system requirements ##
- a linux box or VM (eg: Ubuntu)
- 50Gb disk space (to be adjusted, depending on the quantity and size of logfiles to be simultaneously processed)
- 2 cores of CPU
- 2 to 4 Gb of RAM space

## Prerequisites ##

The tools you need to let ezPAARSE run are:

* Linux OS: [See the prerequisites for those OSes](https://ezpaarse-project.github.io/ezpaarse/start/requirements.html)
* Standard Linux tools: bash, make, grep, sed ...
* python
* gcc and g++
* curl (used by nvm)
* git >= 1.7.10 (required to clone ezpaarse from github and to keep your ezpaarse copy up to date)
* MongoDB >= 3.2

ezPAARSE then comes with all the elements it needs to run.
When the prerequesites are met, you can launch the **make** command (see below) that will **run all installation steps**.

## Installation quickstart ##

If you are a Windows user, you can install ezPAARSE on your computer as a docker image. Please refer to the [docker section](https://github.com/ezpaarse-project/ezpaarse#use-with-docker) below.

To install the latest stable version of ezPAARSE on a Unix-type system, open a terminal and type:
```shell
git clone https://github.com/ezpaarse-project/ezpaarse.git
cd ezpaarse
git checkout `git describe --tags --abbrev=0`
make
```

If you want to install the version in development (unstable),
open a terminal and type:
```shell
git clone https://github.com/ezpaarse-project/ezpaarse.git
cd ezpaarse
make
```

## Test the installation ##

This step allows you to validate that your install is working.

```shell
make start
make test
```

## Usage ##

[Anonymised example logfiles](https://raw.github.com/ezpaarse-project/ezpaarse/master/test/dataset/sd.2012-11-30.300.log)
are made available in the repositories of ezPAARSE.

You need to make sure that ezPAARSE is started. To do so, type the following command:

```shell
make start
```

If you are not computer-savvy, the easiest way to work with ezPAARSE is to use its HTML form, accessible from your favorite webbrowser and open the following URL: [http://localhost:59599/](http://localhost:59599/)

If you are computer-savvy, you can use an HTTP client (like curl) to send a logfile
(for this example, we will use ./test/dataset/sd.2012-11-30.300.log) to ezPAARSE's Web service
and get a CSV stream of consultation events as a response.

```shell
curl -X POST http://127.0.0.1:59599 \
             -v --proxy "" --no-buffer \
             --data-binary @./test/dataset/sd.2012-11-30.300.log
```

Or you can use the command ``./bin/loginjector`` ezPAARSE provides you with
to send the logfile to the web service in a simpler way:

```shell
. ./bin/env
cat ./test/dataset/sd.2012-11-30.300.log | ./bin/loginjector
```
You can also see quick countings on your data if you add the command
``./bin/csvtotalizer`` at the end of the command line.
Doing so, you will get an overview of the consultation events extracted
from your logs by ezPAARSE:

```shell
. ./bin/env
cat ./test/dataset/sd.2012-11-30.300.log | ./bin/loginjector | ./bin/csvtotalizer
```

To stop ezPAARSE, you have to type the following command:

```shell
make stop
```
## Go further ##

To go further, you can consult [the full documentation](http://doc.ezpaarse.org)


## Advanced parameters ##

The default ezPAARSE parameters can be found in the [``config.json``](https://github.com/ezpaarse-project/ezpaarse/blob/master/config.json) file. All these parameters can be changed. A good practice is to define a new file called ``config.local.json`` containing just the parameters you need to override.

For example, to change the ezPAARSE listening port (59599 by default), you can override the ``EZPAARSE_NODEJS_PORT`` by defining a new ``config.local.json`` file this way:

```json
{
  "EZPAARSE_NODEJS_PORT": 45000
}
```

## Use with docker ##

ezPAARSE is available as a [docker image](https://registry.hub.docker.com/u/ezpaarseproject/ezpaarse/).

You need:

- [Docker](https://docs.docker.com/engine/installation/) (Version >= 1.12)
- [Docker Compose](https://docs.docker.com/compose/install/) (Version >= 1.7)

Then, you can run the dockerized ezpaarse this way:

```
mkdir ezpaarse/
wget --no-check-certificate https://raw.githubusercontent.com/ezpaarse-project/ezpaarse/master/docker-compose.yml
test -f config.local.json || echo '{}' > config.local.json
docker-compose up -d
```

Then ezpaarse is available at this URL: http://127.0.0.1:59599

To have a look to the ezpaarse system logs, you can run: ``docker logs -f ezpaarse``
