package models

type RecipeMetada struct {
	stars int32
	forks int32
}

type Recipe struct {
	_id             string
	currentRevision RecipeRevision
	metadata        RecipeMetada
	source          string
	createdDate     string
	updatedDate     string
}
