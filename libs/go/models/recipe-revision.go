package models

import "time"

type Image struct {
	ID  string `firestore:"id" json:"id"`
	Url string `firestore:"url" json:"url"`
}

type Instruction struct {
	ID   int    `firestore:"id" json:"id"`
	Type string `firestore:"type" json:"type"`
	Name string `firestore:"name" json:"name"`
	Text string `firestore:"text" json:"text"`
}

type Ingredient struct {
	ID       int    `firestore:"id" json:"id"`
	Type     string `firestore:"type" json:"type"`
	Name     string `firestore:"name" json:"name"`
	Quantity string `firestore:"quantity" json:"quantity"`
}

type RecipeRevision struct {
	ID           string               `firestore:"id" json:"id"`
	Name         string               `firestore:"name" json:"name"`
	Link         string               `firestore:"link" json:"link"`
	RecipeId     string               `firestore:"recipeId" json:"recipeId"`
	Author       UserSummary          `firestore:"author" json:"author"`
	Instructions []Instruction        `firestore:"instructions" json:"instructions"`
	Ingredients  []Ingredient         `firestore:"ingredients" json:"ingredients"`
	Banner       []RecipeMediaVariant `firestore:"banner" json:"banner"`
	CreatedDate  time.Time            `firestore:"createdDate" json:"createdDate"`
	UpdatedDate  time.Time            `firestore:"updatedDate" json:"updatedDate"`
}
