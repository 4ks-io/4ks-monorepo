// Package dtos is the interface for the api dtos
package dtos

import "4ks/libs/go/models"

// CreateRecipe godoc
type CreateRecipe struct {
	Name         string                      `json:"name"`
	Link         string                      `json:"link"`
	Author       models.UserSummary          `json:"-"` // Author is auto-populated using the request context
	Instructions []models.Instruction        `json:"instructions"`
	Ingredients  []models.Ingredient         `json:"ingredients"`
	Banner       []models.RecipeMediaVariant `json:"banner"`
}

// UpdateRecipe godoc
type UpdateRecipe struct {
	Name         string                      `json:"name"`
	Link         string                      `json:"link"`
	Author       models.UserSummary          `json:"-"` // Author is auto-populated using the request context
	Instructions []models.Instruction        `json:"instructions"`
	Ingredients  []models.Ingredient         `json:"ingredients"`
	Banner       []models.RecipeMediaVariant `json:"banner"`
}

// CreateRecipeMedia godoc
type CreateRecipeMedia struct {
	Filename string `json:"filename" binding:"required"`
}

// GetRecipesByUsernameResponse is return by the GetRecipesByUsername endpoint
type GetRecipesByUsernameResponse struct {
	Data []*models.Recipe `json:"data"`
}

// GetRecipeMediaResponse is return by the GetRecipeMedia endpoint
type GetRecipeMediaResponse struct {
	Data []*models.RecipeMedia `json:"data"`
}