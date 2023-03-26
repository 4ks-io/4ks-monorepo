# Typesense

http://localhost:8108/stats.json
x-typesense-api-key: local-4ks-api-key

# env var

export TYPESENSE_API_KEY=<foo>

# dev

export URL=m5wzvue301hkiy9gp-1.a1.typesense.net

# add a field

```
curl "https://${URL}/collections/recipes" \
  -X PATCH \
  -H "Content-Type: application/json" \
  -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
  -d '{
  "fields": [{"name": "imageUrl", "type": "string","index": false, "optional": true }]}'
```

# drop a field

```
curl "https://${URL}/collections/recipes" \
  -X PATCH \
  -H "Content-Type: application/json" \
  -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
  -d '{
    "fields": [
      {"name": "instructions", "drop": true }
    ]
  }'
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
