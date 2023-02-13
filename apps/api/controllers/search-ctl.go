package controllers

import (
	searchService "4ks/apps/api/services/search"
	"net/http"

	"github.com/gin-gonic/gin"
)

type SearchController interface {
	CreateRecipeCollection(c *gin.Context)
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
func (sc *searchController) CreateRecipeCollection(c *gin.Context) {

	err := sc.searchService.CreateRecipeSearchCollection()

	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, "ok")
}
