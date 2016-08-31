# Requirements #

ezPAARSE can be installed on many Linux distributions, with the following prerequisites :

* Unix standard tools: bash, make, grep, sed...
* python and gcc
* curl (used by nvm)
* git >= 1.7.10 (needed by github)
* MongoDB >= 2.4

If using the docker version of ezpaarse you only need:

- [Docker](https://docs.docker.com/engine/installation/) (Version >= 1.12)
- [Docker Compose](https://docs.docker.com/compose/install/) (Version >= 1.7)


## Libraries ##

### Ubuntu ###

Starting from a [ubuntu image](http://www.ubuntu.com/download) loaded in a virtual machine, with root privileges or via sudo.

```
apt-get install git make curl python gcc build-essential
```

### Fedora ###

Starting from a [fedora image](http://fedoraproject.org/get-fedora) loaded in a virtual machine, with root privileges or via sudo.

```
yum install tar git make curl python gcc-c++
```

### SUSE ###

(to be verified)
```
zypper install git make curl python gcc-c++
```

### Mac OS X ###

On your Mac, install xCode and git

### Windows ###

Windows support has been dropped, however you can use a virtual machine to run ezPAARSE in a linux environment.

## MongoDB ##

We only cover the procedure for Debian and Ubuntu based systems (see below).
The installation instructions for other OSes are available in the [official MongoDB documentation](http://docs.mongodb.org/manual/installation/#tutorial-installation).

### Ubuntu 14.04 or newer ###
```
sudo apt-get install mongodb
```

### Ubuntu 9.10 or older ###
```
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo service mongod start
```

### Debian ###

Please use the [official MongoDB doc for Debian](https://docs.mongodb.org/master/tutorial/install-mongodb-on-debian/)
