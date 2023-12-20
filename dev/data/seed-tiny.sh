#!/bin/bash

url=https://local.4ks.io/api/_dev

curl -k -X 'POST' "$url/init-search-collections" \
  -H 'accept: application/json' \
  -d ''

echo ""
echo ""

go run data/upload.go -u $url/recipes -t foo -f data/tiny_dataset.csv

echo "done 20/20