package router

import (
	"github.com/gin-gonic/gin"

	controllers "4ks/apps/api/controllers"
	"4ks/apps/api/middleware"
)

func RecipesRouter(router *gin.Engine) {
	rc := controllers.NewRecipeController()

	recipes := router.Group("/recipes")
	{
		recipes.POST("", middleware.Authorize("/recipes", "POST"), rc.CreateRecipe)
		recipes.GET(":id", middleware.Authorize("/recipes/:id", "GET"), rc.GetRecipe)
		recipes.PATCH(":id", middleware.Authorize("/recipes/:id", "PATCH"), rc.UpdateRecipe)
		recipes.POST(":id/star", rc.StarRecipe)
		recipes.POST(":id/fork", rc.ForkRecipe)
		recipes.GET(":id/revisions", rc.GetRecipeRevisions)
		recipes.GET("/revisions/:revisionId", rc.GetRecipeRevision)
	}
}
