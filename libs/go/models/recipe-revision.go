package models

import "time"

type Image struct {
	Id  string `firestore:"id" json:"id"`
	Url string `firestore:"url" json:"url"`
}

type RecipeRevision struct {
	Id          string    `firestore:"-" json:"id"`
	RecipeId    string    `firestore:"recipeId" json:"recipeId"`
	Author      Author    `firestore:"author" json:"author"`
	Images      []Image   `firestore:"images" json:"images"`
	CreatedDate time.Time `firestore:"createdDate" json:"createdDate"`
	UpdatedDate time.Time `firestore:"updatedDate" json:"updatedDate"`
}
