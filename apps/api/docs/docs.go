// Package docs GENERATED BY SWAG; DO NOT EDIT
// This file was generated by swaggo/swag
package docs

import "github.com/swaggo/swag"

const docTemplate = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{escape .Description}}",
        "title": "{{.Title}}",
        "contact": {},
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/auth-test": {
            "get": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Test JWT Auth",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "API"
                ],
                "summary": "Test JWT Auth",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "/bot/recipes": {
            "post": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Bot Create a new Recipe",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Recipes"
                ],
                "summary": "Bot Create a new Recipe",
                "parameters": [
                    {
                        "description": "Recipe Data",
                        "name": "recipe",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/dtos.CreateRecipe"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.Recipe"
                        }
                    }
                }
            }
        },
        "/recipes": {
            "get": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Get All Recipes",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Recipes"
                ],
                "summary": "Get All Recipes",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/models.Recipe"
                            }
                        }
                    }
                }
            },
            "post": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Create a new Recipe",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Recipes"
                ],
                "summary": "Create a new Recipe",
                "parameters": [
                    {
                        "description": "Recipe Data",
                        "name": "recipe",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/dtos.CreateRecipe"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.Recipe"
                        }
                    }
                }
            }
        },
        "/recipes/revisions/{revisionId}": {
            "get": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Get a Revision By Id",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Recipes"
                ],
                "summary": "Get a Recipe Revision",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Revision Id",
                        "name": "revisionId",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.RecipeRevision"
                        }
                    }
                }
            }
        },
        "/recipes/{recipeId}": {
            "get": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Get a Recipe (by ID)",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Recipes"
                ],
                "summary": "Get a Recipe (by ID)",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Recipe Id",
                        "name": "recipeId",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.Recipe"
                        }
                    }
                }
            },
            "delete": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Delete Recipe",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Recipes"
                ],
                "summary": "Delete Recipe",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Recipe Id",
                        "name": "recipeId",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": ""
                    }
                }
            },
            "patch": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Update Recipe",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Recipes"
                ],
                "summary": "Update Recipe",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Recipe Id",
                        "name": "recipeId",
                        "in": "path",
                        "required": true
                    },
                    {
                        "description": "Recipe Data",
                        "name": "payload",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/dtos.UpdateRecipe"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.Recipe"
                        }
                    }
                }
            }
        },
        "/recipes/{recipeId}/fork": {
            "post": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Fork Recipe",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Recipes"
                ],
                "summary": "Fork Recipe",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Recipe Id",
                        "name": "recipeId",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.Recipe"
                        }
                    }
                }
            }
        },
        "/recipes/{recipeId}/media": {
            "get": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Get all medias for a Recipe",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Recipes"
                ],
                "summary": "Get all medias for a Recipe",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Recipe Id",
                        "name": "recipeId",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/models.RecipeMedia"
                            }
                        }
                    }
                }
            },
            "post": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Create a new Media SignedUrl",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Recipes"
                ],
                "summary": "Create a new Media SignedUrl",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Recipe Id",
                        "name": "recipeId",
                        "in": "path",
                        "required": true
                    },
                    {
                        "description": "Payload",
                        "name": "payload",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/dtos.CreateRecipeMedia"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.CreateRecipeMedia"
                        }
                    }
                }
            }
        },
        "/recipes/{recipeId}/revisions": {
            "get": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Get all revisions for a Recipe",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Recipes"
                ],
                "summary": "Get all revisions for a Recipe",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Recipe Id",
                        "name": "recipeId",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/models.RecipeRevision"
                            }
                        }
                    }
                }
            }
        },
        "/recipes/{recipeId}/star": {
            "post": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Star Recipe",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Recipes"
                ],
                "summary": "Star Recipe",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Recipe Id",
                        "name": "recipeId",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": ""
                    }
                }
            }
        },
        "/users": {
            "get": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Get All Users",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Users"
                ],
                "summary": "Get All Users",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/models.User"
                            }
                        }
                    }
                }
            },
            "post": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Create a new User",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Users"
                ],
                "summary": "Create a new User",
                "parameters": [
                    {
                        "description": "User Data",
                        "name": "user",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/dtos.CreateUser"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.User"
                        }
                    }
                }
            }
        },
        "/users/exist": {
            "get": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Get Current User Exist",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Users"
                ],
                "summary": "Get Current User Exist",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.UserExist"
                        }
                    }
                }
            }
        },
        "/users/profile": {
            "get": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Get Current User",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Users"
                ],
                "summary": "Get Current User",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.User"
                        }
                    }
                }
            }
        },
        "/users/username": {
            "post": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Test if a username exists",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Users"
                ],
                "summary": "Test if a username exists",
                "parameters": [
                    {
                        "description": "Username Data",
                        "name": "username",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/dtos.TestUserName"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.Username"
                        }
                    }
                }
            }
        },
        "/users/{userId}": {
            "get": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Get a User (by ID)",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Users"
                ],
                "summary": "Get a User (by ID)",
                "parameters": [
                    {
                        "type": "string",
                        "description": "User Id",
                        "name": "userId",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.User"
                        }
                    }
                }
            },
            "delete": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Delete User",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Users"
                ],
                "summary": "Delete User",
                "parameters": [
                    {
                        "type": "string",
                        "description": "User Id",
                        "name": "userId",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": ""
                    }
                }
            },
            "patch": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Update User",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Users"
                ],
                "summary": "Update User",
                "parameters": [
                    {
                        "type": "string",
                        "description": "User Id",
                        "name": "userId",
                        "in": "path",
                        "required": true
                    },
                    {
                        "description": "User Data",
                        "name": "payload",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/dtos.UpdateUser"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.User"
                        }
                    }
                }
            }
        },
        "/version": {
            "get": {
                "description": "Get API Version",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "API"
                ],
                "summary": "Get API Version",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "dtos.CreateRecipe": {
            "type": "object",
            "properties": {
                "banner": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/models.RecipeMediaVariant"
                    }
                },
                "ingredients": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/models.Ingredient"
                    }
                },
                "instructions": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/models.Instruction"
                    }
                },
                "link": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                }
            }
        },
        "dtos.CreateRecipeMedia": {
            "type": "object",
            "required": [
                "filename"
            ],
            "properties": {
                "filename": {
                    "type": "string"
                }
            }
        },
        "dtos.CreateUser": {
            "type": "object",
            "required": [
                "displayName",
                "username"
            ],
            "properties": {
                "displayName": {
                    "type": "string"
                },
                "username": {
                    "type": "string"
                }
            }
        },
        "dtos.TestUserName": {
            "type": "object",
            "required": [
                "username"
            ],
            "properties": {
                "username": {
                    "type": "string"
                }
            }
        },
        "dtos.UpdateRecipe": {
            "type": "object",
            "properties": {
                "banner": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/models.RecipeMediaVariant"
                    }
                },
                "ingredients": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/models.Ingredient"
                    }
                },
                "instructions": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/models.Instruction"
                    }
                },
                "link": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                }
            }
        },
        "dtos.UpdateUser": {
            "type": "object",
            "properties": {
                "displayName": {
                    "type": "string"
                },
                "username": {
                    "type": "string"
                }
            }
        },
        "models.CreateRecipeMedia": {
            "type": "object",
            "properties": {
                "recipeMedia": {
                    "$ref": "#/definitions/models.RecipeMedia"
                },
                "signedUrl": {
                    "type": "string"
                }
            }
        },
        "models.Ingredient": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "integer"
                },
                "name": {
                    "type": "string"
                },
                "quantity": {
                    "type": "string"
                },
                "type": {
                    "type": "string"
                }
            }
        },
        "models.Instruction": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "integer"
                },
                "name": {
                    "type": "string"
                },
                "text": {
                    "type": "string"
                },
                "type": {
                    "type": "string"
                }
            }
        },
        "models.Recipe": {
            "type": "object",
            "properties": {
                "author": {
                    "$ref": "#/definitions/models.UserSummary"
                },
                "branch": {
                    "type": "string"
                },
                "contributors": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/models.UserSummary"
                    }
                },
                "createdDate": {
                    "type": "string"
                },
                "currentRevision": {
                    "$ref": "#/definitions/models.RecipeRevision"
                },
                "id": {
                    "type": "string"
                },
                "metadata": {
                    "$ref": "#/definitions/models.RecipeMetadata"
                },
                "root": {
                    "type": "string"
                },
                "updatedDate": {
                    "type": "string"
                }
            }
        },
        "models.RecipeMedia": {
            "type": "object",
            "properties": {
                "bestUse": {
                    "type": "integer"
                },
                "contentType": {
                    "type": "string"
                },
                "createdDate": {
                    "type": "string"
                },
                "id": {
                    "type": "string"
                },
                "ownerId": {
                    "type": "string"
                },
                "recipeId": {
                    "type": "string"
                },
                "rootRecipeId": {
                    "type": "string"
                },
                "status": {
                    "type": "integer"
                },
                "updatedDate": {
                    "type": "string"
                },
                "variants": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/models.RecipeMediaVariant"
                    }
                }
            }
        },
        "models.RecipeMediaVariant": {
            "type": "object",
            "properties": {
                "alias": {
                    "type": "string"
                },
                "filename": {
                    "type": "string"
                },
                "maxWidth": {
                    "type": "integer"
                },
                "url": {
                    "type": "string"
                }
            }
        },
        "models.RecipeMetadata": {
            "type": "object",
            "properties": {
                "forks": {
                    "type": "integer"
                },
                "stars": {
                    "type": "integer"
                }
            }
        },
        "models.RecipeRevision": {
            "type": "object",
            "properties": {
                "author": {
                    "$ref": "#/definitions/models.UserSummary"
                },
                "banner": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/models.RecipeMediaVariant"
                    }
                },
                "createdDate": {
                    "type": "string"
                },
                "id": {
                    "type": "string"
                },
                "ingredients": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/models.Ingredient"
                    }
                },
                "instructions": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/models.Instruction"
                    }
                },
                "link": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                },
                "recipeId": {
                    "type": "string"
                },
                "updatedDate": {
                    "type": "string"
                }
            }
        },
        "models.User": {
            "type": "object",
            "properties": {
                "createdDate": {
                    "type": "string"
                },
                "displayName": {
                    "type": "string"
                },
                "emailAddress": {
                    "type": "string"
                },
                "id": {
                    "type": "string"
                },
                "updatedDate": {
                    "type": "string"
                },
                "username": {
                    "type": "string"
                },
                "usernameLower": {
                    "type": "string"
                }
            }
        },
        "models.UserExist": {
            "type": "object",
            "required": [
                "exist"
            ],
            "properties": {
                "exist": {
                    "type": "boolean"
                }
            }
        },
        "models.UserSummary": {
            "type": "object",
            "properties": {
                "displayName": {
                    "type": "string"
                },
                "id": {
                    "type": "string"
                },
                "username": {
                    "type": "string"
                }
            }
        },
        "models.Username": {
            "type": "object",
            "required": [
                "msg",
                "valid"
            ],
            "properties": {
                "msg": {
                    "type": "string"
                },
                "valid": {
                    "type": "boolean"
                }
            }
        }
    },
    "securityDefinitions": {
        "ApiKeyAuth": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header"
        }
    }
}`

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = &swag.Spec{
	Version:          "1.0",
	Host:             "",
	BasePath:         "/api",
	Schemes:          []string{},
	Title:            "4ks API",
	Description:      "This is the 4ks api",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  docTemplate,
}

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}
