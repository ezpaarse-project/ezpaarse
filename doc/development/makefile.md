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
