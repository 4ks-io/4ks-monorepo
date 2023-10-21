package controllers

import (
	recipeService "4ks/apps/api/services/recipe"

	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"

	"4ks/apps/api/dtos"
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

	userID := c.GetString("id")
	author, err := rc.userService.GetUserByID(&userID)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	payload.Author = models.UserSummary{
		ID:          userID,
		Username:    author.Username,
		DisplayName: author.DisplayName,
	}

	f, err := rc.staticService.GetRandomFallbackImage(c)
	if err != nil {
		log.Error().Err(err).Msg("failed to get random fallback image")
	}
	u := rc.staticService.GetRandomFallbackImageURL(f)
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

// DeleteRecipe godoc
// @Summary 		Delete Recipe
// @Description Delete Recipe
// @Tags 				Recipes
// @Accept 			json
// @Produce 		json
// @Param       recipeID 	path      string  true  "Recipe ID"
// @Success 		200
// @Router 			/recipes/{recipeID}   [delete]
// @Security 		ApiKeyAuth
func (rc *recipeController) DeleteRecipe(c *gin.Context) {
	recipeID := c.Param("id")

	// claims := c.Request.Context().Value(jwtmiddleware.ContextKey{}).(*validator.ValidatedClaims)
	// customClaims := claims.CustomClaims.(*middleware.CustomClaims)
	// sub := customClaims.ID
	sub := c.GetString("id")

	err := rc.recipeService.DeleteRecipe(recipeID, sub)

	if err == recipeService.ErrRecipeNotFound {
		c.AbortWithError(http.StatusNotFound, err)
		return
	} else if err == recipeService.ErrUnauthorized {
		c.AbortWithError(http.StatusUnauthorized, err)
		return
	} else if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	err = rc.searchService.RemoveSearchRecipeDocument(&recipeID)
	if err != nil {
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
// @Param       recipeID 	path      	string  true  "Recipe ID"
// @Success 		200 		{object} 	models.Recipe
// @Router 			/recipes/{recipeID} [get]
// @Security 		ApiKeyAuth
func (rc *recipeController) GetRecipe(c *gin.Context) {
	recipeID := c.Param("id")
	recipe, err := rc.recipeService.GetRecipeByID(&recipeID)

	if err == recipeService.ErrRecipeNotFound {
		c.AbortWithError(http.StatusNotFound, err)
		return
	} else if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, recipe)
}

// GetRecipesByUsername		godoc
// @Schemes
// @Summary 	  Get All Recipes by Author
// @Description Get All Recipes by Author
// @Tags 		    Recipes
// @Accept 	   	json
// @Produce   	json
// @Param       username 			path      string             true  "Username"
// @Success 		200 			{array} 		models.Recipe
// @Router 			/recipes/author/{username}   [get]
// @Security 		ApiKeyAuth
func (rc *recipeController) GetRecipesByUsername(c *gin.Context) {
	username := c.Param("username")

	var id string
	// get user id
	if username == "4ks-bot" {
		id = "bot"
	} else {
		u, err := rc.userService.GetUserByUsername(&username)
		if err == recipeService.ErrRecipeNotFound {
			c.AbortWithError(http.StatusNotFound, err)
			return
		}
		id = u.ID
	}

	// hardcode limit for now
	limit := 40
	recipes, err := rc.recipeService.GetRecipesByUserID(&id, limit)

	if err == recipeService.ErrRecipeNotFound {
		c.AbortWithError(http.StatusNotFound, err)
		return
	} else if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, recipes)
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
	// hardcode limit for now
	limit := 40
	recipes, err := rc.recipeService.GetRecipes(limit)

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
// @Param       recipeID 			path      string             true  "Recipe ID"
// @Param				payload   	  body			dtos.UpdateRecipe  true  "Recipe Data"
// @Success 		200 					{object} 	models.Recipe
// @Router 			/recipes/{recipeID} [patch]
// @Security 		ApiKeyAuth
func (rc *recipeController) UpdateRecipe(c *gin.Context) {
	recipeID := c.Param("id")
	payload := dtos.UpdateRecipe{}

	if err := c.BindJSON(&payload); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	userID := c.GetString("id")
	author, err := rc.userService.GetUserByID(&userID)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	payload.Author = models.UserSummary{
		ID:          userID,
		Username:    author.Username,
		DisplayName: author.DisplayName,
	}

	createdRecipe, err := rc.recipeService.UpdateRecipeByID(&recipeID, &payload)

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

	err = rc.searchService.UpsertSearchRecipeDocument(createdRecipe)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, createdRecipe)
}
