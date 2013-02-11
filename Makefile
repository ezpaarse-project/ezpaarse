# ezPAARSE's Makefile

SHELL:=/bin/bash

# Doc section
# # # # # # # # #

DOC_DIR:=$(shell pwd)/doc
DOC_MD=$(DOC_DIR)
DOC=$(wildcard $(DOC_MD)/*.md)
DOC_OUTPUT=$(shell pwd)/public/doc
DOC_HTML=$(DOC_OUTPUT)/index.html

# Run every steps needed to start ezpaarse
all: build pkb-update checkconfig

# Generate doc with beautiful-docs
$(DOC_HTML): $(DOC)
	@. ./bin/env; bfdocs --base-url='.' $(DOC_MD)/manifest.json $(DOC_OUTPUT)

doc: $(DOC_HTML)

docclean:
	@rm -rf $(DOC_OUTPUT)

docopen: doc $(DOC_HMTL)
	@google-chrome file://$(DOC_HTML) 2>/dev/null &

# Tests section
# # # # # # # # #

EZPATH = $(shell pwd)
JSFILES=$(wildcard $(EZPATH)/*.js) $(wildcard $(EZPATH)/test/*.js)  $(wildcard $(EZPATH)/routes/*.js)

# Runs all tests (*-test.js) in the test folder
test:
	@if test -d test; \
	then . ./bin/env; mocha; \
	else echo 'No test folder found'; \
	fi

test-verbose:
	@if test -d test; \
	then . ./bin/env; mocha -R list; \
	else echo 'No test folder found'; \
	fi

test-platforms:
	@if test -d test; \
	then . ./bin/env; mocha -g parser; \
	else echo 'No test folder found'; \
	fi

test-platforms-verbose:
	@if test -d test; \
	then . ./bin/env; mocha -R list -g parser; \
	else echo 'No test folder found'; \
	fi

jshint:
	@. ./bin/env; jshint $(JSFILES) --config .jshintrc

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

build:
	@test -f /usr/bin/git || sudo apt-get install --yes git
	@./bin/buildnode
	@./build/nvm/bin/latest/npm rebuild >/dev/null
	$(MAKE) doc

# Clone or update pkb folder
pkb-update:
	@if test -d platforms-kb; \
	then cd platforms-kb; git pull; \
	else git clone https://github.com/ezpaarse-project/ezpaarse-pkb.git platforms-kb; \
	fi

deb:
	@test -f /usr/bin/dpkg-deb || sudo apt-get install --yes dpkg
	sudo ./bin/builddeb

rpm: deb
	@test -f /usr/bin/alien || sudo apt-get install --yes alien
	sudo alien --to-rpm --scripts ./ezpaarse-0.0.2_all.deb

# zip and tar.gz archives are generated
zip:
	./bin/buildrelease

clean-for-release:
	test -f ./clean-for-release-flag || ( echo "Warning: do no run this command on your ezpaarse used for devlopements" ; exit 1 )	
	rm -rf ./.git/
	rm -rf ./test/

# example: make version v=0.0.3
version:
	test -f node_modules/glob/package.json     || npm install glob
	test -f node_modules/optimist/package.json || npm install optimist
	./bin/patch-version-number --version $(v)

tag:
	./bin/tagversion

# example: make upload v=0.0.4 o=--force
upload:
	./bin/uploadversion $(v) $(o)

.PHONY: test checkconfig build pkb-update deb rpm release clean-for-release version tag