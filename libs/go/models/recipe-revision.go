package models

type RecipeRevision struct {
	Id     string
	Title  string
	Author Author
	Images []struct {
		Id  string
		Url string
	}
	CreatedDate string
	UpdatedDate string
}
