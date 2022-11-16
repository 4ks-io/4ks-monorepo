package router

import (
	"log"

	"github.com/gin-gonic/gin"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"go.opentelemetry.io/contrib/instrumentation/github.com/gin-gonic/gin/otelgin"

	_ "4ks/apps/api/docs"
	"4ks/apps/api/middleware"
	utils "4ks/apps/api/utils"
)

func New() *gin.Engine {
	router := gin.Default()
	router.SetTrustedProxies(nil)
	router.Use(middleware.CorsMiddleware())

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

	return router
}
