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
