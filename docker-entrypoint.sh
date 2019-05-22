#!/bin/bash
set -e

if ! [ -d middlewares/.git ]; then
  make middlewares-update
fi

if ! [ -d resources/.git ]; then
  make resources-update
fi

if ! [ -d platforms/.git ]; then
  make platforms-update
fi

if ! [ -d exclusions/.git ]; then
  make exclusions-update
fi

exec "$@"