# ezPAARSE's Makefile

# Doc section
# # # # # # # # #

DOC_DIR:=$(shell pwd)/doc
DOC_MD=$(DOC_DIR)
DOC=$(wildcard $(DOC_MD)/*.md)
DOC_OUTPUT=$(shell pwd)/public/doc
DOC_HTML=$(DOC_OUTPUT)/index.html

# Generated with beautiful-docs
$(DOC_HTML): $(DOC)
	@bfdocs --base-url='.' $(DOC_MD)/manifest.json $(DOC_OUTPUT)

doc: $(DOC_HTML)

doctest:
	@echo $(DOC_HTML) $(DOC)

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
	@mocha

test-verbose:
	@mocha --reporter list

jshint:
	@jshint $(JSFILES) --config .jshintrc

build:
	@npm install -d

# Application section
# # # # # # # # # # # #

checkconfig:
	@if which node > /dev/null; then ./bin/checkconfig; else echo "Node.js was not found" >&2; fi

.PHONY: test checkconfig