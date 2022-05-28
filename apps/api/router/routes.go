package router

import (
	"github.com/gin-gonic/gin"

	controllers "4ks/apps/api/controllers"
)

func SystemRouter(router *gin.Engine) {
	systemCtlr := controllers.NewSystemController()
	router.GET("/version", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"data": "0.1.0",
		})
	})
	router.GET("/ready", systemCtlr.CheckReadiness)
}

func UsersRouter(router *gin.Engine) {
	uc := controllers.NewUserController()

	users := router.Group("/users")
	{
		users.POST("", uc.CreateUser)
		users.GET(":id", uc.GetUser)
		users.PATCH(":id", uc.UpdateUser)
	}
}

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
