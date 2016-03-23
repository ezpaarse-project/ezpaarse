ezPAARSE can be installed on many Linux distributions, with the following prerequisites :

* Unix standard tools: bash, make, grep, sed...
* python and gcc
* curl (used by nvm)
* git >= 1.7.10 (needed by github)
* MongoDB >= 2.4

## Ubuntu ##

Starting from a [ubuntu image](http://www.ubuntu.com/download) loaded in a virtual machine, with root privileges or via sudo.

```
apt-get install git make curl python gcc build-essential
```

## Fedora ##

Starting from a [fedora image](http://fedoraproject.org/get-fedora) loaded in a virtual machine, with root privileges or via sudo.

```
yum install tar git make curl python gcc-c++
```

## SUSE ##

(to be verified)
```
zypper install git make curl python gcc-c++
```

## Mac OS X ##

On your Mac, install xCode and git

## Windows ##

Windows support has been dropped, however you can use a virtual machine to run ezPAARSE in a linux environment.
