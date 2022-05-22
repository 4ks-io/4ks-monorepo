package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)


type SystemController interface {
	CheckReadiness(c *gin.Context)
}

type systemController struct {}


func NewSystemController() SystemController {
	return &systemController{}
}

func (systemCtlr *systemController) CheckReadiness(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{
		"data": "ok",
	})
}