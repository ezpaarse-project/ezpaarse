# ezPAARSE #

[![Build Status](https://secure.travis-ci.org/ezpaarse-project/ezpaarse.png?branch=master)](http://travis-ci.org/ezpaarse-project/ezpaarse)
[![Dependencies Status](https://david-dm.org/ezpaarse-project/ezpaarse.png)](https://david-dm.org/ezpaarse-project/ezpaarse)

ezPAARSE is a web service that ingests your electronic documentation access log files. It then filters, extracts and enriches the consultation events that were spotted.
This document describes how to install and run ezPAARSE on your computer.

## Prerequisites ##

The tools you'll need to let ezPAARSE run are :

* Linux OS : [See the prerequisites for those OSes](https://github.com/ezpaarse-project/ezpaarse/blob/master/doc/multi-os.md)
* Standard Linux tools : bash, make, grep, sed ... 
* curl (used by nvm)
* git >= 1.7.10 (required from github)

ezPAARSE then comes with all the elements it needs to run.
When the prerequesites are met, you can launch the **make** command (see below) that will **run all the installation steps**.

## Installation quickstart ##

If you are a Windows user, you can install ezPAARSE on your computer by [downloading the setup file](http://analogist.couperin.org/ezpaarse/download) and start the install like you would do for any other program.

If you want to install ezPAARSE on a Unix-type system, 
download the latest stable version in the [tar.gz](http://analogist.couperin.org/ezpaarse/download) format
open a terminal and type :
```console
unzip ezpaarse-X.X.X.zip
cd ezpaarse-X.X.X
make
```
If you want to install the development (unstable) version, 
open a terminal and type :
```console
git clone http://github.com/ezpaarse-project/ezpaarse.git
cd ezpaarse
make
```

You can also [download a deb archive](http://analogist.couperin.org/ezpaarse/download) and install it on your system like so :
```console
sudo -E dpkg -i ezpaarse-X.X.X.deb
sudo /etc/init.d/ezpaarse start
```

## Test the installation ##

This step allows you to validate that your install is working.

```console
make start
make test
```

## Usage ##

[Anonymised example logfiles](https://raw.github.com/ezpaarse-project/ezpaarse/master/test/dataset/sd.2012-11-30.300.log)
are made available in the repositories of ezPAARSE.

You need to make sure that ezPAARSE is started in issueing the following command :

```console
make start
```

If you are not computer-savvy, the easiest way to work with ezPAARSE is to use its hmtl form, accessible from your web browser of choice and open the following URL : [http://localhost:59599/](http://localhost:59599/)

If you are computer-savvy, you can use an HTTP client (like curl) to send a logfile
(for this example, we will use ./test/dataset/sd.2012-11-30.300.log) to ezPAARSE's Web service
and get a CSV stream of consultation events as a response.

```console
curl -X POST http://127.0.0.1:59599 \
             -v --proxy "" --no-buffer \
             --data-binary @./test/dataset/sd.2012-11-30.300.log
```

Or you can use the command ``./bin/loginjector`` ezPAARSE provides you with
to send the logfile to the web service in a simpler way :

```console
. ./bin/env
cat ./test/dataset/sd.2012-11-30.300.log | ./bin/loginjector
```
You can also see quick countings on your data if you add the command 
``./bin/csvtotalizer`` at the end of the command line.
Doing so, you will get an overview of the consultation events that were extracted
from your logs by ezPAARSE :

```console
. ./bin/env
cat ./test/dataset/sd.2012-11-30.300.log | ./bin/loginjector | ./bin/csvtotalizer
```

## Advanced parameters ##

* The listening port for the web service can be set with the ``EZPAARSE_NODEJS_PORT`` variable, found in the file ``config.json`` (thedefault value is 59599)
