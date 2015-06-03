#!/bin/bash
set -e

source ezpaarse-docker-common.sh

if [ ! -e "$ISO" ]; then
	echo 'copying initial boot2docker.iso (run "boot2docker.exe download" to update)'
	mkdir -p "$(dirname "$ISO")"
	cp "$BOOT2DOCKERPATH/boot2docker.iso" "$ISO"
fi

echo 'initializing...'
boot2docker.exe init
echo

echo 'starting...'
boot2docker.exe start
echo

# regler les paramètres proxy

echo 'IP address of docker VM:'
boot2docker.exe ip 1> "$DOCKERIPFILE"
cat "$DOCKERIPFILE"

echo 'setting environment variables ...'
boot2docker.exe shellinit | sed  's,\\,\\\\,g' # eval swallows single backslashes in windows style path
eval "$(./boot2docker.exe shellinit 2>/dev/null | sed  's,\\,\\\\,g')"
echo


#set Path=%Path%;C:\Program Files (x86)\Git\bin

export TEST="mon test"
#export PATH="$PATH"

echo "$PATH"
echo "$TEST"
echo "$PATH"

set +e

load_container mongo
load_container ezpaarse

$BTDCMD ps
