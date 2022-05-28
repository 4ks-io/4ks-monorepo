package models

import "time"

type RecipeStar struct {
	User        UserSummary   `firestore:"user" json:"user"`
	Recipe      RecipeSummary `firestore:"recipe" json:"recipe"`
	CreatedDate time.Time     `firestore:"createdDate,omitempty" json:"createdDate"`
	UpdatedDate time.Time     `firestore:"updatedDate,omitempty" json:"updatedDate"`
}
