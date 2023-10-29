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
	BotCreateRecipe(*gin.Context)
	CreateRecipe(*gin.Context)
	DeleteRecipe(*gin.Context)
	GetRecipe(*gin.Context)
	GetRecipes(*gin.Context)
	GetRecipesByUsername(*gin.Context)
	UpdateRecipe(*gin.Context)
	ForkRecipe(*gin.Context)
	StarRecipe(*gin.Context)
	GetRecipeRevisions(*gin.Context)
	GetRecipeRevision(*gin.Context)
	CreateRecipeMedia(*gin.Context)
	GetRecipeMedia(*gin.Context)
	GetAdminRecipeMedias(*gin.Context)
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
