package dtos

type CreateSearchRecipe struct {
	Id           string   `json:"id"`
	Author       string   `json:"author"`
	Name         string   `json:"name"`
	Instructions []string `json:"instructions"`
	Ingredients  []string `json:"ingredients"`
}
