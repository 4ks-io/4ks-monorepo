#!/bin/bash
rm -rf PACKAGE_JSON
find . -type d \( -name node_modules -o -name PACKAGE_JSON \) -prune -false -o -name package.json -exec bash -c 'path={}; d=./PACKAGE_JSON/$(dirname $path); mkdir -p $d ; cp $path $d' \;