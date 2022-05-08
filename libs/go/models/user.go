package models

import "time"

type User struct {
	Id           string    `firestore:"-" json:"id"`
	Username     string    `firestore:"username,omitempty" json:"username"`
	DisplayName  string    `firestore:"displayName,omitempty" json:"displayName"`
	EmailAddress string    `firestore:"emailAddress,omitempty" json:"emailAddress"`
	CreatedDate  time.Time `firestore:"createdDate,omitempty" json:"createdDate"`
	UpdatedDate  time.Time `firestore:"updatedDate,omitempty" json:"updatedDate"`
}

// Subset of a user that will be nested in a RecipeRevision or Recipe object

type Author struct {
	Id          string `firestore:"id,omitempty" json:"id"`
	Username    string `firestore:"username,omitempty" json:"username"`
	DisplayName string `firestore:"displayName,omitempty" json:"displayName"`
}
