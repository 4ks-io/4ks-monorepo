package router

import (
	"github.com/gin-gonic/gin"

	controllers "4ks/apps/api/controllers"
	"4ks/apps/api/middleware"
)

func SearchRouter(router *gin.Engine) {
	sc := controllers.NewSearchController()

	a := router.Group("/_admin/search")
	{
		a.POST("collection-init-recipe", middleware.Authorize("/_admin/search/*", "create"), sc.CreateSearchRecipeCollection)
	}
}
