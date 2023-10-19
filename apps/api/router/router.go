package router

import (
	"os"

	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	ginprometheus "github.com/zsais/go-gin-prometheus"
	"go.opentelemetry.io/contrib/instrumentation/github.com/gin-gonic/gin/otelgin"

	controllers "4ks/apps/api/controllers"
	_ "4ks/apps/api/docs"
	"4ks/apps/api/middleware"
	utils "4ks/apps/api/utils"
)

var isLocalDevelopment = os.Getenv("IO_4KS_DEVING")

var (
	SwaggerEnabled = false
	SwaggerPrefix = ""
)

func init() {
	SwaggerEnabled = utils.GetBoolEnv("SWAGGER_ENABLED", false)
	SwaggerPrefix = utils.GetStrEnvVar("SWAGGER_URL_PREFIX", "")
}

func New() *gin.Engine {
	router := gin.New()

	if isLocalDevelopment == "true" {
		router.Use(middleware.DefaultStructuredLogger()) // add logging middleware
	}

	router.Use(gin.Recovery())
	router.SetTrustedProxies(nil)
	router.Use(middleware.CorsMiddleware())

	// prometheus metrics
	prom := ginprometheus.NewPrometheus("gin")
	prom.Use(router)

	systemCtlr := controllers.NewSystemController()
	router.GET("/ready", systemCtlr.CheckReadiness)

	
	router.Use(otelgin.Middleware("4ks-api"))

	api := router.Group("/api")
	{
		// swagger
		if value := SwaggerEnabled; value {
			log.Info().Caller().Bool("enabled", value).Str("prefix", SwaggerPrefix).Msg("Swagger")

			swaggerUrl := ginSwagger.URL(SwaggerPrefix + "/swagger/doc.json") // The url pointing to API definition
			api.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler, swaggerUrl))
		}
		// routes
		SystemRouter(api)
		RecipesRouterUnauth(api)
		AuthRouter(api)
		UsersRouter(api)
		RecipesRouterAuth(api)
		SearchRouter(api)
	}

	return router
}
