package router

import (
	"github.com/gin-gonic/gin"

	controllers "4ks/apps/api/controllers"
	"4ks/apps/api/middleware"
)

func RecipesRouterAuth(router *gin.Engine) {
	rc := controllers.NewRecipeController()

	bot := router.Group("/bot")
	{
		bot.POST("/recipes", middleware.Authorize("/bot/*", "write"), rc.BotCreateRecipe)
	}

	recipes := router.Group("/recipes")
	{
		recipes.POST("", rc.CreateRecipe)
		recipes.PATCH(":id", rc.UpdateRecipe)
		recipes.POST(":id/star", rc.StarRecipe)
		recipes.POST(":id/fork", rc.ForkRecipe)
		// create recipeMedia in init status + return signedUrl
		recipes.POST(":id/media", rc.CreateRecipeMedia)
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
