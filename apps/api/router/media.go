package router

import (
	"github.com/gin-gonic/gin"

	controllers "4ks/apps/api/controllers"
)

func MediaRouter(router *gin.Engine) {
	mc := controllers.NewMediaController()
	
	media := router.Group("/media")
	{
		media.POST("/token", mc.GetToken)
	}
}
