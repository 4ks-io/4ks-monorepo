package controllers

import (
	recipesvc "4ks/apps/api/services/recipe"
	usersvc "4ks/apps/api/services/user"

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
// @Router		 	/api/recipes [post]
// @Security 		ApiKeyAuth
func (c *recipeController) CreateRecipe(ctx *gin.Context) {
	payload := dtos.CreateRecipe{}
	if err := ctx.BindJSON(&payload); err != nil {
		ctx.AbortWithError(http.StatusBadRequest, err)
		return
	}

	userID := ctx.GetString("id")
	author, err := c.userService.GetUserByID(ctx, userID)
	if err != nil {
		ctx.AbortWithError(http.StatusForbidden, err)
		return
	}

	payload.Author = models.UserSummary{
		ID:          userID,
		Username:    author.Username,
		DisplayName: author.DisplayName,
	}

	f, err := c.staticService.GetRandomFallbackImage(ctx)
	if err != nil {
		log.Error().Err(err).Msg("failed to get random fallback image")
	}
	u := c.staticService.GetRandomFallbackImageURL(f)
	payload.Banner = createMockBanner(f, u)

	createdRecipe, err := c.recipeService.CreateRecipe(ctx, &payload)
	if err == recipesvc.ErrUnableToCreateRecipe {
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

// DeleteRecipe godoc
// @Summary 		Delete Recipe
// @Description Delete Recipe
// @Tags 				Recipes
// @Accept 			json
// @Produce 		json
// @Param       recipeID 	path      string  true  "Recipe ID"
// @Success 		200
// @Router 			/api/recipes/{recipeID}   [delete]
// @Security 		ApiKeyAuth
func (c *recipeController) DeleteRecipe(ctx *gin.Context) {
	recipeID := ctx.Param("id")

	// claims := c.Request.Context().Value(jwtmiddleware.ContextKey{}).(*validator.ValidatedClaims)
	// customClaims := claims.CustomClaims.(*middleware.CustomClaims)
	// sub := customClaims.ID
	sub := ctx.GetString("id")

	err := c.recipeService.DeleteRecipe(ctx, recipeID, sub)

	if err == recipesvc.ErrRecipeNotFound {
		ctx.AbortWithError(http.StatusNotFound, err)
		return
	} else if err == recipesvc.ErrUnauthorized {
		ctx.AbortWithError(http.StatusUnauthorized, err)
		return
	} else if err != nil {
		ctx.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	err = c.searchService.RemoveSearchRecipeDocument(recipeID)
	if err != nil {
		ctx.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	ctx.JSON(http.StatusOK, "ok")
}

// GetRecipe		godoc
// @Schemes
// @Summary 	  Get a Recipe (by ID)
// @Description Get a Recipe (by ID)
// @Tags 		    Recipes
// @Accept 	   	json
// @Produce   	json
// @Param       recipeID 	path      	string  true  "Recipe ID"
// @Success 		200 		{object} 	dtos.GetRecipeResponse
// @Router 			/api/recipes/{recipeID} [get]
// @Security 		ApiKeyAuth
func (c *recipeController) GetRecipe(ctx *gin.Context) {
	recipeID := ctx.Param("id")
	recipe, err := c.recipeService.GetRecipeByID(ctx, recipeID)

	if err == recipesvc.ErrRecipeNotFound {
		ctx.AbortWithError(http.StatusNotFound, err)
		return
	} else if err != nil {
		ctx.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	ctx.JSON(http.StatusOK, dtos.GetRecipeResponse{
		Data: recipe,
	})
}

// GetRecipesByUsername		godoc
// @Schemes
// @Summary 	  Get All Recipes by Author
// @Description Get All Recipes by Author
// @Tags 		    Recipes
// @Accept 	   	json
// @Produce   	json
// @Param       username 			path      string             true  "Username"
// @Success 		200 			   {object}   dtos.GetRecipesByUsernameResponse
// @Router 			/api/recipes/author/{username}   [get]
// @Security 		ApiKeyAuth
func (c *recipeController) GetRecipesByUsername(ctx *gin.Context) {
	username := ctx.Param("username")
	log.Debug().Caller().Str("username", username).Msg("GetRecipesByUsername")

	var id string
	// get user id
	if username == "4ks-bot" {
		id = "bot"
	} else {
		u, err := c.userService.GetUserByUsername(ctx, username)
		if err != nil {
			log.Error().Err(err).Msg("GetUserByUsername")
			switch e := err; e {
			case usersvc.ErrUserNotFound:
				ctx.AbortWithError(http.StatusNotFound, err)
				return
			default:
				ctx.AbortWithError(http.StatusInternalServerError, err)
				return
			}
		}

		id = u.ID
	}

	// todo: hardcode limit for now
	limit := 40
	var res dtos.GetRecipesByUsernameResponse

	recipes, err := c.recipeService.GetRecipesByUserID(ctx, id, limit)
	res.Data = recipes
	if err != nil {
		if err == recipesvc.ErrRecipeNotFound {
			ctx.JSON(http.StatusOK, recipes)
			return
		}
		log.Error().Err(err).Msg("GetRecipesByUserID")
		ctx.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	// utils.PrintStruct(recipes)

	ctx.JSON(http.StatusOK, res)
}

// GetRecipes		godoc
// @Schemes
// @Summary 	  Get All Recipes
// @Description Get All Recipes
// @Tags 		    Recipes
// @Accept 	   	json
// @Produce   	json
// @Success 		200 			{array} 		models.Recipe
// @Router 			/api/recipes 	[get]
// @Security 		ApiKeyAuth
func (c *recipeController) GetRecipes(ctx *gin.Context) {
	// hardcode limit for now
	limit := 40
	recipes, err := c.recipeService.GetRecipes(ctx, limit)

	if err == recipesvc.ErrRecipeNotFound {
		ctx.AbortWithError(http.StatusNotFound, err)
		return
	} else if err != nil {
		ctx.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	ctx.JSON(http.StatusOK, recipes)
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
// @Router 			/api/recipes/{recipeID} [patch]
// @Security 		ApiKeyAuth
func (c *recipeController) UpdateRecipe(ctx *gin.Context) {
	recipeID := ctx.Param("id")
	payload := dtos.UpdateRecipe{}

	if err := ctx.BindJSON(&payload); err != nil {
		ctx.AbortWithError(http.StatusBadRequest, err)
		return
	}

	userID := ctx.GetString("id")
	author, err := c.userService.GetUserByID(ctx, userID)
	if err != nil {
		ctx.AbortWithError(http.StatusForbidden, err)
		return
	}

	payload.Author = models.UserSummary{
		ID:          userID,
		Username:    author.Username,
		DisplayName: author.DisplayName,
	}

	createdRecipe, err := c.recipeService.UpdateRecipeByID(ctx, recipeID, &payload)

	if err == recipesvc.ErrUnableToCreateRecipe {
		ctx.AbortWithError(http.StatusBadRequest, err)
		return
	} else if err == recipesvc.ErrUnauthorized {
		ctx.AbortWithError(http.StatusUnauthorized, err)
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


// FetchRecipe godoc
// @Schemes
// @Summary 		Request Recipe Fetch
// @Description Request Recipe Fetch
// @Tags 				Recipes
// @Accept 			json
// @Produce 		json
// @Param       recipe   body  	   	dtos.FetchRecipeRequest  true  "Recipe Data"
// @Success 		200 		 {object}		dtos.FetchRecipeResponse
// @Router		 	/api/recipes/fetch [post]
// @Security 		ApiKeyAuth
func (c *recipeController) FetchRecipe(ctx *gin.Context) {
	payload := dtos.FetchRecipeRequest{}
	if err := ctx.BindJSON(&payload); err != nil {
		ctx.AbortWithError(http.StatusBadRequest, err)
		return
	}

	userID := ctx.GetString("id")
	_, err := c.userService.GetUserByID(ctx, userID)
	if err != nil {
		ctx.AbortWithError(http.StatusForbidden, err)
		return
	}

	// send to pubsub
	id, err := c.fetcherService.Send(ctx, userID, payload.URL)
	if err != nil {
		ctx.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	// response
	res := dtos.FetchRecipeResponse{
		ID: id,
	}

	ctx.JSON(http.StatusOK, res)
}