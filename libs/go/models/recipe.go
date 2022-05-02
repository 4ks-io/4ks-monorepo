package models

import "time"

type RecipeMetada struct {
	Stars int32 `firestore:"stars,omitempty"`
	Forks int32 `firestore:"forks,omitempty"`
}

type Recipe struct {
	Id              string         `firestore:"id,omitempty"`
	CurrentRevision RecipeRevision `firestore:"currentRevision,omitempty"`
	Metadata        RecipeMetada   `firestore:"metadata,omitempty"`
	Source          string         `firestore:"source,omitempty"`
	CreatedDate     time.Time      `firestore:"createdDate,omitempty"`
	UpdatedDate     time.Time      `firestore:"updatedDate,omitempty"`
}
