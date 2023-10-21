package controllers

import (
	"fmt"
	"path/filepath"
	"sync"

	"net/http"

	"github.com/gin-gonic/gin"

	"4ks/apps/api/dtos"
	recipeService "4ks/apps/api/services/recipe"
	"4ks/apps/api/utils"

	"github.com/rs/xid"
	"github.com/rs/zerolog/log"
)

func getMediaContentType(ext *string) (string, error) {
	switch *ext {
	case ".png":
		return "image/png", nil
	case ".jpeg", ".jpg":
		return "image/jpeg", nil
	case ".gif":
		return "image/gif", nil
	}
	return "", fmt.Errorf("Invalid File Type %s", *ext)
}

// CreateRecipeMedia   godoc
// @Schemes
// @Summary 		Create a new Media SignedURL
// @Description Create a new Media SignedURL
// @Tags 				Recipes
// @Accept 			json
// @Produce 		json
// @Param       recipeID 			 path      	 string  true  "Recipe ID"
// @Param       payload 	     body      	 dtos.CreateRecipeMedia  true  "Payload"
// @Success 		200 		       {object} 	 models.CreateRecipeMedia
// @Router		 	/recipes/{recipeID}/media  [post]
// @Security 		ApiKeyAuth
func (rc *recipeController) CreateRecipeMedia(c *gin.Context) {
	recipeID := c.Param("id")
	userID := c.GetString("id")

	payload := dtos.CreateRecipeMedia{}
	if err := c.BindJSON(&payload); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	// compute and validate file extention/content-type
	ext := filepath.Ext(payload.Filename)
	ct, err := getMediaContentType(&ext)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	mp := utils.MediaProps{
		ContentType: ct,
		Extension:   ext,
		Basename:    xid.New().String(),
	}

	var wg sync.WaitGroup
	wg.Add(2)

	// &mediaId, &mediaEmail, &payload
	signedURL, err1 := rc.recipeService.CreateRecipeMediaSignedURL(&mp, &wg)
	recipeMedia, err2 := rc.recipeService.CreateRecipeMedia(&mp, &recipeID, &userID, &wg)

	if err1 != nil {
		c.AbortWithError(http.StatusInternalServerError, err1)
		return
	} else if err2 != nil {
		c.AbortWithError(http.StatusInternalServerError, err2)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"recipeMedia": recipeMedia,
		"signedURL":   signedURL,
	})
}

// GetRecipeMedia godoc
// @Summary 		Get all medias for a Recipe
// @Description Get all medias for a Recipe
// @Tags 				Recipes
// @Accept 			json
// @Produce 		json
// @Param       recipeID 	path      	string  true  "Recipe ID"
// @Success 		200 		  {array} 	  models.RecipeMedia
// @Router 			/recipes/{recipeID}/media [get]
// @Security 		ApiKeyAuth
func (rc *recipeController) GetRecipeMedia(c *gin.Context) {
	recipeID := c.Param("id")
	recipeMedias, err := rc.recipeService.GetRecipeMedia(&recipeID)
	log.Error().Err(err).Caller().Msg("client: could not create request")

	if err == recipeService.ErrRecipeNotFound {
		c.AbortWithError(http.StatusNotFound, err)
		return
	} else if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, recipeMedias)
}

// GetAdminRecipeMedias godoc
// @Summary 		Get all medias for a Recipe
// @Description Get all medias for a Recipe
// @Tags 				Admin
// @Accept 			json
// @Produce 		json
// @Param       recipeID 	path      	string  true  "Recipe ID"
// @Success 		200 		  {array} 	  models.RecipeMedia
// @Router 			/_admin/recipes/{recipeID}/media [get]
// @Security 		ApiKeyAuth
func (rc *recipeController) GetAdminRecipeMedias(c *gin.Context) {
	recipeID := c.Param("id")
	recipeMedias, err := rc.recipeService.GetRecipeMedia(&recipeID)

	if err == recipeService.ErrRecipeNotFound {
		c.AbortWithError(http.StatusNotFound, err)
		return
	} else if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, recipeMedias)
}
