package controllers

import (
	mediaService "4ks/apps/api/services/media"

	"net/http"

	"github.com/gin-gonic/gin"
)

type MediaController interface {
	CreateMedia(c *gin.Context)
}

type mediaController struct {
	mediaService mediaService.MediaService
}

func NewMediaController() MediaController {
	return &mediaController{
		mediaService: mediaService.New(),
	}
}

// CreateMedia   godoc
// @Schemes
// @Summary 		Create a new Media
// @Description Create a new Media
// @Tags 				Medias
// @Accept 			json
// @Produce 		json
// @Param       media     body  	   dtos.CreateMedia  true  "Media Data"
// @Success 		200 		 {object} 	 models.Media
// @Router		 	/medias   [post]
// @Security 		ApiKeyAuth
func (uc *mediaController) CreateMedia(c *gin.Context) {
	// userId := c.Request.Context().Value(utils.UserId{}).(string)
	// mediaEmail := c.Request.Context().Value(utils.MediaEmail{}).(string)

	// payload := dtos.CreateMedia{}
	// if err := c.BindJSON(&payload); err != nil {
	// 	c.AbortWithError(http.StatusBadRequest, err)
	// 	return
	// }

	
	// &mediaId, &mediaEmail, &payload
	createdToken, err := uc.mediaService.GetToken()
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, createdToken)
}
