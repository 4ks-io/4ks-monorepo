package controllers

import (
	searchService "4ks/apps/api/services/search"
	"net/http"

	"github.com/gin-gonic/gin"
)

// SearchController is the interface for the search controller
type SearchController interface {
	CreateSearchRecipeCollection(*gin.Context)
}

type searchController struct {
	searchService searchService.Service
}

// NewSearchController creates a new search controller
func NewSearchController() SearchController {
	return &searchController{
		searchService: searchService.New(),
	}
}

// CreateRecipeCollection   godoc
// @Schemes
// @Summary 		Initialize Search Recipe Collection
// @Description Initialize Search Recipe Collection
// @Tags 				Admin
// @Accept 			json
// @Produce 		json
// @Success 		200 		 {string} value
// @Router		 	/api/_admin/init-search-collections  [post]
// @Security 		ApiKeyAuth
func (sc *searchController) CreateSearchRecipeCollection(c *gin.Context) {
	err := sc.searchService.CreateSearchRecipeCollection()

	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, "ok")
}
