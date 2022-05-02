package models

import "time"

type User struct {
	Id           string    `firestore:"id,omitempty"`
	Username     string    `firestore:"username,omitempty"`
	DisplayName  string    `firestore:"displayName,omitempty"`
	EmailAddress string    `firestore:"emailAddress,omitempty"`
	CreatedDate  time.Time `firestore:"createdDate,omitempty"`
	UpdatedDate  time.Time `firestore:"updatedDate,omitempty"`
}

// Subset of a user that will be nested in a RecipeRevision or Recipe object

type Author struct {
	Id          string    `firestore:"id,omitempty"`
	Username    string    `firestore:"username,omitempty"`
	CreatedDate time.Time `firestore:"createdDate,omitempty"`
}
