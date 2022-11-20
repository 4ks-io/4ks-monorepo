package controllers

import (
	"fmt"
	"path/filepath"
	"sync"

	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"4ks/apps/api/dtos"
	recipeService "4ks/apps/api/services/recipe"
	"4ks/apps/api/utils"
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
// @Summary 		Create a new Media SignedUrl
// @Description Create a new Media SignedUrl
// @Tags 				Recipes
// @Accept 			json
// @Produce 		json
// @Param       recipeId 			 path      	 string  true  "Recipe Id"
// @Param       payload 	     body      	 dtos.CreateRecipeMedia  true  "Payload"
// @Success 		200 		       {object} 	 models.CreateRecipeMedia
// @Router		 	/recipes/{recipeId}/media  [post]
// @Security 		ApiKeyAuth
func (rc *recipeController) CreateRecipeMedia(c *gin.Context) {
	recipeId := c.Param("id")
	userId := c.Request.Context().Value(utils.UserId{}).(string)

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

	filename := uuid.New().String() + ext

	var wg sync.WaitGroup
	wg.Add(2)

	// &mediaId, &mediaEmail, &payload
	signedUrl, err1 := rc.recipeService.CreateRecipeMediaSignedUrl(&filename, &ct, &wg)
	recipeMedia, err2 := rc.recipeService.CreateRecipeMedia(&filename, &ct, &recipeId, &userId, &wg)

	if err1 != nil {
		c.AbortWithError(http.StatusInternalServerError, err1)
		return
	} else if err2 != nil {
		c.AbortWithError(http.StatusInternalServerError, err2)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"recipeMedia": recipeMedia,
		"signedUrl":   signedUrl,
	})
}


// GetRecipeMedias godoc
// @Summary 		Get all medias for a Recipe
// @Description Get all medias for a Recipe
// @Tags 				Recipes
// @Accept 			json
// @Produce 		json
// @Param       recipeId 	path      	string  true  "Recipe Id"
// @Success 		200 		  {array} 	  models.RecipeMedia
// @Router 			/recipes/{recipeId}/media [get]
// @Security 		ApiKeyAuth
func (rc *recipeController) GetRecipeMedias(c *gin.Context) {
	recipeId := c.Param("id")
	recipeMedias, err := rc.recipeService.GetRecipeMedias(&recipeId)

	if err == recipeService.ErrRecipeNotFound {
		c.AbortWithError(http.StatusNotFound, err)
		return
	} else if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, recipeMedias)
}