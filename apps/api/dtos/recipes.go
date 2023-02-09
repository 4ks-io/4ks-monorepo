package dtos

import "4ks/libs/go/models"

type CreateRecipe struct {
	Name         string                      `json:"name"`
	Link         string                      `json:"link"`
	Author       models.UserSummary          `json:"-"` // Author is auto-populated using the request context
	Instructions []models.Instruction        `json:"instructions"`
	Ingredients  []models.Ingredient         `json:"ingredients"`
	Banner       []models.RecipeMediaVariant `json:"banner"`
}

type UpdateRecipe struct {
	Name         string                      `json:"name"`
	Link         string                      `json:"link"`
	Author       models.UserSummary          `json:"-"` // Author is auto-populated using the request context
	Instructions []models.Instruction        `json:"instructions"`
	Ingredients  []models.Ingredient         `json:"ingredients"`
	Banner       []models.RecipeMediaVariant `json:"banner"`
}

type CreateRecipeMedia struct {
	Filename string `json:"filename" binding:"required"`
}
