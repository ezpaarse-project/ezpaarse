#Multi-OS Installation

ezPAARSE can be installed on many Linux flavours.

Depending on the flavour, prerequisites are needed before starting the [main installation](https://github.com/ezpaarse-project/ezpaarse/blob/master/doc/quickstart.md)

##Ubuntu prerequisites

Starting from a [ubuntu image](http://www.ubuntu.com/download) loaded in a virtual machine, with root privileges or via sudo.

```
apt-get install git make curl python gcc build-essential
```

##Fedora prerequisites

Starting from a [fedora image](http://fedoraproject.org/get-fedora) loaded in a virtual machine, with root privileges or via sudo.

```
yum install git make curl python gcc-c++
```

##SUSE prerequisites
 
(to be verified)
```
zypper install git make curl python gcc-c++
```

##Mac OS X prerequisites

On your Mac, install xCode and git

##Usage on Windows

ezPAARSE can be used on Windows, but will suffer some limitations.
Only the heart of ezPAARSE and the parsers written in Nodejs will work (the command line tools are only available on Unix-based systems).
Using a windows version should be reserved for running tests and demos.
An install program is available on [the download page](http://analogist.couperin.org/ezpaarse/download).
