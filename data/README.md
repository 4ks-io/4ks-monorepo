# Typesense

http://localhost:8108/stats.json
x-typesense-api-key: local-4ks-api-key

# Upload seed data

To be grant yourself membership to the bot_group in `apps/api/casbin/policy.csv`

The value is your `customClaims.Id`. See `apps/api/middleware/casbin.go`

```
export IO_4KS_API_TOKEN=<bearer token goes here>
export IO_4KS_API_HOSTNAME=local.4ks.io

curl -X 'POST' \
  "https://${IO_4KS_API_HOSTNAME}/api/_admin/search/collection-init-recipe" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer ${IO_4KS_API_TOKEN}" \
  -d ''

go run upload.go -f single_dataset.csv
```

## delete Typesense collection

```
export TYPESENSE_API_KEY=local-4ks-api-key
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
     -X DELETE \
    "http://localhost:8108/collections/recipes"
```

Download complete dataset from
https://recipenlg.cs.put.poznan.pl/

(https://recipenlg.cs.put.poznan.pl/dataset)
