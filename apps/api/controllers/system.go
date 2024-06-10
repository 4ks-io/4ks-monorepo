package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// SystemController is the interface for the systemController
type SystemController interface {
	CheckReadiness(*gin.Context)
	Healthcheck(*gin.Context)
	GetAPIVersion(string) func(*gin.Context)
}

// systemController is the controller for the System endpoints
type systemController struct{}

// NewSystemController creates a new systemController
func NewSystemController() SystemController {
	return &systemController{}
}

// CheckReadiness godoc
//
//	@Summary 		 Checks Readiness
//	@Description Check system readiness by probing downstream services such as the database.
//	@Tags 				System
//	@Accept 			json
//	@Produce 		  json
//	@Success 		  200 		 {string} value
//	@Router       /api/ready [get]
func (sysCtlr *systemController) CheckReadiness(ctx *gin.Context) {
	// tr@ck: check database connection
	ctx.JSON(http.StatusOK, gin.H{
		"status": "ok",
	})
}

// Healthcheck godoc
//
//	@Schemes
//	@Summary 		 healthcheck
//	@Description healthcheck
//	@Tags 			 System
//	@Accept 		 json
//	@Produce 		 json
//	@Router      /api/healthcheck [get]
func (sysCtlr *systemController) Healthcheck(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{
		"status": "Ok",
	})
}

// GetAPIVersion godoc
//
//	@Summary 		 Get API Version
//	@Description Get API Version
//	@Tags 			 System
//	@Accept 		 json
//	@Produce 		 json
//	@Success 		 200 		 {string} value
//	@Router      /api/version [get]
func (sysCtlr *systemController) GetAPIVersion(version string) func(ctx *gin.Context) {
	return func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"data": version,
		})
	}
}
