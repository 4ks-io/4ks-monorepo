package controllers

import "github.com/gin-gonic/gin"

type RecipeController interface {
	CreateRecipe(c *gin.Context)
	GetRecipe(c *gin.Context)
	UpdateRecipe(c *gin.Context)
	ForkRecipe(c *gin.Context)
	StarRecipe(c *gin.Context)
	GetRecipeRevisions(c *gin.Context)
	GetRecipeRevision(c *gin.Context)
}

type recipeController struct {
}

func NewRecipeController() RecipeController {
	return &recipeController{}
}

func (uc *recipeController) CreateRecipe(c *gin.Context) {

}

func (uc *recipeController) GetRecipe(c *gin.Context) {

}

func (uc *recipeController) UpdateRecipe(c *gin.Context) {

}

func (uc *recipeController) ForkRecipe(c *gin.Context) {

}

func (uc *recipeController) StarRecipe(c *gin.Context) {

}

func (rc *recipeController) GetRecipeRevisions(c *gin.Context) {

}

func (rc *recipeController) GetRecipeRevision(c *gin.Context) {

}
