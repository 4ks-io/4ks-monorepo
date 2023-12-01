// Package controllers provides the controllers for the application
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
// @Router		 	/api/_admin/recipes [post]
// @Security 		ApiKeyAuth
func (c *recipeController) BotCreateRecipe(ctx *gin.Context) {
	payload := dtos.CreateRecipe{}
	if err := ctx.BindJSON(&payload); err != nil {
		ctx.AbortWithError(http.StatusBadRequest, err)
		return
	}

	payload.Author = models.UserSummary{
		ID:          "bot",
		Username:    "4ks-bot",
		DisplayName: "4ks bot",
	}

	f, err := c.staticService.GetRandomFallbackImage(ctx)
	if err != nil {
		log.Error().Err(err).Msg("failed to get random fallback image")
	}
	u := c.staticService.GetRandomFallbackImageURL(f)
	payload.Banner = c.recipeService.CreateMockBanner(f, u)

	createdRecipe, err := c.recipeService.CreateRecipe(ctx, &payload)
	if err == recipeService.ErrUnableToCreateRecipe {
		ctx.AbortWithError(http.StatusBadRequest, err)
		return
	} else if err != nil {
		ctx.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	err = c.searchService.UpsertSearchRecipeDocument(createdRecipe)
	if err != nil {
		ctx.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	ctx.JSON(http.StatusOK, createdRecipe)
}
