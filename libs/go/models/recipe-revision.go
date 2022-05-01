package models

type RecipeRevision struct {
	_id    string
	title  string
	author Author
	images []struct {
		id  string
		url string
	}
	createdDate string
	updatedDate string
}
