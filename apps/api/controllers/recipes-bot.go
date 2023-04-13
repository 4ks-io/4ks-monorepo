package controllers

import (
	recipeService "4ks/apps/api/services/recipe"

	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"

	"4ks/apps/api/dtos"
	models "4ks/libs/go/models"
)

// BotCreateRecipe godoc
// @Schemes
// @Summary 		Bot Create a new Recipe
// @Description Bot Create a new Recipe
// @Tags 				Admin
// @Accept 			json
// @Produce 		json
// @Param       recipe   body  	   	dtos.CreateRecipe  true  "Recipe Data"
// @Success 		200 		 {object}		models.Recipe
// @Router		 	/_admin/recipes [post]
// @Security 		ApiKeyAuth
func (rc *recipeController) BotCreateRecipe(c *gin.Context) {
	payload := dtos.CreateRecipe{}
	if err := c.BindJSON(&payload); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	payload.Author = models.UserSummary{
		Id:          "bot",
		Username:    "4ks-bot",
		DisplayName: "4ks bot",
	}

	f, err := rc.staticService.GetRandomFallbackImage(c)
	if err != nil {
		log.Error().Err(err).Msg("failed to get random fallback image")
	}
	u := rc.staticService.GetRandomFallbackImageUrl(f)
	payload.Banner = createMockBanner(f, u)

	createdRecipe, err := rc.recipeService.CreateRecipe(&payload)
	if err == recipeService.ErrUnableToCreateRecipe {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	} else if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	err = rc.searchService.UpsertSearchRecipeDocument(createdRecipe)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, createdRecipe)
}
