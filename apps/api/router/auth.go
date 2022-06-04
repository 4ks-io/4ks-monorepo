package router

import (
	"4ks/apps/api/middleware"
	"fmt"

	jwtmiddleware "github.com/auth0/go-jwt-middleware/v2"
	"github.com/auth0/go-jwt-middleware/v2/validator"
	"github.com/gin-gonic/gin"
	adapter "github.com/gwatts/gin-adapter"
)

// TestAuth godoc
// @Summary 		Test JWT Auth
// @Description Test JWT Auth
// @Tags 				API
// @Accept 			json
// @Produce 		json
// @Success 		200 		{string} value
// @Router 			/auth-test [get]
// @Security 		ApiKeyAuth
func TestJWTAuth(c *gin.Context) {
	fmt.Println(c.Request.Header)

	claims := c.Request.Context().Value(jwtmiddleware.ContextKey{}).(*validator.ValidatedClaims)
	customClaims := claims.CustomClaims.(*middleware.CustomClaims)

	fmt.Println(customClaims.Email)

	c.JSON(200, claims)
}

func AuthRouter(router *gin.Engine) {
	router.Use(adapter.Wrap(middleware.EnsureValidToken()))
	router.GET("/auth-test", TestJWTAuth)
}
