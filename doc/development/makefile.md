# Makefile #

The makefile is located in the root directory and is used, among others, to launch tests,
to generate the documentation, to check that the coding rules are respected.

## Node modules installation ##

```console
make nodejs
```

Download, compile and configure the modules that are necessary for the application to run.

## Mocha tests ##

```console
make test
```

Runs all the non-regression tests. It is a simple way to ensure that ezPAARSE is correctly working.

The test files are located in the ``test/`` folder and all the filenames follow the pattern, finishing with ``-test.js``.

Note : don't forget to restart the application if the source code has been modified.

```console
make test-pkb
```
Checks that the knowledge base files used by the parsers are well formed and coherent.

```console
make test-pkb-verbose
```
Checks that the knowledge base files used by the parsers are well formed and coherent with a detailed output.


## Checking coding rules ##

```console
make lint
```

Checks the syntax of the javascript files with the ``eslint`` utility.

The coding rules can be modified with a configuration file (``.eslintrc``). All the options are documented on [the ESLint page](http://eslint.org/docs/rules/).

## Managing the documentation ##

```console
make doc
```

Generates an HTML formatted documentation with the markdown files found in the ``doc/`` folder.
The HTML documentation is made available in the ``public/doc/`` folder.

```console
make docclean
```

Cleans the generated HTML documentation by deleting the ``public/doc/`` folder.

```console
make docopen
```

Opens the documentation in the Google Chrome browser. (through the ``file://`` protocol)

When the application is started, the documentation is also available on the ezPAARSE built-in web server.
