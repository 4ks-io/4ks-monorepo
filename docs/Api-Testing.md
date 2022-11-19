# 4ks Api

See Swagger def @ https://dev.4ks.io/api/swagger/index.html

# Easy API Testing

1. Install the VSCode Extension: "Rest Client" by Huachao Mao
2. Open `api.http` in the root of the repo and add/run api calls from there

```http
POST https://local.4ks.io/api/recipes HTTP/1.1
content-type: application/json

{
    "name": "Hammad's Recipe"
}
```
