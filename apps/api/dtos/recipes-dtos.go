// Package dtos is the interface for the api dtos
package dtos

import (
	"4ks/libs/go/models"

	"github.com/google/uuid"
)

// FetcherCreateRecipe godoc
type FetcherCreateRecipe struct {
	Recipe      CreateRecipe `json:"recipe"`
	UserID      string       `json:"userId"`
	UserEventID uuid.UUID    `json:"userEventId"`
}

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

// GetRecipeResponse is return by the GetRecipe endpoint
type GetRecipeResponse struct {
	Data *models.Recipe `json:"data"`
}

// GetRecipesByUsernameResponse is return by the GetRecipesByUsername endpoint
type GetRecipesByUsernameResponse struct {
	Data []*models.Recipe `json:"data"`
}

// GetRecipeMediaResponse is return by the GetRecipeMedia endpoint
type GetRecipeMediaResponse struct {
	Data []*models.RecipeMedia `json:"data"`
}

// FetchRecipeRequest godoc
type FetchRecipeRequest struct {
	URL string `json:"url"`
}

// FetchRecipeResponse godoc
type FetchRecipeResponse struct {
	URL string `json:"url"`
	ID  string `json:"id"`
}
