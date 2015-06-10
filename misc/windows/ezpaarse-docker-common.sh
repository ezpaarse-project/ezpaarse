#!/bin/bash
set +e

# clear the MSYS MOTD
clear

WORKDIR="$(dirname "$BASH_SOURCE")"

cd "$WORKDIR"

ISO="$HOME/.boot2docker/boot2docker.iso"
BOOT2DOCKERPATH="/c/Program Files/Boot2Docker for Windows"
GITPATH="/c/Program Files (x86)/Git/bin"
DOCKERIPFILE="$HOME/.boot2docker/boot2dockerIP.txt"
LOGMSG="$WORKDIR/ezpaarse-log.txt"
LOGMSGERR="$WORKDIR/ezpaarse-error-log.txt"
BTDCMD="boot2docker.exe ssh docker"
EZHOME="ezpaarse-home.html"
EZPORT="59599"
EZSTARTUPTIME="10"
HTTP_PROXY="http://proxyout.inist.fr:8080"

export PATH="$PATH:$GITPATH"
export HTTP_PROXY="http://proxyout.inist.fr:8080"
export HTTPS_PROXY="http://proxyout.inist.fr:8080"

function pull_mongo {
  $BTDCMD pull mongo >> $LOGMSG 2>> $LOGMSGERR
}

function pull_ezpaarse {
  $BTDCMD pull ezpaarseproject/ezpaarse:latest >> $LOGMSG 2>> $LOGMSGERR
}

function start_container {
  CONTAINER=$1
   
  RUNNING=$($BTDCMD inspect --format="{{\ .State.Running\ }}" $CONTAINER )
   
  if [ $? -eq 1 ]; then
    echo "UNKNOWN - $CONTAINER does not exist."
    run_$CONTAINER  >> $LOGMSG 2>> $LOGMSGERR
    exit 3
  fi
   
  if [ "$RUNNING" == "false" ]; then
    $BTDCMD start $CONTAINER  >> $LOGMSG 2>> $LOGMSGERR
  fi
}

function load_container {
  CONTAINER=$1
  pull_$CONTAINER
  start_container $CONTAINER
}


function run_mongo {
  $BTDCMD run -d --name mongo mongo >> $LOGMSG 2>> $LOGMSGERR
}

function run_ezpaarse {
  $BTDCMD run -d --name ezpaarse --link mongo:mongo -p 59599:59599 ezpaarseproject/ezpaarse  >> $LOGMSG 2>> $LOGMSGERR
}

function stop_ezpaarse {
  $BTDCMD stop ezpaarse  >> $LOGMSG 2>> $LOGMSGERR
}

function stop_mongo {
  $BTDCMD stop mongo  >> $LOGMSG 2>> $LOGMSGERR
}

function build_profile {
  cat > profile << EOPT
HTTP_PROXY=$HTTP_PROXY
HTTPS_PROXY=$HTTP_PROXY
EOPT

boot2docker ssh sudo cp $WORKDIR/profile /var/lib/boot2docker/profile.sample  >> $LOGMSG 2>> $LOGMSGERR
}

function build_ezpaarse_home {
  EZLOCAL=$(boot2docker.exe ip)
  cat > $EZHOME << EOT
<!DOCTYPE HTML>
 
<meta charset="UTF-8">
<meta http-equiv="refresh" content="1; url=$EZLOCAL:$EZPORT">
 
<script>
  window.location.href = "http://$EZLOCAL:$EZPORT"
</script>
 
<title>Page Redirection</title>
 
<!-- Note: don't tell people to `click` the link, just tell them that it is a link. -->
If you are not redirected automatically, follow the <a href='http://$EZLOCAL:$EZPORT'>link to ezPAARSE</a>

EOT

}

