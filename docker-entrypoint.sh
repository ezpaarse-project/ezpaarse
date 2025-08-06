#!/bin/bash
set -e

echo "Updating repositories..."

if ! [ -d middlewares/.git ]; then
  make middlewares-update
else
  echo "Directory 'middlewares' already exists"
fi

if ! [ -d resources/.git ]; then
  make resources-update
else
  echo "Directory 'resources' already exists"
fi

if ! [ -d platforms/.git ]; then
  make platforms-update
else
  echo "Directory 'platforms' already exists"
fi

if ! [ -d exclusions/.git ]; then
  make exclusions-update
else
  echo "Directory 'exclusions' already exists"
fi

exec "$@"