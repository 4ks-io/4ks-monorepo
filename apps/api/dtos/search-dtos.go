package dtos

// CreateSearchRecipe godoc
type CreateSearchRecipe struct {
	ID          string   `json:"id"`
	Author      string   `json:"author"`
	Name        string   `json:"name"`
	ImageURL    string   `json:"imageURL"`
	Ingredients []string `json:"ingredients"`
}
