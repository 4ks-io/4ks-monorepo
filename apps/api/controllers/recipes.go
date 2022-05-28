package controllers

import (
	"4ks/apps/api/dtos"
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

func (rc *recipeController) ForkRecipe(c *gin.Context) {
	recipeId := c.Param("id")

	newRecipe, err := rc.recipeService.ForkRecipeById(&recipeId)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, newRecipe)
}

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
