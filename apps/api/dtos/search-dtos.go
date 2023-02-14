package dtos

type CreateSearchRecipe struct {
	Id           string   `json:"recipeId"`
	Author       string   `json:"author"`
	Name         string   `json:"name"`
	Instructions []string `json:"instructions"`
	Ingredients  []string `json:"ingredients"`
}

// type UpdateSearchRecipe struct {
// 	Name         string                      `json:"name"`
// 	Link         string                      `json:"link"`
// 	Author       models.UserSummary          `json:"-"` // Author is auto-populated using the request context
// 	Instructions []models.Instruction        `json:"instructions"`
// 	Ingredients  []models.Ingredient         `json:"ingredients"`
// 	Banner       []models.RecipeMediaVariant `json:"banner"`
// }
