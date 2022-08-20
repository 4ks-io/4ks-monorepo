package controllers

import (
	recipeService "4ks/apps/api/services/recipe"
	userService "4ks/apps/api/services/user"
	"fmt"

	"net/http"

	"github.com/gin-gonic/gin"

	"4ks/apps/api/dtos"
	"4ks/apps/api/utils"
	models "4ks/libs/go/models"
)

type RecipeController interface {
	CreateRecipe(c *gin.Context)
	DeleteRecipe(c *gin.Context)
	GetRecipe(c *gin.Context)
	GetRecipes(c *gin.Context)
	UpdateRecipe(c *gin.Context)
	ForkRecipe(c *gin.Context)
	StarRecipe(c *gin.Context)
	GetRecipeRevisions(c *gin.Context)
	GetRecipeRevision(c *gin.Context)
}

type recipeController struct {
	recipeService recipeService.RecipeService
	userService   userService.UserService
}

func NewRecipeController() RecipeController {
	return &recipeController{
		recipeService: recipeService.New(),
		userService:   userService.New(),
	}
}

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
	fmt.Println(recipeId)
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
// @Param       recipeId 			path      string  true  "Recipe Id"
// @Param				recipeUpdate 	body			dtos.UpdateRecipe  true  "Recipe Update"
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

// ForkRecipe 	godoc
// @Summary 		Fork Recipe
// @Description Fork Recipe
// @Tags 				Recipes
// @Accept 			json
// @Produce 		json
// @Param       recipeId 	path      	string  true  "Recipe Id"
// @Success 		200 		{object} 	models.Recipe
// @Router 			/recipes/{recipeId}/fork [post]
// @Security 		ApiKeyAuth
func (rc *recipeController) ForkRecipe(c *gin.Context) {
	recipeId := c.Param("id")

	userId := c.Request.Context().Value(utils.UserId{}).(string)
	author, err := rc.userService.GetUserById(&userId)

	if err == userService.ErrUserNotFound {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	} else if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	newRecipe, err := rc.recipeService.ForkRecipeById(&recipeId, models.UserSummary{
		Id:          userId,
		Username:    author.Username,
		DisplayName: author.DisplayName,
	})
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
// @Param       recipeId 	path      	string  true  "Recipe Id"
// @Success 		200
// @Router 			/recipes/{recipeId}/star [post]
// @Security 		ApiKeyAuth
func (rc *recipeController) StarRecipe(c *gin.Context) {
	recipeId := c.Param("id")

	userId := c.Request.Context().Value(utils.UserId{}).(string)
	author, err := rc.userService.GetUserById(&userId)

	if err == userService.ErrUserNotFound {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	} else if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	_, err = rc.recipeService.StarRecipeById(&recipeId, models.UserSummary{
		Id:          userId,
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
