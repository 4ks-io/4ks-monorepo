package controllers

import (
	"4ks/apps/api/dtos"
	_ "4ks/libs/go/models"

	recipeService "4ks/apps/api/services/recipe"

	"net/http"

	"github.com/gin-gonic/gin"
)

type RecipeController interface {
	CreateRecipe(c *gin.Context)
	GetRecipe(c *gin.Context)
	UpdateRecipe(c *gin.Context)
	ForkRecipe(c *gin.Context)
	StarRecipe(c *gin.Context)
	GetRecipeRevisions(c *gin.Context)
	GetRecipeRevision(c *gin.Context)
}

type recipeController struct {
	recipeService recipeService.RecipeService
}

func NewRecipeController() RecipeController {
	return &recipeController{
		recipeService: recipeService.New(),
	}
}

// CreateRecipe godoc
// @Schemes
// @Summary 		Create a new Recipe
// @Description Create a new Recipe
// @Tags 				Recipes
// @Accept 			json
// @Produce 		json
// @Param       recipe   body  	   models.Recipe  true  "Recipe Data"
// @Success 		200 		 {array} 	 models.Recipe
// @Router		 	/recipes [post]
// @Security 		ApiKeyAuth
func (rc *recipeController) CreateRecipe(c *gin.Context) {
	payload := dtos.CreateRecipe{}
	if err := c.BindJSON(&payload); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
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

// GetRecipe		godoc
// @Schemes
// @Summary 	  Get a Recipe (by ID)
// @Description Get a Recipe (by ID)
// @Tags 		    Recipes
// @Accept 	   	json
// @Produce   	json
// @Param       recipeId 	path      	string  true  "Recipe Id"
// @Success 		200 		{array} 	models.Recipe
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

// UpdateRecipe	godoc
// @Summary 		Update Recipe
// @Description Update Recipe
// @Tags 				Recipes
// @Accept 			json
// @Produce 		json
// @Param       recipeId 	path      	string  true  "Recipe Id"
// @Success 		200 		{array} 	models.RecipeRevision
// @Router 			/recipes/{recipeId} [patch]
// @Security 		ApiKeyAuth
func (rc *recipeController) UpdateRecipe(c *gin.Context) {
	recipeId := c.Param("id")
	payload := dtos.UpdateRecipe{}
	if err := c.BindJSON(&payload); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	createdRecipe, err := rc.recipeService.UpdateRecipeById(&recipeId, &payload)
	if err == recipeService.ErrUnableToCreateRecipe {
		c.AbortWithError(http.StatusBadRequest, err)
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
// @Success 		200 		{array} 	models.RecipeRevision
// @Router 			/recipes/{recipeId}/fork [post]
// @Security 		ApiKeyAuth
func (rc *recipeController) ForkRecipe(c *gin.Context) {
	recipeId := c.Param("id")

	newRecipe, err := rc.recipeService.ForkRecipeById(&recipeId)
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
// @Success 		200 		{array} 	models.RecipeRevision
// @Router 			/recipes/{recipeId}/star [post]
// @Security 		ApiKeyAuth
func (rc *recipeController) StarRecipe(c *gin.Context) {
	recipeId := c.Param("id")

	payload := dtos.StarRecipe{}
	if err := c.BindJSON(&payload); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	_, err := rc.recipeService.StarRecipeById(&recipeId, payload.User)

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
