package dtos

import "4ks/libs/go/models"

type CreateRecipe struct {
	Title  string
	Author models.Author
	Images []struct {
		Id  string
		Url string
	}
}
