package dtos

type CreateSearchRecipe struct {
	Id          string   `json:"id"`
	Author      string   `json:"author"`
	Name        string   `json:"name"`
	ImageUrl    string   `json:"imageUrl"`
	Ingredients []string `json:"ingredients"`
}
