package dtos

import "4ks/libs/go/models"

type CreateRecipe struct {
	Title  string         `json:"title"`
	Author models.Author  `json:"author"`
	Images []models.Image `json:"images"`
}
