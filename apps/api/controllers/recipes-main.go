package controllers

import (
	recipeService "4ks/apps/api/services/recipe"
	userService "4ks/apps/api/services/user"

	"github.com/gin-gonic/gin"
)

type RecipeController interface {
	BotCreateRecipe(c *gin.Context)
	CreateRecipe(c *gin.Context)
	DeleteRecipe(c *gin.Context)
	GetRecipe(c *gin.Context)
	GetRecipes(c *gin.Context)
	GetRecipesByUsername(c *gin.Context)
	UpdateRecipe(c *gin.Context)
	ForkRecipe(c *gin.Context)
	StarRecipe(c *gin.Context)
	GetRecipeRevisions(c *gin.Context)
	GetRecipeRevision(c *gin.Context)
	CreateRecipeMedia(c *gin.Context)
	GetRecipeMedia(c *gin.Context)
	GetAdminRecipeMedias(c *gin.Context)
}

type recipeController struct {
	recipeService recipeService.RecipeService
	userService   userService.UserService
}

func NewRecipeController() RecipeController {
	return &recipeController{
		recipeService: recipeService.New(),
		userService:   userService.New(),
	}
}
