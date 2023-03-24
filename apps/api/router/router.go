package router

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	ginprometheus "github.com/zsais/go-gin-prometheus"
	"go.opentelemetry.io/contrib/instrumentation/github.com/gin-gonic/gin/otelgin"

	_ "4ks/apps/api/docs"
	"4ks/apps/api/middleware"
	utils "4ks/apps/api/utils"
)

func New() *gin.Engine {
	var router *gin.Engine
	router = gin.New()
	router.Use(middleware.DefaultStructuredLogger()) // adds our new middleware
	// Recovery middleware recovers from any panics and possibly writes a 500
	router.Use(gin.Recovery())
	router.SetTrustedProxies(nil)
	router.Use(middleware.CorsMiddleware())

	prom := ginprometheus.NewPrometheus("gin")
	prom.Use(router)

	if value := utils.GetBoolEnv("SWAGGER_ENABLED", false); value {
		prefix := utils.GetStrEnvVar("SWAGGER_URL_PREFIX", "")

		log.Info().Msg(fmt.Sprintf("Swagger enabled: %t", value))
		log.Info().Msg(fmt.Sprintf("Swagger url prefix: %s", prefix))

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
