package controllers

import (
	recipeService "4ks/apps/api/services/recipe"
	userService "4ks/apps/api/services/user"

	"net/http"

	"github.com/gin-gonic/gin"

	"4ks/apps/api/dtos"
	"4ks/apps/api/utils"
	models "4ks/libs/go/models"
)

// CreateRecipe godoc
// @Schemes
// @Summary 		Create a new Recipe
// @Description Create a new Recipe
// @Tags 				Recipes
// @Accept 			json
// @Produce 		json
// @Param       recipe   body  	   	dtos.CreateRecipe  true  "Recipe Data"
// @Success 		200 		 {object}		models.Recipe
// @Router		 	/recipes [post]
// @Security 		ApiKeyAuth
func (rc *recipeController) CreateRecipe(c *gin.Context) {
	payload := dtos.CreateRecipe{}
	if err := c.BindJSON(&payload); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	userId := c.Request.Context().Value(utils.UserId{}).(string)
	author, err := rc.userService.GetUserById(&userId)

	if err == userService.ErrUserNotFound {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	} else if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	payload.Author = models.UserSummary{
		Id:          userId,
		Username:    author.Username,
		DisplayName: author.DisplayName,
	}

	createdRecipe, err := rc.recipeService.CreateRecipe(&payload)
	if err == recipeService.ErrUnableToCreateRecipe {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	} else if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, createdRecipe)
}

// DeleteRecipe godoc
// @Summary 		Delete Recipe
// @Description Delete Recipe
// @Tags 				Recipes
// @Accept 			json
// @Produce 		json
// @Param       recipeId 	path      string  true  "Recipe Id"
// @Success 		200
// @Router 			/recipes/{recipeId}   [delete]
// @Security 		ApiKeyAuth
func (rc *recipeController) DeleteRecipe(c *gin.Context) {
	recipeId := c.Param("id")
	// fmt.Println(recipeId)
	err := rc.recipeService.DeleteRecipe(&recipeId)

	if err == recipeService.ErrRecipeNotFound {
		c.AbortWithError(http.StatusNotFound, err)
		return
	} else if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, "ok")
}

// GetRecipe		godoc
// @Schemes
// @Summary 	  Get a Recipe (by ID)
// @Description Get a Recipe (by ID)
// @Tags 		    Recipes
// @Accept 	   	json
// @Produce   	json
// @Param       recipeId 	path      	string  true  "Recipe Id"
// @Success 		200 		{object} 	models.Recipe
// @Router 			/recipes/{recipeId} [get]
// @Security 		ApiKeyAuth
func (rc *recipeController) GetRecipe(c *gin.Context) {
	recipeId := c.Param("id")
	recipe, err := rc.recipeService.GetRecipeById(&recipeId)

	if err == recipeService.ErrRecipeNotFound {
		c.AbortWithError(http.StatusNotFound, err)
		return
	} else if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, recipe)
}

// GetRecipes		godoc
// @Schemes
// @Summary 	  Get All Recipes
// @Description Get All Recipes
// @Tags 		    Recipes
// @Accept 	   	json
// @Produce   	json
// @Success 		200 			{array} 		models.Recipe
// @Router 			/recipes 	[get]
// @Security 		ApiKeyAuth
func (rc *recipeController) GetRecipes(c *gin.Context) {
	recipes, err := rc.recipeService.GetAllRecipes()

	if err == recipeService.ErrRecipeNotFound {
		c.AbortWithError(http.StatusNotFound, err)
		return
	} else if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, recipes)
}

// UpdateRecipe	godoc
// @Summary 		Update Recipe
// @Description Update Recipe
// @Tags 				Recipes
// @Accept 			json
// @Produce 		json
// @Param       recipeId 			path      string             true  "Recipe Id"
// @Param				payload   	  body			dtos.UpdateRecipe  true  "Recipe Data"
// @Success 		200 					{object} 	models.Recipe
// @Router 			/recipes/{recipeId} [patch]
// @Security 		ApiKeyAuth
func (rc *recipeController) UpdateRecipe(c *gin.Context) {
	recipeId := c.Param("id")
	payload := dtos.UpdateRecipe{}

	if err := c.BindJSON(&payload); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	userId := c.Request.Context().Value(utils.UserId{}).(string)
	author, err := rc.userService.GetUserById(&userId)

	if err == userService.ErrUserNotFound {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	} else if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	payload.Author = models.UserSummary{
		Id:          userId,
		Username:    author.Username,
		DisplayName: author.DisplayName,
	}

	createdRecipe, err := rc.recipeService.UpdateRecipeById(&recipeId, &payload)

	if err == recipeService.ErrUnableToCreateRecipe {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	} else if err == recipeService.ErrUnauthorized {
		c.AbortWithError(http.StatusUnauthorized, err)
		return
	} else if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, createdRecipe)
}
