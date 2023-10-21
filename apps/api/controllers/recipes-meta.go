package controllers

import (
	recipeService "4ks/apps/api/services/recipe"
	userService "4ks/apps/api/services/user"

	"net/http"

	"github.com/gin-gonic/gin"

	models "4ks/libs/go/models"
)

// ForkRecipe 	godoc
// @Summary 		Fork Recipe
// @Description Fork Recipe
// @Tags 				Recipes
// @Accept 			json
// @Produce 		json
// @Param       recipeID 	path      	string  true  "Recipe ID"
// @Success 		200 		{object} 	models.Recipe
// @Router 			/recipes/{recipeID}/fork [post]
// @Security 		ApiKeyAuth
func (rc *recipeController) ForkRecipe(c *gin.Context) {
	recipeID := c.Param("id")

	userID := c.GetString("id")
	author, err := rc.userService.GetUserByID(&userID)

	if err == userService.ErrUserNotFound {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	} else if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	newRecipe, err := rc.recipeService.ForkRecipeByID(&recipeID, models.UserSummary{
		ID:          userID,
		Username:    author.Username,
		DisplayName: author.DisplayName,
	})
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	err = rc.searchService.UpsertSearchRecipeDocument(newRecipe)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, newRecipe)
}

// StarRecipe		godoc
// @Summary 		Star Recipe
// @Description Star Recipe
// @Tags 				Recipes
// @Accept 			json
// @Produce 		json
// @Param       recipeID 	path      	string  true  "Recipe ID"
// @Success 		200
// @Router 			/recipes/{recipeID}/star [post]
// @Security 		ApiKeyAuth
func (rc *recipeController) StarRecipe(c *gin.Context) {
	recipeID := c.Param("id")

	userID := c.GetString("id")
	author, err := rc.userService.GetUserByID(&userID)

	if err == userService.ErrUserNotFound {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	} else if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	_, err = rc.recipeService.StarRecipeByID(&recipeID, models.UserSummary{
		ID:          userID,
		Username:    author.Username,
		DisplayName: author.DisplayName,
	})

	if err == recipeService.ErrRecipeNotFound {
		c.AbortWithStatus(http.StatusNotFound)
		return
	} else if err == recipeService.ErrRecipeAlreadyStarred {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "Recipe is already starred",
		})
		return
	} else if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{})
}
