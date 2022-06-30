package models

import "time"

type Image struct {
	Id  string `firestore:"id" json:"id"`
	Url string `firestore:"url" json:"url"`
}

type Instruction struct {
	Type string `firestore:"type" json:"type"`
	Name string `firestore:"name" json:"name"`
	Text string `firestore:"text" json:"text"`
}

type Ingredient struct {
	Type     string `firestore:"type" json:"type"`
	Name     string `firestore:"name" json:"name"`
	Quantity string `firestore:"quantity" json:"quantity"`
}

type RecipeRevision struct {
	Id           string        `firestore:"id" json:"id"`
	Name         string        `firestore:"name" json:"name"`
	RecipeId     string        `firestore:"recipeId" json:"recipeId"`
	Instructions []Instruction `firestore:"instructions" json:"instructions"`
	Ingredients  []Ingredient  `firestore:"ingredients" json:"ingredients"`
	Author       UserSummary   `firestore:"author" json:"author"`
	Images       []Image       `firestore:"images" json:"images"`
	CreatedDate  time.Time     `firestore:"createdDate" json:"createdDate"`
	UpdatedDate  time.Time     `firestore:"updatedDate" json:"updatedDate"`
}
