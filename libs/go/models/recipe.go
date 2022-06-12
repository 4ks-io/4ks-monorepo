package models

import "time"

type RecipeMetada struct {
	Stars int32 `firestore:"stars" json:"stars"`
	Forks int32 `firestore:"forks" json:"forks"`
}

type Recipe struct {
	Id              string         `firestore:"id" json:"id"`
	Author          UserSummary    `firestore:"author" json:"author"`
	Contributors    []UserSummary  `firestore:"contributors" json:"contributors"`
	CurrentRevision RecipeRevision `firestore:"currentRevision" json:"currentRevision"`
	Metadata        RecipeMetada   `firestore:"metadata" json:"metadata"`
	Source          string         `firestore:"source" json:"source"`
	CreatedDate     time.Time      `firestore:"createdDate" json:"createdDate"`
	UpdatedDate     time.Time      `firestore:"updatedDate" json:"updatedDate"`
}

type RecipeSummary struct {
	Id   string `firestore:"id" json:"id"`
	Name string `firestore:"name" json:"name"`
}
