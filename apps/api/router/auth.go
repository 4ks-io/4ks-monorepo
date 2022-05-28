package router

import (
	"encoding/gob"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	adapter "github.com/gwatts/gin-adapter"
	"go.opentelemetry.io/contrib/instrumentation/github.com/gin-gonic/gin/otelgin"

	"4ks/apps/api/middleware"
)

// New registers the routes and returns the router.
func New() *gin.Engine {
	router := gin.Default()
	router.Use(middleware.CorsMiddleware())

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
		c.JSON(200, gin.H{
			"data": "0.1.0",
		})
	})

	// router.GET("/login", authService.LoginHandler(auth))
	// router.GET("/authback", authService.AuthbackHandler(auth))
	// router.GET("/profile", middleware.IsAuthenticated, authService.ProfileHandler)
	// router.GET("/logout", authService.LogoutHandler)

	UsersRouter(router)
	RecipesRouter(router)

	return router
}
