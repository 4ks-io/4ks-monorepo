# 4ks Data Model

Live Data Model Diagram

https://app.diagrams.net/?src=about#G1FwQB7uxcTfF5QOdGvn2zeyCqIfE6vPUK

![Data Model](/docs/4ksDataModel.png)

# 4ks Architecture Diagram

There are two proposals for an architecture in the diagram below

![Arch Diagram](/docs/arch-diagram.svg)

# Getting started (minikube)

```
minikube start

tilt up

minikube dashboard

docker-compose up

https://local.4ks.io/ (must be added to host file)
```

# Getting started (k3d)

```
k3d cluster create 4ks --registry-create 4ks-registry

tilt up

docker-compose up

https://local.4ks.io/ (must be added to host file)
```

# 4ks Api

## GET /recipes

Search recipes and filter using query params. (i.e current user id, text search, time, etc)

## POST /recipes

Create a new recipe

## GET /recipes/:recipeId

Get a recipe by id

## PUT /recipes/:recipeId

Update a recipe

## POST /recipes/:recipeId/star

Star a recipe

## GET /recipes/:recipeId/revisions

Get basic info for recipe revisions. Filterable using query params i.e date, etc

## GET /recipes/:recipeId/revisions/:revisionId

Get a recipe revision by id

## POST /recipes/:recipeId/fork

Fork a recipe

## GET /user/:userId

Get a user

## POST /user

Create a user

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

# Swagger Gen

1. Make sure you have `swag` installed
```
go install github.com/swaggo/swag/cmd/swag@latest
```
2. Run `pnpm swagger:gen` when you update any doc comments
3. Tilt will sync the files
4. Access Swagger at: https://local.4ks.io/swagger/index.html