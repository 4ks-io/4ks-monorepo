package router

import (
	"github.com/gin-gonic/gin"

	controllers "4ks/apps/api/controllers"
)

func RecipesRouterAuth(router *gin.Engine) {
	rc := controllers.NewRecipeController()

	recipes := router.Group("/recipes")
	{
		recipes.POST("", rc.CreateRecipe)
		recipes.PATCH(":id", rc.UpdateRecipe)
		recipes.POST(":id/star", rc.StarRecipe)
		recipes.POST(":id/fork", rc.ForkRecipe)
		// create recipeMedia in init status + return signedUrl
		recipes.POST(":id/media", rc.CreateRecipeMedia)
		// recipes.PUT("/media/:mediaId", rc.UpdateRecipeMedia)
		recipes.DELETE(":id", rc.DeleteRecipe)
	}
}

func RecipesRouterUnauth(router *gin.Engine) {
	rc := controllers.NewRecipeController()

	recipes := router.Group("/recipes")
	{
		recipes.GET(":id", rc.GetRecipe)
		recipes.GET("", rc.GetRecipes)
		recipes.GET(":id/revisions", rc.GetRecipeRevisions)
		recipes.GET("/revisions/:revisionId", rc.GetRecipeRevision)
		recipes.GET(":id/media", rc.GetRecipeMedias)
		// recipes.GET("/media/:mediaId", rc.GetRecipeMedia)
	}
}
