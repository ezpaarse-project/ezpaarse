# ezPAARSE's Makefile

SHELL:=/bin/bash

# Run every steps needed to start ezpaarse
all: nodejs node-modules platforms-update exclusions-update resources-update hooks checkconfig

# Application section
# # # # # # # # # # # #

checkconfig:
	@. ./bin/env; if which node > /dev/null; then ./bin/checkconfig; else echo "Node.js was not found" >&2; fi

start:
	@./bin/ezpaarse start
stop:
	@./bin/ezpaarse stop
restart:
	@./bin/ezpaarse restart
status:
	@./bin/ezpaarse status

# Tests section
# # # # # # # # #

EZPATH = $(shell pwd)
PKBFILES=$(shell ls $(EZPATH)/platforms/*/pkb/*.txt | grep -v miss)

## Runs all tests (*-test.js) in the test folder except big and tdd
test:
	@if test -d test; \
	then . ./bin/env; mocha -g '@big|@tdd' -i; \
	else echo 'No test folder found'; \
	fi

test-verbose: test-pkb-verbose
	@if test -d test; \
	then . ./bin/env; mocha -g '@big|@tdd' -i -R list; \
	else echo 'No test folder found'; \
	fi

test-platforms:
	@if test -d test; \
	then . ./bin/env; mocha -g platform; \
	else echo 'No test folder found'; \
	fi

test-platforms-verbose:
	@if test -d test; \
	then . ./bin/env; mocha -R list -g platform; \
	else echo 'No test folder found'; \
	fi

test-pkb:
	@if test -d platforms; \
	then . ./bin/env; ./bin/pkbvalidator --nowarnings $(PKBFILES); \
	else echo 'No test folder found'; \
	fi

test-pkb-verbose:
	@if test -d platforms; \
	then . ./bin/env; ./bin/pkbvalidator -v $(PKBFILES); \
	else echo 'No test folder found'; \
	fi

kbart-verbose:
	@if test -d platforms; \
	then . ./bin/env; ./bin/pkbvalidator -v -k $(PKBFILES); \
	else echo 'No test folder found'; \
	fi

test-big:
	@if test -d test; \
	then . ./bin/env; mocha -g @big; \
	else echo 'No test folder found'; \
	fi

test-big-verbose:
	@if test -d test; \
	then . ./bin/env; mocha -R list -g @big; \
	else echo 'No test folder found'; \
	fi

tdd:
	@if test -d test; \
	then . ./bin/env; mocha -g @tdd; \
	else echo 'No test folder found'; \
	fi

tdd-verbose:
	@if test -d test; \
	then . ./bin/env; mocha -R list -g @tdd; \
	else echo 'No test folder found'; \
	fi

lint:
	@. ./bin/env; npm run lint

hooks:
	@ln -sf ../../../.git/hooks/pre-commit platforms/.git/hooks/pre-commit

clean-tmp:
	@rm -rf ./tmp/*

# Benchmarks section
# # # # # # # # # # # #

# example: make bench duration=30
bench:
	@test -f /usr/bin/pidstat || sudo apt-get install --yes sysstat
	@test -f /usr/bin/pstree  || sudo apt-get install --yes psmisc
	@test -f /usr/bin/gnuplot || sudo apt-get install --yes gnuplot
	@./bin/runbench

# Build section
# # # # # # # # # # # #

nodejs:
	@test -f /usr/bin/git || sudo apt-get install --yes git
	@./bin/buildnode

node-modules: libs

bower:
	@. ./bin/env; npm run bower

libs:
	@./bin/downloadlibs
	@. ./bin/env; npm install -q

# make deb v=0.0.3
deb:
	@test -f /usr/bin/dpkg-deb || sudo apt-get install --yes dpkg
	@test -f /usr/bin/fakeroot || sudo apt-get install --yes fakeroot
	./bin/builddeb

# make rpm v=0.0.3
rpm:
	@test -f /usr/bin/alien || sudo apt-get install --yes alien
	@test -f /usr/bin/fakeroot || sudo apt-get install --yes fakeroot
	./bin/buildrpm

# tar.gz archive generated
# make tar v=0.0.3
tar:
	./bin/buildtar

# exe installer for windows
exe:
	@test -f /usr/bin/makensis || sudo apt-get install --yes nsis
	./bin/buildexe

release: tar deb rpm exe

clean-for-release:
	test -f ./clean-for-release-flag || ( echo "Warning: do no run this command on your ezpaarse used for devlopements" ; exit 1 )
	rm -f ./test/injection-*-test.js
	rm -f ./test/custom-formats-test.js
	rm -f ./test/deduplication-test.js
	rm -f ./test/pkb-test.js
	rm -rf ./test/dataset/multiformat
	find ./test/dataset/* -size +5k -exec rm {} \;
	rm -rf ./build/
	rm -rf ./misc/
	rm -rf ./ezpaarse-*/
	sed -i 's/development/production/g' ./config.json
	find ./node_modules/ -name "tests"     -type d -exec rm -rf {} \; 2>/dev/null || true
	find ./node_modules/ -name "test"      -type d -exec rm -rf {} \; 2>/dev/null || true
	find ./node_modules/ -name "dist"      -type d -exec rm -rf {} \; 2>/dev/null || true
	find ./node_modules/ -name "build"     -type d -exec rm -rf {} \; 2>/dev/null || true
	find ./node_modules/ -name "example"   -type d -exec rm -rf {} \; 2>/dev/null || true
	find ./node_modules/ -name "examples"  -type d -exec rm -rf {} \; 2>/dev/null || true
	find ./node_modules/ -name "benchmark" -type d -exec rm -rf {} \; 2>/dev/null || true
	rm -f ./clean-for-release-flag

# example: make version v=0.0.3
version:
	@./bin/patch-version-number --version $(v)
	@echo $(v) > VERSION

tag:
	./bin/tagversion

# example: make upload v=0.0.4 o=--force
upload:
	./bin/uploadversion


# Clone or update resources directory
resources-update:
	@if test -d resources; \
	then cd resources; git pull; \
	else git clone https://github.com/ezpaarse-project/ezpaarse-resources.git resources; \
	fi

# Clone or update platforms directory
platforms-update:
	@if test -d platforms; \
	then cd platforms; git pull; \
	else git clone https://github.com/ezpaarse-project/ezpaarse-platforms.git platforms; \
	fi

# Clone or update exclusions directory
exclusions-update:
	@if test -d exclusions; \
	then cd exclusions; git pull; \
	else git clone https://github.com/ezpaarse-project/ezpaarse-exclusions.git exclusions; \
	fi

# Stop the daemon, update to last tag and rebuild
pull: platforms-update exclusions-update resources-update
	@./bin/update-app --rebuild
	@echo "ezPAARSE has been updated."

# Stop the daemon, update to bleeding edge and rebuild
pull-latest: platforms-update exclusions-update resources-update
	@./bin/update-app --latest --rebuild
	@echo "ezPAARSE has been updated."

update: pull
update-latest: pull-latest

.PHONY: test checkconfig nodejs platforms-update exclusions-update resources-update deb rpm tar exe clean-for-release version tag update pull start restart status stop
