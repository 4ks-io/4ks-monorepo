package controllers

import (
	recipeService "4ks/apps/api/services/recipe"
	searchService "4ks/apps/api/services/search"
	staticService "4ks/apps/api/services/static"
	userService "4ks/apps/api/services/user"

	"github.com/gin-gonic/gin"
)

// RecipeController is the interface for the recipe controller
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
	recipeService recipeService.Service
	searchService searchService.Service
	staticService staticService.Service
	userService   userService.Service
}

// NewRecipeController creates a new recipe controller
func NewRecipeController(u userService.Service, r recipeService.Service) RecipeController {
	return &recipeController{
		recipeService: r,
		searchService: searchService.New(),
		userService:   u,
		staticService: staticService.New(),
	}
}
