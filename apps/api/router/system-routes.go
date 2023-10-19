package router

import (
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"

	utils "4ks/apps/api/utils"
)

// GetAPIVersion godoc
// @Summary 		Get API Version
// @Description Get API Version
// @Tags 				API
// @Accept 			json
// @Produce 		json
// @Success 		200 		 {string} value
// @Router 			/version [get]
func GetAPIVersion(version string) func(c *gin.Context) {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"data": version,
		})
	}
}

func SystemRouter(router *gin.RouterGroup) {
	path := utils.GetStrEnvVar("VERSION_FILE_PATH", "/VERSION")
	v, err := os.ReadFile(path)
	if err != nil {
		panic(err)
	}
	router.GET("/version", GetAPIVersion(strings.TrimSuffix(string(v), "\n")))
}
