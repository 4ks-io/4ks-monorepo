package router

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"go.opentelemetry.io/contrib/instrumentation/github.com/gin-gonic/gin/otelgin"

	_ "4ks/apps/api/docs"
	"4ks/apps/api/middleware"
)

func New() *gin.Engine {
	router := gin.Default()
	router.SetTrustedProxies(nil)
	router.Use(middleware.CorsMiddleware())
	
	if value, ok := os.LookupEnv("SWAGGER_ENABLED"); ok {
		log.Printf("Swagger enabled: '%s'", value)

		prefix := ""
		if prefix, ok = os.LookupEnv("SWAGGER_URL_PREFIX"); ok {
			log.Printf("Swagger url prefix: '%s'", prefix)
		}

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
