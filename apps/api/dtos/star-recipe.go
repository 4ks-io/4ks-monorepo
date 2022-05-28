package dtos

import "4ks/libs/go/models"

type StarRecipe struct {
	User models.UserSummary `json:"user"`
}
