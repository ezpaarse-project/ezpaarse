# Quickstart #

ezPAARSE is a webservice where you can inject your logs and get
filtered and enriched access events as a result.
Please follow the instructions below to install the software.

## Prerequisites ##

Here are the tools you'll need to let ezPAARSE work:

* Linux OS: [see the special prerequesites](https://github.com/ezpaarse-project/ezpaarse/blob/master/doc/multi-os.md)
* Unix standard tools: bash, make, grep, sed ... 
* curl (used by nvm)
* unzip
* git >= 1.7.10 (needed by github)
* MongoDB >= 2.4

When the prerequisites are fulfilled, launching the **make** command (see below) **automatically completes all the installation steps**.

### MongoDB Installation ###

We only cover the procedure for Debian and Ubuntu based systems (see below).
The installation instructions for other OSes are available in the [official MongoDB documentation](http://docs.mongodb.org/manual/installation/).

#### Ubuntu 14.04 or newer ####
```
sudo apt-get install mongodb
```

#### Ubuntu 9.10 or older ####
```
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo service mongod start
```

#### Debian ou Ubuntu older than 9.10 ####
```
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/debian-sysvinit dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo service mongod start
```

## Installation ##

For an ezPAARSE installation on a Windows OS, you only have to [download the setup.exe](http://analogist.couperin.org/ezpaarse/download)
and launch the install process like for any other program.

To install the last stable version on a Unix system, open a console and enter:
```console
git clone https://github.com/ezpaarse-project/ezpaarse.git
cd ezpaarse
git checkout `git describe --tags --abbrev=0`
make
```

You can also download a stable version in the [tar.gz](http://analogist.couperin.org/ezpaarse/download) format, open a console and enter:
```console
tar -xzvf ezpaarse-X.X.X.tar.gz
cd ezpaarse-X.X.X
make
```

If you wish to install the development version, enter:
```console
git clone https://github.com/ezpaarse-project/ezpaarse.git
cd ezpaarse
make
```

You can also [download a .deb archive](http://analogist.couperin.org/ezpaarse/download) and install it on your Debian/Ubuntu system:
```console
sudo -E dpkg -i ezpaarse-X.X.X.deb
sudo /etc/init.d/ezpaarse start
```

## Test your installation ##

This step tests if your installation is correctly working:

```console
make start
make test
```

## Usage ##

[Anonymised example log files](https://raw.github.com/ezpaarse-project/ezpaarse/master/test/dataset/sd.2012-11-30.300.log)
are available in the ezPAARSE repository.

You have to start ezPAARSE first by launching the following command:
```console
make start
```

You can always check the program status by issueing the following command:
```console
make status
```

To stop ezPAARSE, type the following command:
```console
make stop
```

If you are not computer savvy, the easiest method to use ezPAARSE is to go through its HTML form
that is accessible with your favourite web browser.
You just have to open this URL: [http://localhost:59599/](http://localhost:59599/)

If you are an IT person, you can use an HTTP client (we'll use curl) to send a logfile
(in this case: ./test/dataset/sd.2012-11-30.300.log) to the ezPAARSE web service
and get a CSV stream of access events back.

```console
curl -X POST http://127.0.0.1:59599 \
             -v --proxy "" --no-buffer \
             --data-binary @./test/dataset/sd.2012-11-30.300.log
```

As an alternative, you could also use the ``./bin/loginjector`` command that ezPAARSE provides you with
to more simply inject the logfile in the web service:

```console
. ./bin/env
cat ./test/dataset/sd.2012-11-30.300.log | ./bin/loginjector
```

You can also run quick calculations by adding the ``./bin/csvtotalizer`` command at the end of
your command line.
You will get an overview of access events that have been spotted in your logs by ezPAARSE:

```console
. ./bin/env
cat ./test/dataset/sd.2012-11-30.300.log | ./bin/loginjector | ./bin/csvtotalizer
```

## Advanced Parameters ##

* The listening port for the web service (by default: 59599) can be modified through the ``EZPAARSE_NODEJS_PORT`` variable
in the ``config.json`` file
