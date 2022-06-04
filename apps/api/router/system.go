package router

import (
	"github.com/gin-gonic/gin"

	controllers "4ks/apps/api/controllers"
)

// GetAPIVersion godoc
// @Summary 		Get API Version
// @Description Get API Version
// @Tags 				API
// @Accept 			json
// @Produce 		json
// @Success 		200 		 {string} data
// @Router 			/version [get]
func GetAPIVersion(c *gin.Context) {
	c.JSON(200, gin.H{
		"data": "0.1.0",
	})
}

func SystemRouter(router *gin.Engine) {
	systemCtlr := controllers.NewSystemController()
	router.GET("/version", GetAPIVersion)
	router.GET("/ready", systemCtlr.CheckReadiness)
}
