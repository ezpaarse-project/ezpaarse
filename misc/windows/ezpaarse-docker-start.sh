#!/bin/bash
set -e

source ezpaarse-docker-common.sh

set +e
echo 'starting...'
boot2docker.exe start  > $LOGMSG 2> $LOGMSGERR
echo

load_container mongo
load_container ezpaarse

$BTDCMD ps

echo "Waiting $STARTUPTIME sec for startup..." 
sleep $STARTUPTIME

explorer ezpaarse-home.html
