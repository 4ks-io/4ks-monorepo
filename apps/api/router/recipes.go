package router

import (
	"github.com/gin-gonic/gin"

	controllers "4ks/apps/api/controllers"
)

func RecipesRouter(router *gin.Engine) {
	rc := controllers.NewRecipeController()

	recipes := router.Group("/recipes")
	{
		recipes.POST("", rc.CreateRecipe)
		recipes.GET(":id", rc.GetRecipe)
		recipes.PATCH(":id", rc.UpdateRecipe)
		recipes.POST(":id/star", rc.StarRecipe)
		recipes.POST(":id/fork", rc.ForkRecipe)
		recipes.GET(":id/revisions", rc.GetRecipeRevisions)
		recipes.GET("/revisions/:revisionId", rc.GetRecipeRevision)
	}
}
