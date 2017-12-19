#!/bin/bash

echo -n "Updating ezpaarse platforms:"
make platforms-update

exec ezpaarse start --no-daemon