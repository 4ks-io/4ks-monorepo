package controllers

import (
	searchService "4ks/apps/api/services/search"
	"4ks/libs/go/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type SearchController interface {
	CreateSearchRecipeCollection(c *gin.Context)
	CreateSearchRecipeDocument(c *gin.Context)
}

type searchController struct {
	searchService searchService.SearchService
}

func NewSearchController() SearchController {
	return &searchController{
		searchService: searchService.New(),
	}
}

// CreateRecipeCollection   godoc
// @Schemes
// @Summary 		Initialize Search Recipe Collection
// @Description Initialize Search Recipe Collection
// @Tags 				Search
// @Accept 			json
// @Produce 		json
// @Success 		200 		 {string} value
// @Router		 	/search/init/recipe-collection  [post]
// @Security 		ApiKeyAuth
func (sc *searchController) CreateSearchRecipeCollection(c *gin.Context) {

	err := sc.searchService.CreateSearchRecipeCollection()

	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, "ok")
}

// CreateRecipeDocument   godoc
// @Schemes
// @Summary 		Create Search Recipe Document
// @Description Create Search Recipe Document
// @Tags 				Search
// @Accept 			json
// @Produce 		json
// @Param       recipe   body  	   	models.Recipe  true  "Recipe Data"
// @Success 		200 		 {string} value
// @Router		 	/search/recipe  [post]
// @Security 		ApiKeyAuth
func (sc *searchController) CreateSearchRecipeDocument(c *gin.Context) {
	r := models.Recipe{}
	if err := c.BindJSON(&r); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	err := sc.searchService.CreateSearchRecipeDocument(&r)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, "ok")

}
