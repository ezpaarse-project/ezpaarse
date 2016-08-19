# ezPAARSE's Makefile

SHELL:=/bin/bash

all: nodejs node-modules platforms-update middlewares-update exclusions-update resources-update hooks checkconfig ## Runs every steps needed to start ezpaarse

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# Application section
# # # # # # # # # # # #

checkconfig: ## Check node configuration
	@. ./bin/env; if which node > /dev/null; then ./bin/checkconfig; else echo "Node.js was not found" >&2; fi

start: ## Start ezPAARSE in deamon mode
	@./bin/ezpaarse start

stop: ## Stop ezPAARSE started in deamon mode
	@./bin/ezpaarse stop

restart: ## Restart ezPAARSE started in deamon mode
	@./bin/ezpaarse restart

status: ## Get status of ezPAARSE deamon
	@./bin/ezpaarse status

# Tests section
# # # # # # # # #

EZPATH = $(shell pwd)
PKBFILES=$(shell ls $(EZPATH)/platforms/*/pkb/*.txt | grep -v miss)

test: ## Runs all tests (*-test.js) in the test folder except big and tdd
	@if test -d test; \
	then . ./bin/env; mocha -g '@big|@tdd' -i; \
	else echo 'No test folder found'; \
	fi

test-verbose: test-pkb-verbose ## Runs all tests (*-test.js) in the test folder except big and tdd in verbose mode
	@if test -d test; \
	then . ./bin/env; mocha -g '@big|@tdd' -i -R list; \
	else echo 'No test folder found'; \
	fi

test-pkb: ## Runs tests on pkb files (Publisher Knowledge Base)
	@if test -d platforms; \
	then . ./bin/env; ./bin/pkbvalidator --nowarnings $(PKBFILES); \
	else echo 'No test folder found'; \
	fi

test-pkb-verbose: ## Runs tests on pkb files (Publisher Knowledge Base) in verbose mode
	@if test -d platforms; \
	then . ./bin/env; ./bin/pkbvalidator -v $(PKBFILES); \
	else echo 'No test folder found'; \
	fi

test-big: ## Runs big tests
	@if test -d test; \
	then . ./bin/env; mocha -g @big; \
	else echo 'No test folder found'; \
	fi

test-big-verbose: ## Runs big tests in verbose mode
	@if test -d test; \
	then . ./bin/env; mocha -R list -g @big; \
	else echo 'No test folder found'; \
	fi

tdd: ## Runs tdd tests
	@if test -d test; \
	then . ./bin/env; mocha -g @tdd; \
	else echo 'No test folder found'; \
	fi

tdd-verbose: ## Runs tdd tests in verbose mode
	@if test -d test; \
	then . ./bin/env; mocha -R list -g @tdd; \
	else echo 'No test folder found'; \
	fi

lint: ## Runs lint validation
	@. ./bin/env; npm run lint

hooks: ## Create git hook pre-commit
	@ln -sf ../../../.git/hooks/pre-commit platforms/.git/hooks/pre-commit

clean-tmp: ## Clean tmp directory
	@rm -rf ./tmp/*

# Build section
# # # # # # # # # # # #

nodejs: ## Build node for ezpaarse
	@test -f /usr/bin/git || sudo apt-get install --yes git
	@./bin/buildnode

node-modules: libs

bower:
	@. ./bin/env; npm run bower

libs:
	@. ./bin/env; npm install -q --unsafe-perm

version: ## Create a version, example: make version v=0.0.3
	@. ./bin/env; ./bin/patch-version-number --version $(v)
	@echo $(v) > VERSION

tag: ## Tag a version
	./bin/tagversion

middlewares-update: ## Clone or update middelwares directory
	@if test -d middlewares; \
	then cd middlewares; git pull; \
	else git clone https://github.com/ezpaarse-project/ezpaarse-middlewares.git middlewares; \
	fi

resources-update: ## Clone or update resources directory
	@if test -d resources; \
	then cd resources; git pull; \
	else git clone https://github.com/ezpaarse-project/ezpaarse-resources.git resources; \
	fi

platforms-update: ## Clone or update platforms directory
	@if test -d platforms; \
	then cd platforms; git pull; \
	else git clone https://github.com/ezpaarse-project/ezpaarse-platforms.git platforms; \
	fi

exclusions-update: ## Clone or update exclusions directory
	@if test -d exclusions; \
	then cd exclusions; git pull; \
	else git clone https://github.com/ezpaarse-project/ezpaarse-exclusions.git exclusions; \
	fi

pull: platforms-update middlewares-update exclusions-update resources-update ## Stop the daemon, update to last tag and rebuild
	@./bin/update-app --rebuild
	@echo "ezPAARSE has been updated."

pull-latest: platforms-update middlewares-update exclusions-update resources-update ## Stop the daemon, update to bleeding edge and rebuild
	@./bin/update-app --latest --rebuild
	@echo "ezPAARSE has been updated."

update: pull
update-latest: pull-latest

.PHONY: help test checkconfig nodejs platforms-update middlewares-update exclusions-update resources-update version tag update pull start restart status stop
