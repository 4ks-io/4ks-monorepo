package router

import (
	"github.com/gin-gonic/gin"

	controllers "4ks/apps/api/controllers"
	"4ks/apps/api/middleware"
)

func RecipesRouterAuth(router *gin.Engine) {
	rc := controllers.NewRecipeController()

	a := router.Group("/_admin/recipes")
	{
		a.POST("", middleware.Authorize("/recipes/*", "create"), rc.BotCreateRecipe)
		a.GET(":id/media", middleware.Authorize("/recipes/*", "list"), rc.GetAdminRecipeMedias)
	}

	r := router.Group("/recipes")
	{
		r.POST("", rc.CreateRecipe)
		r.PATCH(":id", rc.UpdateRecipe)
		r.POST(":id/star", rc.StarRecipe)
		r.POST(":id/fork", rc.ForkRecipe)
		// create recipeMedia in init status + return signedUrl
		r.POST(":id/media", rc.CreateRecipeMedia)
		r.DELETE(":id", rc.DeleteRecipe)
	}
}

func RecipesRouterUnauth(router *gin.Engine) {
	rc := controllers.NewRecipeController()

	r := router.Group("/recipes")
	{
		r.GET(":id", rc.GetRecipe)
		r.GET("", rc.GetRecipes)
		r.GET(":id/revisions", rc.GetRecipeRevisions)
		r.GET("revisions/:revisionId", rc.GetRecipeRevision)
		r.GET(":id/media", rc.GetRecipeMedia)
		r.GET("author/:username", rc.GetRecipesByUsername)
	}
}
