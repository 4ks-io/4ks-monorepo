package models

import "time"

type RecipeMetadata struct {
	Stars int32 `firestore:"stars" json:"stars"`
	Forks int32 `firestore:"forks" json:"forks"`
}

type Recipe struct {
	Id              string         `firestore:"id" json:"id"`
	Author          UserSummary    `firestore:"author" json:"author"`
	Contributors    []UserSummary  `firestore:"contributors" json:"contributors"`
	CurrentRevision RecipeRevision `firestore:"currentRevision" json:"currentRevision"`
	Metadata        RecipeMetadata `firestore:"metadata" json:"metadata"`
	Root            string         `firestore:"root" json:"root"`
	Branch          string         `firestore:"branch" json:"branch"`
	CreatedDate     time.Time      `firestore:"createdDate" json:"createdDate"`
	UpdatedDate     time.Time      `firestore:"updatedDate" json:"updatedDate"`
	Media           []RecipeMedia  `firestore:"media" json:"media"`
}

type RecipeSummary struct {
	Id   string `firestore:"id" json:"id"`
	Name string `firestore:"name" json:"name"`
}

type RecipeMedia struct {
	Id  string `firestore:"id" json:"id"`
	Url string `firestore:"url" json:"url"`
}
