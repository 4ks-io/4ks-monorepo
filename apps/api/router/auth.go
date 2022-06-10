package router

import (
	"context"
	"fmt"

	"github.com/gin-gonic/gin"
	adapter "github.com/gwatts/gin-adapter"

	"4ks/apps/api/middleware"
	"4ks/apps/api/utils"
)

type UserEmail struct{}

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

	claims := utils.ExtractClaimsFromRequest(c.Request)
	customClaims := utils.ExtractCustomClaimsFromClaims(&claims)

	fmt.Println(customClaims.Email)

	c.JSON(200, claims)
}

func AuthRouter(router *gin.Engine) {
	router.Use(adapter.Wrap(middleware.EnsureValidToken()))
	router.Use(func(ctx *gin.Context) {
		claims := utils.ExtractClaimsFromRequest(ctx.Request)
		customClaims := utils.ExtractCustomClaimsFromClaims(&claims)

		newContext := context.WithValue(ctx.Request.Context(), UserEmail{}, customClaims.Email)
		ctx.Request = ctx.Request.WithContext(newContext)
		ctx.Next()
	})
	router.GET("/auth-test", TestJWTAuth)
}
