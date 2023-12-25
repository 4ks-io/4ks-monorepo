#!/bin/bash

url=https://local.4ks.io/api/_dev

curl -k -X 'POST' "$url/init-search-collections" \
  -H 'accept: application/json' \
  -d ''

go run ./dev/data/upload.go -u $url/recipes -t foo -f data/tiny_dataset.csv