// package main is the entrypoint for the api
package main

import (
	"bufio"
	"context"
	"os"
	"strings"

	_ "4ks/apps/api/docs"

	controllers "4ks/apps/api/controllers"
	middleware "4ks/apps/api/middleware"
	fetcherService "4ks/apps/api/services/fetcher"
	recipeService "4ks/apps/api/services/recipe"
	searchService "4ks/apps/api/services/search"
	staticService "4ks/apps/api/services/static"
	userService "4ks/apps/api/services/user"
	utils "4ks/apps/api/utils"
	pb "4ks/libs/go/pubsub"
	tracing "4ks/libs/go/tracer"

	"cloud.google.com/go/firestore"
	"cloud.google.com/go/pubsub"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	adapter "github.com/gwatts/gin-adapter"
	"github.com/rs/zerolog/log"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	ginprometheus "github.com/zsais/go-gin-prometheus"
	"go.opentelemetry.io/contrib/instrumentation/github.com/gin-gonic/gin/otelgin"
)

// Controllers contains the controllers
type Controllers struct {
	User   controllers.UserController
	Recipe controllers.RecipeController
	Search controllers.SearchController
	System controllers.SystemController
}

// getAPIVersion returns the api version stored in the VERSION file
func getAPIVersion() string {
	version := "0.0.0"
	if os.Getenv("VERSION_FILE_PATH") != "" {
		path := utils.GetStrEnvVar("VERSION_FILE_PATH", "/VERSION")
		v, err := os.ReadFile(path)
		if err != nil {
			panic(err)
		}
		version = strings.TrimSuffix(string(v), "\n")
	}
	return version
}

// RouteOpts contains the paths for the router
type RouteOpts struct {
	SwaggerEnabled bool
	SwaggerPrefix  string
	Version        string
	StaticPath     string
}

// EnforceAuth enforces authentication
func EnforceAuth(r *gin.RouterGroup) {
	r.Use(adapter.Wrap(middleware.EnforceJWT()))
	r.Use(middleware.AppendCustomClaims())
}

// AppendRoutes appends routes to the router
func AppendRoutes(sysFlags *utils.SystemFlags, r *gin.Engine, c *Controllers, o *RouteOpts) {
	// system
	r.GET("/api/ready", c.System.CheckReadiness)
	r.GET("/api/healthcheck", c.System.Healthcheck)
	r.GET("/api/version", c.System.GetAPIVersion(o.Version))

	// api
	api := r.Group("/api")
	{
		// otel
		if sysFlags.JaegerEnabled {
			api.Use(otelgin.Middleware("4ks-api"))
		}

		// swagger
		if value := o.SwaggerEnabled; value {
			log.Info().Caller().Bool("enabled", value).Str("prefix", o.SwaggerPrefix).Msg("Swagger")
			swaggerURL := ginSwagger.URL(o.SwaggerPrefix + "/swagger/doc.json") // The url pointing to API definition
			api.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler, swaggerURL))
		}

		// speed up data seeding
		if sysFlags.Development {
			develop := api.Group("/_dev")
			{
				develop.POST("/recipes", c.Recipe.BotCreateRecipe)
				develop.POST("/init-search-collections", c.Search.CreateSearchRecipeCollection)
			}
		}

		// recipes
		recipes := api.Group("/recipes")
		{
			recipes.GET("/:id", c.Recipe.GetRecipe)
			recipes.GET("/", c.Recipe.GetRecipes)
			recipes.GET("/:id/revisions", c.Recipe.GetRecipeRevisions)
			recipes.GET("/revisions/:revisionID", c.Recipe.GetRecipeRevision)
			recipes.GET("/:id/media", c.Recipe.GetRecipeMedia)
			recipes.GET("/author/:username", c.Recipe.GetRecipesByUsername)

			// authenticated routes below this line
			EnforceAuth(recipes)

			recipes.POST("/", c.Recipe.CreateRecipe)
			recipes.POST("/fetch", c.Recipe.FetchRecipe)
			recipes.PATCH("/:id", c.Recipe.UpdateRecipe)
			recipes.POST("/:id/star", c.Recipe.StarRecipe)
			recipes.POST("/:id/fork", c.Recipe.ForkRecipe)
			// create recipeMedia in init status + return signedURL
			recipes.POST("/:id/media", c.Recipe.CreateRecipeMedia)
			recipes.DELETE("/:id", c.Recipe.DeleteRecipe)
		}

		// authenticated routes below this line
		EnforceAuth(api)

		user := api.Group("/user")
		{
			user.HEAD("/", c.User.HeadAuthenticatedUser)
			user.GET("/", c.User.GetAuthenticatedUser)
			user.POST("/", c.User.CreateUser)
			user.PATCH("/", c.User.UpdateUser)
			user.DELETE("/events/:id", c.User.RemoveUserEvent)
		}
		users := api.Group("/users")
		{
			users.DELETE("/:id", middleware.Authorize("/users/*", "delete"), c.User.DeleteUser)
			users.POST("/username", c.User.TestUsername)
			users.POST("/", c.User.CreateUser)
			// users.GET("profile", c.User.GetAuthenticatedUser)
			// users.GET("exist", c.User.GetAuthenticatedUserExist)
			users.GET("", middleware.Authorize("/users/*", "list"), c.User.GetUsers)
			users.GET(":id", c.User.GetUser)
			users.PATCH(":id", c.User.UpdateUser)

			// users.GET("", middleware.Authorize("/users/*", "list"), c.User.GetUsers)
			// users.DELETE(":id", middleware.Authorize("/users/*", "delete"), c.User.DeleteUser)
			// users.POST("username", c.User.TestUsername)
			// users.GET(":id", c.User.GetUser)
		}

		// admin
		admin := api.Group("/_admin")
		{
			admin.POST("/recipes", middleware.Authorize("/recipes/*", "create"), c.Recipe.BotCreateRecipe)
			admin.GET("/recipes/:id/media", middleware.Authorize("/recipes/*", "list"), c.Recipe.GetAdminRecipeMedias)
			admin.POST("/init-search-collections", middleware.Authorize("/search/*", "create"), c.Search.CreateSearchRecipeCollection)
		}
	}
}

