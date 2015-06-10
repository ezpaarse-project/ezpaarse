#!/bin/bash
set -e

source ezpaarse-docker-common.sh

if [ ! -e "$ISO" ]; then
	echo 'copying initial boot2docker.iso (run "boot2docker.exe download" to update)'
	mkdir -p "$(dirname "$ISO")"
	cp "$BOOT2DOCKERPATH/boot2docker.iso" "$ISO"
fi

echo 'initializing...' > $LOGMSG 2> $LOGMSGERR
boot2docker.exe init >> $LOGMSG 2>> $LOGMSGERR
echo

echo 'starting...'
boot2docker.exe start >> $LOGMSG 2>> $LOGMSGERR
echo

# regler les paramètres proxy

echo 'IP address of docker VM:'
boot2docker.exe ip 1> "$DOCKERIPFILE"
cat "$DOCKERIPFILE"

echo 'setting environment variables ...'
boot2docker.exe shellinit | sed  's,\\,\\\\,g' # eval swallows single backslashes in windows style path
eval "$(./boot2docker.exe shellinit 2>/dev/null | sed  's,\\,\\\\,g')"
echo

echo 'Buliding startup HTML file...'
build_ezpaarse_home

echo 'Configuring proxy...'
build_profile

source ezpaarse-docker-start.sh
