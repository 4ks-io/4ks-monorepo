To be grant yourself membership to the bot_group in `apps/api/casbin/policy.csv`

The value is your `customClaims.Id`. See `apps/api/middleware/casbin.go`

```
export IO_4KS_API_TOKEN=<bearer token goes here>
export IO_4KS_API_HOSTNAME=dev.4ks.io
go run upload.go -f single_dataset.csv
```

Download complete dataset from
https://recipenlg.cs.put.poznan.pl/

(https://recipenlg.cs.put.poznan.pl/dataset)
