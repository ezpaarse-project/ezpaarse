# ezPAARSE #

[![Build Status](https://secure.travis-ci.org/ezpaarse-project/ezpaarse.png?branch=master)](http://travis-ci.org/ezpaarse-project/ezpaarse)
[![Dependencies Status](https://david-dm.org/ezpaarse-project/ezpaarse.png)](https://david-dm.org/ezpaarse-project/ezpaarse)
[![Join the chat at https://gitter.im/ezpaarse-project/ezpaarse](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ezpaarse-project/ezpaarse?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)  
[![Docker status](http://dockeri.co/image/ezpaarseproject/ezpaarse)](https://registry.hub.docker.com/u/ezpaarseproject/ezpaarse/)

ezPAARSE is an open-source software that can ingest your (proxy) log files and show how users access suscribed electronic ressources.
It filters, extracts and enriches the consultation events that were spotted and produces a CSV file following [COUNTER](http://www.projectcounter.org/) codes of practice.
This document describes how to install and run ezPAARSE on your computer.

Moreover, **have a look to the [ezpaarse demo](http://ezpaarse.couperin.org)**, it will show you a nice user interface where you can register and test to inject your proxy logs.

Built-in proxies supported log formats are:

* [ezproxy](http://www.oclc.org/ezproxy.en.html)
* [bibliopam](http://mioga.alixen.fr/Mioga2/bibliopam/public/club/)
* [squid](http://www.squid-cache.org/)

**Table of content**
- [Recommended system requirements](#recommended-system-requirements)
- [Prerequisites](#prerequisites)
- [Installation quickstart](#installation-quickstart)
- [Test the installation](#test-the-installation)
- [Usage](#usage)
- [Advanced parameters](#advanced-parameters)
- [Use with docker](#use-with-docker)

## Recommended system requirements ##
- a linux box or VM (eg: Ubuntu)
- 50Gb disk space (to be adjusted, depending on the quantity and size of logfiles to be simultaneously processed)
- 2 cores of CPU
- 2 to 4 Gb of RAM space

## Prerequisites ##

The tools you need to let ezPAARSE run are:

* Linux OS: [See the prerequisites for those OSes](https://github.com/ezpaarse-project/ezpaarse/blob/master/doc/multi-os.md)
* Standard Linux tools: bash, make, grep, sed ... 
* curl (used by nvm)
* git >= 1.7.10 (required from github)

ezPAARSE then comes with all the elements it needs to run.
When the prerequesites are met, you can launch the **make** command (see below) that will **run all installation steps**.

## Installation quickstart ##

If you are a Windows user, you can install ezPAARSE on your computer by [downloading the setup file](http://analogist.couperin.org/ezpaarse/download) and start the install like you would do for any other program.

To install the latest stable version of ezPAARSE on a Unix-type system, open a terminal and type:  
```shell
git clone https://github.com/ezpaarse-project/ezpaarse.git
cd ezpaarse
git checkout `git describe --tags --abbrev=0`
make
```
You can also download a stable version in the [tar.gz](http://analogist.couperin.org/ezpaarse/download) format and type in a terminal:  
```shell
tar -xzfv ezpaarse-X.X.X.tar.gz
cd ezpaarse-X.X.X
make
```
If you want to install the version in development (unstable), 
open a terminal and type:  
```shell
git clone https://github.com/ezpaarse-project/ezpaarse.git
cd ezpaarse
make
```

You can also [download a deb archive](http://analogist.couperin.org/ezpaarse/download) and install it on your system this way:  
```shell
sudo -E dpkg -i ezpaarse-X.X.X.deb
sudo /etc/init.d/ezpaarse start
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

If you are not computer-savvy, the easiest way to work with ezPAARSE is to use its hmtl form, accessible from your favorite webbrowser and open the following URL: [http://localhost:59599/](http://localhost:59599/)

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

## Advanced parameters ##

The default ezPAARSE parameters can be found in the [``config.json``](https://github.com/ezpaarse-project/ezpaarse/blob/master/config.json) file. All these parameters can be changed. A good practice is to define a new file called ``config.local.json`` containing just the parameters you need to override.

For example, to change the ezPAARSE listening port (59599 by default), you can override the ``EZPAARSE_NODEJS_PORT`` by defining a new ``config.local.json`` file this way:

```json
{
  "EZPAARSE_NODEJS_PORT": 45000
}
```

## Use with docker ##

ezPAARSE is now available as a [docker image](https://registry.hub.docker.com/u/ezpaarseproject/ezpaarse/). It exposes port `59599` and needs to be linked with a mongodb container in order to be fully functionnal.  

Typical use:

    docker run -d --name ezdb mongo
    docker run -d --name ezpaarse --link ezdb:mongodb -p 59599:59599 ezpaarseproject/ezpaarse
    
    # to stop the containers
    docker stop ezpaarse ezdb
    # to start again
    docker start ezdb ezpaarse
    # to have a look to the logs
    docker logs -f ezpaarse

Behind a proxy: use `docker run -e http_proxy[=...] -e https_proxy[=...]`

In order to have a better control on the ezpaarse persistent data, you can also map mongodb binary data and the ezpaarse jobs folder to local folders thanks to the [-v option](https://docs.docker.com/userguide/dockervolumes/#mount-a-host-file-as-a-data-volume):

    mkdir /tmp/ezpaarse ; cd /tmp/ezpaarse
    docker run -d --name ezdb -v $(pwd)/ezdb-data:/data/db mongo
    docker run -d --name ezpaarse --link ezdb:mongodb -p 59599:59599 -v $(pwd)/ezpaarse-jobs:/root/ezpaarse/tmp/jobs ezpaarseproject/ezpaarse

You can also use [docker-compose](https://docs.docker.com/compose/) to run ezpaarse (experimental).

Typical use:

    cd ezpaarse/misc/docker-compose/
    docker-compose up
