# Application core #

Developper-oriented documentation for ezPAARSE's core.
The documentation on contributions to parsers, pkbs and scrapers can be read in [this section](./developer-plateforms.html).

## Technologies used by ezPAARSE

* [nodejs](http://nodejs.org/) for the core of ezPAARSE (advanced streaming capabilities and performance).
* [git](http://git-scm.com/) to manage knowledge bases and source code.

## How does the ezPAARSE engine work?

![ezpaarse's engine working Schema](images/ezPAARSE-Moteur.png "ezPAARSE's engine")

## ezPAARSE's monitoring

The following options can be used to run ezPAARSE.

* ``--memory``: shows the memory consumption of the ezPAARSE process every 5 seconds
* ``--lsof``: displays the number of open file descriptors every 5 seconds

Example :
```console
. ./bin/env
node app.js --memory
```

## Launching the ezPAARSE's unit tests

For testing a specific function, use mocha and indicate the path of the test file as a parameter

Eg for testing custom formats:
```console
. ./bin/env
mocha ./test/custom-formats-test
```


To perform only one functionality test, use mocha and set the path of the test file as a parameter and then specify (with ``-g``) the test number (two figures) like ``@xx``.

For example, for the second test about the custom formats:
```console
. ./bin/env
mocha ./test/custom-formats-test -g @02
```

To test a single platform, use mocha and set the path to the platforms test file. Specify the name of the platform with ``-g``.

For example, testing Science Direct:
```console
. ./bin/env
mocha ./test/platforms-test -g sd
```

## Generate a new ezPAARSE version ##

To generate a new version of ezPAARSE several semi-automatic steps are necessary:

- Make sure not to have local modifications pending: run a `git status`.

- Change the version number of the various relevant files (of course, replace `0.0.3` by the desired number):
```console
make version v=0.0.3
git commit -a -m "Version 0.0.3"
git push
```

- Create a git tag, matching the new version:
```console
make tag
```

- Create a tar.gz archive :
```
make tar
```

- Create a debian archive (.deb) :
```console
make deb
```

- Create a rpm archive (.rpm) :
```console
make rpm
```

- Creat a windows archive (.exe) :
```console
#the nsis package is needed
make exe
```

- Send the results on the [AnalogIST](http://analogist.couperin.org) server to publish this new version to the community:
```console
make upload
```

## Generate an ezPAARSE snapshot archive ##

The `latest` version number is used to generate a snapshot (a developpment version archive).

```
make tar v=latest
make deb v=latest
make rpm v=latest
make exe v=latest
make upload v=latest
```

The version number will look like: `YYYYMMDD<commitid>`  
Example: `201303240bc258f` (March 24th, 2013 commit id = 0bc258f)

## Contributions to ezPAARSE - the tree structure

When you contribute, please refer to the [tree structure](/doc/tree.html) to find where you should put your files

## Updating the ezPAARSE's libraries versions ##

EzPAARSE's librairies are the npm and bower modules.
They are in the following repositories:
- ezpaarse/node_modules/
- ezpaarse/public/components/

The [github repository](https://github.com/ezpaarse-project/ezpaarse-libs) is there to make snapshots of those libraries available.

The [upgrade-ezpaarse-libs](https://github.com/ezpaarse-project/ezpaarse-libs/blob/master/upgrade-ezpaarse-libs) script will update the npm and bower modules in this repository and respect the dependencies expressed in the github repositories of ezPAARSE:
- [package.json](https://github.com/ezpaarse-project/ezpaarse/blob/master/package.json) for ezpaarse
- [bower.json](https://github.com/ezpaarse-project/ezpaarse/blob/master/bower.json) for ezpaarse

To update these libraries, it is necessary to update the package.json and bower.json files from the ezpaarse distribution (use of npm-check-updates utility) then test that ezPAARSE working properly:
```bash
cd ezpaarse/
npm install npm-check-updates
./node_modules/.bin/npm-check-updates -u
npm update

make restart
make test
```

As to bower :
```bash
cd ezpaarse/
bower update
```
Then, you have to manually test the web interface.

When all tests pass, you can commit/push the package.json and bower.json files to the git repository.

You can then clone the deposit [ezpaarse-libs](https://github.com/ezpaarse-project/ezpaarse-libs) and run the upgrade-ezpaarse-libs script that will download the correct packages versions declared in packages.json and bower.json

The only thing remaining is to commit/push the changes in the ezpaarse-libs repository:
```bash
cd ezpaarse-libs/
./upgrade-ezpaarse-libs
git status .
git add .
git commit .
git push
```
