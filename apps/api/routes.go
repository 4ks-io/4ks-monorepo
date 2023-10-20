package main

import (
	"github.com/gin-gonic/gin"
	adapter "github.com/gwatts/gin-adapter"
	"github.com/rs/zerolog/log"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"go.opentelemetry.io/contrib/instrumentation/github.com/gin-gonic/gin/otelgin"

	_ "4ks/apps/api/docs"
	"4ks/apps/api/middleware"
)

// RouteOpts contains the paths for the router
type RouteOpts struct {
	SwaggerEnabled bool
	SwaggerPrefix  string
	Version        string
	StaticPath     string
	Debug          bool
}

func EnforceAuth(r *gin.RouterGroup) {
	r.Use(adapter.Wrap(middleware.EnforceJWT()))
	r.Use(middleware.AppendCustomClaims())
}

func AppendRoutes(r *gin.Engine, c *Controllers, o *RouteOpts) {
	// system
	r.GET("/ready", c.System.CheckReadiness)
	r.GET("/healthcheck", c.System.Healthcheck)

	// otel
	r.Use(otelgin.Middleware("4ks-api"))

	// api
	api := r.Group("/api")
	{
		// system
		api.GET("/version", c.System.GetAPIVersion(o.Version))

		// swagger
		if value := o.SwaggerEnabled; value {
			log.Info().Caller().Bool("enabled", value).Str("prefix", o.SwaggerPrefix).Msg("Swagger")
			swaggerUrl := ginSwagger.URL(o.SwaggerPrefix + "/swagger/doc.json") // The url pointing to API definition
			api.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler, swaggerUrl))
		}

		// recipes
		recipes := api.Group("/recipes")
		{
			recipes.GET(":id", c.Recipe.GetRecipe)
			recipes.GET("", c.Recipe.GetRecipes)
			recipes.GET(":id/revisions", c.Recipe.GetRecipeRevisions)
			recipes.GET("revisions/:revisionId", c.Recipe.GetRecipeRevision)
			recipes.GET(":id/media", c.Recipe.GetRecipeMedia)
			recipes.GET("author/:username", c.Recipe.GetRecipesByUsername)

			// authenticated routes below this line
			EnforceAuth(recipes)

			recipes.POST("", c.Recipe.CreateRecipe)
			recipes.PATCH(":id", c.Recipe.UpdateRecipe)
			recipes.POST(":id/star", c.Recipe.StarRecipe)
			recipes.POST(":id/fork", c.Recipe.ForkRecipe)
			// create recipeMedia in init status + return signedUrl
			recipes.POST(":id/media", c.Recipe.CreateRecipeMedia)
			recipes.DELETE(":id", c.Recipe.DeleteRecipe)
		}

		// authenticated routes below this line
		EnforceAuth(api)

		user := api.Group("/user")
		{
			user.HEAD("", c.User.HeadAuthenticatedUser)
			user.GET("", c.User.GetCurrentUser)
			user.POST("", c.User.CreateUser)
			user.PATCH(":id", c.User.UpdateUser)
		}
		users := api.Group("/users")
		{
			users.DELETE(":id", middleware.Authorize("/users/*", "delete"), c.User.DeleteUser)
			users.POST("username", c.User.TestUsername)
			users.POST("", c.User.CreateUser)
			users.GET("profile", c.User.GetCurrentUser)
			users.GET("exist", c.User.GetCurrentUserExist)
			users.GET("", middleware.Authorize("/users/*", "list"), c.User.GetUsers)
			users.GET(":id", c.User.GetUser)
			users.PATCH(":id", c.User.UpdateUser)

			// users.GET("", middleware.Authorize("/users/*", "list"), c.User.GetUsers)
			// users.DELETE(":id", middleware.Authorize("/users/*", "delete"), c.User.DeleteUser)
			// users.POST("username", c.User.TestUsername)
			// users.GET(":id", c.User.GetUser)
		}

		// admin
		admin := api.Group("/_admin/recipes")
		{
			admin.POST("", middleware.Authorize("/recipes/*", "create"), c.Recipe.BotCreateRecipe)
			admin.GET(":id/media", middleware.Authorize("/recipes/*", "list"), c.Recipe.GetAdminRecipeMedias)
			admin.POST("collection-init-recipe", middleware.Authorize("/search/*", "create"), c.Search.CreateSearchRecipeCollection)
		}
	}
}
