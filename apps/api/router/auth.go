package router

import (
	"context"
	"fmt"

	"github.com/gin-gonic/gin"
	adapter "github.com/gwatts/gin-adapter"

	"4ks/apps/api/middleware"
	"4ks/apps/api/utils"
)

var CASBIN_VERBOSE = true

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
	// fmt.Println(c.Request.Header)

	userEmail := c.Request.Context().Value(utils.UserEmail{}).(string)
	fmt.Println(userEmail)

	userId := c.Request.Context().Value(utils.UserId{}).(string)
	fmt.Println(userId)

	claims := utils.ExtractClaimsFromRequest(c.Request)
	// customClaims := utils.ExtractCustomClaimsFromClaims(&claims)

	c.JSON(200, claims)
}

func AuthRouter(router *gin.Engine) {
	// validate jwt
	router.Use(adapter.Wrap(middleware.EnsureValidToken()))

	// append auth0 claims to context
	router.Use(func(ctx *gin.Context) {
		claims := utils.ExtractClaimsFromRequest(ctx.Request)
		customClaims := utils.ExtractCustomClaimsFromClaims(&claims)

		newContext := context.WithValue(ctx.Request.Context(), utils.UserEmail{}, customClaims.Email)
		newContext = context.WithValue(newContext, utils.UserId{}, customClaims.Id)
		ctx.Request = ctx.Request.WithContext(newContext)

		ctx.Next()
	})

	router.GET("/auth-test", TestJWTAuth)
}
