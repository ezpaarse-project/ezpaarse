# ezPAARSE's Makefile

SHELL:=/bin/bash

all: nodejs node-modules platforms-update middlewares-update exclusions-update resources-update build-nuxt checkconfig ## Runs every steps needed to start ezpaarse

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# Application section
# # # # # # # # # # # #

checkconfig: ## Check node configuration
	@. ./bin/env; if which node > /dev/null; then ./bin/checkconfig; else echo "Node.js was not found" >&2; fi

start: ## Start ezPAARSE in deamon mode
	@./bin/ezpaarse start

start-fg: ## Start ezPAARSE in foreground
	@./bin/ezpaarse start --no-daemon

dev: ## Start ezPAARSE in developpement mode
	@./bin/ezpaarse dev

stop: ## Stop ezPAARSE
	@./bin/ezpaarse stop

restart: ## Restart ezPAARSE
	@./bin/ezpaarse restart

reload: ## Delete the daemonized ezPAARSE instance and starts a new one
	@./bin/ezpaarse reload

wipe: ## Delete the daemonized ezPAARSE instance and kill the PM2 daemon
	@./bin/ezpaarse wipe

status: ## Get the status of ezPAARSE
	@./bin/ezpaarse status

logs: ## Show the logs of ezPAARSE
	@./bin/ezpaarse logs

monitor: ## Monitor ezPAARSE
	@./bin/ezpaarse monitor

# Docker section
# # # # # # # # #

run-prod-docker: ## run ezpaarse in production mode using docker
	@docker compose -f ./docker-compose.yml up -d
	@echo "Listening on http://127.0.0.1:59599/"

run-debug-docker: ## run ezpaarse in debug mode using docker
	@docker compose -f ./docker-compose.debug.yml up -d
	@# attach to the ezpaarse container in order to be able to stop it easily with CTRL+C
	@docker attach ezpaarse

build-docker: ## Build ezpaarseproject/ezpaarse:3.9.2 docker image locally
	@docker build -t ezpaarseproject/ezpaarse:3.9.2 --build-arg http_proxy --build-arg https_proxy .

test-docker: ## Run tests inside the ezpaarse container (needs make run-debug-docker in //)
	@docker exec -it ezpaarse make test

test-docker-verbose: ## Run tests in verbose inside the ezpaarse container (needs make run-debug-docker in //)
	@docker exec -it ezpaarse make test-verbose

# Tests section
# # # # # # # # #

EZPATH = $(shell pwd)
PKBFILES=$(shell ls $(EZPATH)/platforms/*/pkb/*.txt | grep -v miss)

test: ## Runs all tests (*-test.js) in the test folder except big and tdd
	@if test -d test; \
	then . ./bin/env; mocha --exit -g '@big|@tdd' -i; \
	else echo 'No test folder found'; \
	fi

test-verbose: test-pkb-verbose ## Runs all tests (*-test.js) in the test folder except big and tdd in verbose mode
	@if test -d test; \
	then . ./bin/env; mocha --exit -g '@big|@tdd' -i -R list; \
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
	then . ./bin/env; mocha --exit -g @big; \
	else echo 'No test folder found'; \
	fi

test-big-verbose: ## Runs big tests in verbose mode
	@if test -d test; \
	then . ./bin/env; mocha --exit -R list -g @big; \
	else echo 'No test folder found'; \
	fi

tdd: ## Runs tdd tests
	@if test -d test; \
	then . ./bin/env; mocha --exit -g @tdd; \
	else echo 'No test folder found'; \
	fi

tdd-verbose: ## Runs tdd tests in verbose mode
	@if test -d test; \
	then . ./bin/env; mocha --exit -R list -g @tdd; \
	else echo 'No test folder found'; \
	fi

lint: ## Runs lint validation
	@. ./bin/env; npm run lint

clean-tmp: ## Clean tmp directory
	@rm -rf ./tmp/*

# Build section
# # # # # # # # # # # #

nodejs: ## Build node for ezpaarse
	@echo 'Building Node.js...'
	@test -f /usr/bin/git || sudo apt-get install --yes git
	@./bin/buildnode

build-nuxt: ## Build Nuxt App
	@echo 'Building web interface...'
	@. ./bin/env; npm run build

node-modules: libs

libs:
	@echo 'Installing node.js dependencies...'
	@. ./bin/env; npm install --no-save -q --unsafe-perm || (rm ./node_modules -rf && npm install --no-save -q --unsafe-perm)

middlewares-update: ## Clone or update middelwares directory
	@echo 'Updating middlewares...'
	@if test -d middlewares/.git; \
	then cd middlewares; git pull; \
	else git clone https://github.com/ezpaarse-project/ezpaarse-middlewares.git middlewares; \
	fi
	@. ./bin/env; cd middlewares; npm install --no-save -q --unsafe-perm;

resources-update: ## Clone or update resources directory
	@echo 'Updating resources...'
	@if test -d resources/.git; \
	then cd resources; git pull; \
	else git clone https://github.com/ezpaarse-project/ezpaarse-resources.git resources; \
	fi

platforms-update: ## Clone or update platforms directory
	@echo 'Updating platforms...'
	@if test -d platforms/.git; \
	then cd platforms; git pull; \
	else git clone https://github.com/ezpaarse-project/ezpaarse-platforms.git platforms; \
	fi

exclusions-update: ## Clone or update exclusions directory
	@echo 'Updating exclusions...'
	@if test -d exclusions/.git; \
	then cd exclusions; git pull; \
	else git clone https://github.com/ezpaarse-project/ezpaarse-exclusions.git exclusions; \
	fi

pull: ## Stop the daemon, update to last tag and rebuild
	@./bin/update-app --rebuild
	@echo "ezPAARSE has been updated."

pull-latest: ## Stop the daemon, update to bleeding edge and rebuild
	@./bin/update-app --latest --rebuild
	@echo "ezPAARSE has been updated."

update: pull
update-latest: pull-latest

.PHONY: help test checkconfig nodejs platforms-update middlewares-update exclusions-update resources-update version tag update pull start start-fg logs restart dev status stop
