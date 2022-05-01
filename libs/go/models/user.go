package models

type User struct {
	_id          string
	username     string
	displayName  string
	emailAddress string
	createdDate  string
	updatedDate  string
}

// Subset of a user that will be nested in a RecipeRevision or Recipe object

type Author struct {
	_id         string
	username    string
	createdDate string
}
