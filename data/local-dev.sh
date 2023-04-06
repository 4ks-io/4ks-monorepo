#!/bin/bash

export IO_4KS_API_TOKEN=$1
export IO_4KS_API_HOSTNAME=local.4ks.io

curl -X 'POST' \
  "https://${IO_4KS_API_HOSTNAME}/api/_admin/search/collection-init-recipe" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer ${IO_4KS_API_TOKEN}" \
  -d ''

go run upload.go -f single_dataset.csv