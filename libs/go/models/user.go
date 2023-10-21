package models

import "time"

type UserExist struct {
	Exist bool `json:"exist" binding:"required"`
}

type User struct {
	ID            string    `firestore:"id" json:"id"`
	Username      string    `firestore:"username,omitempty" json:"username"`
	UsernameLower string    `firestore:"usernameLower,omitempty" json:"usernameLower"`
	DisplayName   string    `firestore:"displayName,omitempty" json:"displayName"`
	EmailAddress  string    `firestore:"emailAddress,omitempty" json:"emailAddress"`
	CreatedDate   time.Time `firestore:"createdDate,omitempty" json:"createdDate"`
	UpdatedDate   time.Time `firestore:"updatedDate,omitempty" json:"updatedDate"`
}

// Subset of a user that will be nested in a RecipeRevision or Recipe object

type UserSummary struct {
	ID          string `firestore:"id,omitempty" json:"id"`
	Username    string `firestore:"username,omitempty" json:"username"`
	DisplayName string `firestore:"displayName,omitempty" json:"displayName"`
}

type Username struct {
	Valid bool   `json:"valid" binding:"required"`
	Msg   string `json:"msg" binding:"required"`
}
