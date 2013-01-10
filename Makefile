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
all: build checkconfig

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
	@. ./bin/env; mocha

test-verbose:
	@. ./bin/env; mocha --reporter list

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
status:
	@./bin/ezpaarse status

# Benchmarks section
# # # # # # # # # # # #

PID:=`cat $(shell pwd)/ezpaarse.pid`
bench:
	@test -f /usr/bin/pidstat || sudo apt-get install --yes psmisc
	@test -f /usr/bin/pstree  || sudo apt-get install --yes sysstat
	@test -f /usr/bin/gnuplot || sudo apt-get install --yes gnuplot
	@. ./bin/env; \
	echo "Starting ezPAARSE bench (please wait 120 seconds)."; \
	./bin/logfaker --duration=120 --rate=500 | ./bin/loginjector | ./bin/monitor --pid=$(PID) --each=2 > ./bench.csv; \
	gnuplot ./misc/monitor.gplot > ./bench.png; \
	echo "ezPAARSE bench finished."; \
	echo "./bench.csv contains bench result data"; \
	echo "./bench.png contains bench result plot"

# Build section
# # # # # # # # # # # #


build:
	@./bin/buildnode
	@./build/nvm/bin/latest/npm rebuild >/dev/null
	$(MAKE) doc

deb:
	sudo ./bin/builddeb

rpm: deb
	sudo alien --to-rpm --scripts ./ezpaarse-0.0.2_all.deb

.PHONY: test checkconfig build deb
