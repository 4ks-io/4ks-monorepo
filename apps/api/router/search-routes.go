package router

import (
	"github.com/gin-gonic/gin"

	controllers "4ks/apps/api/controllers"
	"4ks/apps/api/middleware"
)

func SearchRouter(router *gin.RouterGroup) {
	sc := controllers.NewSearchController()

	a := router.Group("/_admin/search")
	{
		a.POST("collection-init-recipe", middleware.Authorize("/search/*", "create"), sc.CreateSearchRecipeCollection)
	}
}
