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
// @Param       recipeId 	path      	string  true  "Recipe Id"
// @Success 		200 		{array} 	models.RecipeRevision
// @Router 			/recipes/{recipeId}/revisions [get]
// @Security 		ApiKeyAuth
func (rc *recipeController) GetRecipeRevisions(c *gin.Context) {
	recipeId := c.Param("id")
	recipeRevisions, err := rc.recipeService.GetRecipeRevisions(&recipeId)

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
// @Description Get a Revision By Id
// @Tags 				Recipes
// @Accept 			json
// @Produce 		json
// @Param       revisionId 	path      	string  true  "Revision Id"
// @Success 		200 		{object} 	models.RecipeRevision
// @Router 			/recipes/revisions/{revisionId} [get]
// @Security 		ApiKeyAuth
func (rc *recipeController) GetRecipeRevision(c *gin.Context) {
	revisionId := c.Param("revisionId")
	recipeRevision, err := rc.recipeService.GetRecipeRevisionById(&revisionId)

	if err == recipeService.ErrRecipeRevisionNotFound {
		c.AbortWithError(http.StatusNotFound, err)
		return
	} else if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, recipeRevision)
}
