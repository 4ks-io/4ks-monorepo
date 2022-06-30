package dtos

import "4ks/libs/go/models"

type CreateRecipe struct {
	Name         string               `json:"name"`
	Author       models.UserSummary   `json:"-"` // We populate the author using the request context and hence dont want this sent in the api
	Images       []models.Image       `json:"images"`
	Instructions []models.Instruction `json:"instructions"`
	Ingredients  []models.Ingredient  `json:"ingredients"`
}