// @title 4ks API
// @version 2.0
// @description This is the 4ks api

// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name Authorization
func main() {
	// args
	sysFlags := utils.SystemFlags{
		Debug:         utils.GetStrEnvVar("GIN_MODE", "release") == "debug",
		Development:   utils.GetBoolEnv("IO_4KS_DEVELOPMENT", false),
		JaegerEnabled: utils.GetBoolEnv("JAEGER_ENABLED", false),
	}

	// firestore
	firstoreProjectID := os.Getenv("FIRESTORE_PROJECT_ID")
	if firstoreProjectID == "" {
		panic("FIRESTORE_PROJECT_ID required")
	}
	if value, ok := os.LookupEnv("FIRESTORE_EMULATOR_HOST"); ok {
		log.Printf("Using Firestore Emulator: '%s'", value)
	}

	// pubsub
	pubsubProjectID := os.Getenv("PUBSUB_PROJECT_ID")
	if pubsubProjectID == "" {
		panic("PUBSUB_PROJECT_ID required")
	}
	if value, ok := os.LookupEnv("PUBSUB_EMULATOR_HOST"); ok {
		log.Printf("Using PubSub Emulator: '%s'", value)
	}

	// load reserved words
	reservedWordsFile := utils.GetStrEnvVar("AUDITLAB_RESERVED_WORDS_FILE", "./reserved-words")
	reservedWords, err := ReadWordsFromFile(reservedWordsFile)
	if err != nil {
		panic(err)
	}

	// jaeger
	if sysFlags.JaegerEnabled {
		log.Info().Caller().Bool("enabled", sysFlags.JaegerEnabled).Msg("Jaeger")
		tp := tracing.InitTracerProvider()
		defer func() {
			if err := tp.Shutdown(context.Background()); err != nil {
				log.Error().Caller().Err(err).Msg("Error shutting down tracer provider")
			}
		}()
	}

	// database
	var ctx = context.Background()
	var store, _ = firestore.NewClient(ctx, firstoreProjectID)

	// Create a Pub/Sub client.
	client, err := pubsub.NewClient(ctx, pubsubProjectID)
	if err != nil {
		log.Error().Caller().Err(err).Str("project", pubsubProjectID).Msg("failed to create pubsub client")
		panic(err)
	}
	defer client.Close()
	log.Info().Caller().Str("project", pubsubProjectID).Msg("pubsub client created")

	// pubsub request/receiver options
	reqo := pb.PubsubOpts{
		ProjectID:      pubsubProjectID,
		TopicID:        "fetch-responses",
		SubscriptionID: "fetch-responses",
	}

	// pubsub response/sender options
	reso := pb.PubsubOpts{
		ProjectID: pubsubProjectID,
		TopicID:   "fetch-requests",
	}

	// services
	v := validator.New()
	search := searchService.New()
	static := staticService.New()
	user := userService.New(&sysFlags, store, v, &reservedWords)
	recipe := recipeService.New(&sysFlags, store, v)
	fetcher := fetcherService.New(ctx, &sysFlags, client, reqo, reso, user, recipe, search, static)

	go (func() {
		if err := fetcher.Start(); err != nil {
			log.Error().Caller().Err(err).Msg("Error starting fetcher service")
			panic(err)
		}
	})()

	// controllers
	c := &Controllers{
		System: controllers.NewSystemController(),
		Recipe: controllers.NewRecipeController(user, recipe, search, static, fetcher),
		User:   controllers.NewUserController(user),
		Search: controllers.NewSearchController(),
	}

	// gin and middleware
	router := gin.New()
	router.Use(gin.Recovery())
	router.SetTrustedProxies(nil)
	router.Use(middleware.ErrorHandler)
	router.Use(middleware.CorsMiddleware())
	if sysFlags.Debug {
		router.Use(middleware.DefaultStructuredLogger())
	}

	// metrics
	prom := ginprometheus.NewPrometheus("gin")
	prom.Use(router)

	o := &RouteOpts{
		SwaggerEnabled: utils.GetBoolEnv("SWAGGER_ENABLED", false),
		SwaggerPrefix:  utils.GetStrEnvVar("SWAGGER_URL_PREFIX", ""),
		Version:        getAPIVersion(),
	}

	AppendRoutes(&sysFlags, router, c, o)

	addr := "0.0.0.0:" + utils.GetStrEnvVar("PORT", "5000")
	if err := router.Run(addr); err != nil {
		log.Error().Caller().Err(err).Msg("Error starting http server")
		panic(err)
	}
}

// ReadWordsFromFile reads words from a file
func ReadWordsFromFile(filename string) ([]string, error) {
	file, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var words []string
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		words = append(words, scanner.Text())
	}

	if err := scanner.Err(); err != nil {
		return nil, err
	}
	return words, nil
}
