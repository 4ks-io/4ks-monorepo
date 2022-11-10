package controllers

import (
	"4ks/apps/api/dtos"
	mediaService "4ks/apps/api/services/media"
	"fmt"
	"path/filepath"

	"net/http"

	"github.com/gin-gonic/gin"
)

type MediaController interface {
	GetToken(c *gin.Context)
}

type mediaController struct {
	mediaService mediaService.MediaService
}

func NewMediaController() MediaController {
	return &mediaController{
		mediaService: mediaService.New(),
	}
}

// GetToken   godoc
// @Schemes
// @Summary 		Create a new Media
// @Description Create a new Media
// @Tags 				Media
// @Accept 			json
// @Produce 		json
// @Param       payload 	     body      	 dtos.NewMedia  true  "Payload"
// @Success 		200 		       {string} 	 value
// @Router		 	/media/token   [post]
// @Security 		ApiKeyAuth
func (uc *mediaController) GetToken(c *gin.Context) {
	// userId := c.Request.Context().Value(utils.UserId{}).(string)
	// mediaEmail := c.Request.Context().Value(utils.MediaEmail{}).(string)

	payload := dtos.NewMedia{}
	if err := c.BindJSON(&payload); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	// validate file extention
	ext := filepath.Ext(payload.Filename);
	if ext == "" {
		c.AbortWithError(http.StatusBadRequest, fmt.Errorf("Invalid Filename"))
		return
	}

	// validate content type against file extension?
	ct := payload.ContentType

	// &mediaId, &mediaEmail, &payload
	token, err := uc.mediaService.GetToken(&ext, &ct)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, token)
}
