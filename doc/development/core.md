# Application core #

Developper-oriented documentation for ezPAARSE's core.
The documentation dedicated to contributions for parsers, pkbs and scrapers can be found in [this section](./platforms.html).

## Technologies used by ezPAARSE

* [nodejs](http://nodejs.org/) for the core of ezPAARSE (advanced streaming capabilities and performance).
* [git](http://git-scm.com/) to manage knowledge bases and source code.

## How does the ezPAARSE engine work?

![ezpaarse's engine working Schema](../_static/images/ezPAARSE-Moteur.png "ezPAARSE's engine")

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

Use the makefile to launch the tests:
```console
  make test
```

To test a specific function, use mocha and indicate the path of the test file as a parameter

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

## Generate a new ezPAARSE version ##

To generate a new version of ezPAARSE you need to be member of the ezPAARSE Team.

If you are not a member, you can submit a [pull request on github](https://github.com/ezpaarse-project/ezpaarse/pulls).

For the ezPAARSE Team:
- Check you are on the master version or run a `git checkout master`
- Use npm to generate the new version by using the appropriate options to tag the version

```console
npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease | from-git]
```
Example :

```console
ubuntu@v-ubuntu:~/ezpaarse$ npm version patch
v2.9.4
git push
git push --tags
```
