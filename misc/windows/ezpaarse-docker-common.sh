#!/bin/bash
set -e

# clear the MSYS MOTD
clear

cd "$(dirname "$BASH_SOURCE")"

ISO="$HOME/.boot2docker/boot2docker.iso"
BOOT2DOCKERPATH="/c/Program Files/Boot2Docker for Windows"
GITPATH="/c/Program Files (x86)/Git/bin"
DOCKERIPFILE="$HOME/.boot2docker/boot2dockerIP.txt"
LOGMSG="$HOME/.boot2docker/start-msg.log"
LOGMSGERR="$HOME/.boot2docker/start-msg-err.log"
BTDCMD="boot2docker.exe ssh docker" 

export PATH="$PATH:$GITPATH"
export HTTP_PROXY="http://proxyout.inist.fr:8080"
export HTTPS_PROXY="http://proxyout.inist.fr:8080"

function pull_mongo {
  $BTDCMD pull mongo
}

function pull_ezpaarse {
  $BTDCMD pull ezpaarseproject/ezpaarse:latest
}

function start_container {
  CONTAINER=$1
   
  RUNNING=$($BTDCMD inspect --format="{{\ .State.Running\ }}" $CONTAINER )
   
  if [ $? -eq 1 ]; then
    echo "UNKNOWN - $CONTAINER does not exist."
    run_$CONTAINER
    exit 3
  fi
   
  if [ "$RUNNING" == "false" ]; then
    $BTDCMD start $CONTAINER
  fi
}

function load_container {
  CONTAINER=$1
  pull_$CONTAINER
  start_container $CONTAINER
}


function run_mongo {
  $BTDCMD run -d --name mongo mongo 
}

function run_ezpaarse {
  $BTDCMD run -d --name ezpaarse --link mongo:mongo -p 59599:59599 ezpaarseproject/ezpaarse
}

function stop_ezpaarse {
  $BTDCMD stop ezpaarse
}

function stop_mongo {
  $BTDCMD stop mongo
}


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
