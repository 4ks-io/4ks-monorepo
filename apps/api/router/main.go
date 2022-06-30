package router

import (
	"github.com/gin-gonic/gin"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"go.opentelemetry.io/contrib/instrumentation/github.com/gin-gonic/gin/otelgin"

	_ "4ks/apps/api/docs"
	"4ks/apps/api/middleware"
)

func New() *gin.Engine {
	router := gin.Default()
	router.Use(middleware.CorsMiddleware())

	swaggerUrl := ginSwagger.URL("/api/swagger/doc.json") // The url pointing to API definition
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler, swaggerUrl))

	SystemRouter(router)
	router.Use(otelgin.Middleware("4ks-api"))

	RecipesRouterUnauth(router)
	AuthRouter(router)
	UsersRouter(router)
	RecipesRouterAuth(router)

	return router
}
