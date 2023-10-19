# data

https://github.com/Glorf/recipenlg

# Upload seed data

To be grant yourself membership to the bot_group in `apps/api/casbin/policy.csv`

The value is your `customClaims.Id`. See `apps/api/middleware/casbin.go`

```
export IO_4KS_API_TOKEN=<bearer token goes here>
export IO_4KS_API_HOSTNAME=local.4ks.io

curl -k -X 'POST' \
  "https://${IO_4KS_API_HOSTNAME}/api/_admin/search/collection-init-recipe" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer ${IO_4KS_API_TOKEN}" \
  -d ''

go run upload.go -f single_dataset.csv
```
