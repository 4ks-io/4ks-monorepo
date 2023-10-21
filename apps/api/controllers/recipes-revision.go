package controllers

import (
	recipeService "4ks/apps/api/services/recipe"

	"net/http"

	"github.com/gin-gonic/gin"
)

// GetRecipeRevisions godoc
// @Summary 		Get all revisions for a Recipe
// @Description Get all revisions for a Recipe
// @Tags 				Recipes
// @Accept 			json
// @Produce 		json
// @Param       recipeID 	path      	string  true  "Recipe ID"
// @Success 		200 		{array} 	models.RecipeRevision
// @Router 			/recipes/{recipeID}/revisions [get]
// @Security 		ApiKeyAuth
func (rc *recipeController) GetRecipeRevisions(c *gin.Context) {
	recipeID := c.Param("id")
	recipeRevisions, err := rc.recipeService.GetRecipeRevisions(&recipeID)

	if err == recipeService.ErrRecipeNotFound {
		c.AbortWithError(http.StatusNotFound, err)
		return
	} else if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, recipeRevisions)
}

// GetRecipeRevision godoc
// @Summary 		Get a Recipe Revision
// @Description Get a Revision By ID
// @Tags 				Recipes
// @Accept 			json
// @Produce 		json
// @Param       revisionID 	path      	string  true  "Revision ID"
// @Success 		200 		{object} 	models.RecipeRevision
// @Router 			/recipes/revisions/{revisionID} [get]
// @Security 		ApiKeyAuth
func (rc *recipeController) GetRecipeRevision(c *gin.Context) {
	revisionID := c.Param("revisionID")
	recipeRevision, err := rc.recipeService.GetRecipeRevisionByID(&revisionID)

	if err == recipeService.ErrRecipeRevisionNotFound {
		c.AbortWithError(http.StatusNotFound, err)
		return
	} else if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, recipeRevision)
}
