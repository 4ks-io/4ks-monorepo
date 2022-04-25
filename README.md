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

# 4ks Data Model

Live Data Model Diagram

https://app.diagrams.net/?src=about#G1FwQB7uxcTfF5QOdGvn2zeyCqIfE6vPUK

![Data Model](/docs/4ksDataModel.png)