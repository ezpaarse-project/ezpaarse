#!/bin/bash
set -e

source ezpaarse-docker-common.sh

#set Path=%Path%;C:\Program Files (x86)\Git\bin

export TEST="mon test"
#export PATH="$PATH"

echo "$PATH"
echo "$TEST"
echo "$PATH"

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
