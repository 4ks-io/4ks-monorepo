package dtos

import "4ks/libs/go/models"

type UpdateRecipe struct {
	Name         string               `json:"name"`
	Instructions []models.Instruction `json:"instructions"`
	Images       []models.Image       `json:"images"`
}
