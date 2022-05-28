package dtos

import "4ks/libs/go/models"

type CreateRecipe struct {
	Name         string               `json:"name"`
	Author       models.UserSummary   `json:"author"`
	Images       []models.Image       `json:"images"`
	Instructions []models.Instruction `json:"instructions"`
}