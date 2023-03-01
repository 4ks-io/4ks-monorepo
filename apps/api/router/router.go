package router

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	ginprometheus "github.com/zsais/go-gin-prometheus"
	"go.opentelemetry.io/contrib/instrumentation/github.com/gin-gonic/gin/otelgin"

	_ "4ks/apps/api/docs"
	"4ks/apps/api/middleware"
	utils "4ks/apps/api/utils"
)

var isLocalDevelopment = os.Getenv("IO_4KS_DEVING")

func New() *gin.Engine {
	var router *gin.Engine
	if isLocalDevelopment == "true" {
		router = gin.Default()
	} else {
		// disable logging
		router = gin.New()
		// Recovery middleware recovers from any panics and possibly writes a 500
		router.Use(gin.Recovery())
	}
	// disable trustedproxy logic
	router.SetTrustedProxies(nil)
	router.Use(middleware.CorsMiddleware())

	prom := ginprometheus.NewPrometheus("gin")
	prom.Use(router)

	if value := utils.GetBoolEnv("SWAGGER_ENABLED", false); value {
		log.Printf("Swagger enabled: %t", value)

		prefix := utils.GetStrEnvVar("SWAGGER_URL_PREFIX", "")
		log.Printf("Swagger url prefix: %s", prefix)

		swaggerUrl := ginSwagger.URL(prefix + "/swagger/doc.json") // The url pointing to API definition
		router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler, swaggerUrl))
	}

	SystemRouter(router)
	router.Use(otelgin.Middleware("4ks-api"))
	RecipesRouterUnauth(router)
	AuthRouter(router)
	UsersRouter(router)
	RecipesRouterAuth(router)
	SearchRouter(router)

	return router
}
