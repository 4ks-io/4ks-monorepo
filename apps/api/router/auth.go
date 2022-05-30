package router

import (
	"encoding/gob"
	"fmt"

	jwtmiddleware "github.com/auth0/go-jwt-middleware/v2"
	"github.com/auth0/go-jwt-middleware/v2/validator"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	adapter "github.com/gwatts/gin-adapter"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"go.opentelemetry.io/contrib/instrumentation/github.com/gin-gonic/gin/otelgin"

	_ "4ks/apps/api/docs"
	"4ks/apps/api/middleware"
)

func New() *gin.Engine {
	router := gin.Default()
	router.Use(middleware.CorsMiddleware())

	swaggerUrl := ginSwagger.URL("https://local.4ks.io/api/swagger/doc.json") // The url pointing to API definition
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler, swaggerUrl))

	// To store custom types in our cookies,
	// we must first register them using gob.Register
	gob.Register(map[string]interface{}{})

	store := cookie.NewStore([]byte("secret"))
	router.Use(sessions.Sessions("auth-session", store))

	// router.Static("/public", "web/static")
	// router.LoadHTMLGlob("web/template/*")
	SystemRouter(router)
	router.Use(otelgin.Middleware("4ks-api"))

	router.Use(adapter.Wrap(middleware.EnsureValidToken()))

	router.GET("/auth-test", func(c *gin.Context) {
		claims := c.Request.Context().Value(jwtmiddleware.ContextKey{}).(*validator.ValidatedClaims)
		customClaims := claims.CustomClaims.(*middleware.CustomClaims)

		fmt.Println(customClaims)

		// payload, err := json.Marshal(claims)
		// if err != nil {
		// 	c.AbortWithStatus(400)
		// }
		c.JSON(200, claims)
	})

	// router.GET("/login", authService.LoginHandler(auth))
	// router.GET("/authback", authService.AuthbackHandler(auth))
	// router.GET("/profile", middleware.IsAuthenticated, authService.ProfileHandler)
	// router.GET("/logout", authService.LogoutHandler)

	UsersRouter(router)
	RecipesRouter(router)

	return router
}
