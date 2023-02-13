package router

import (
	"github.com/gin-gonic/gin"

	controllers "4ks/apps/api/controllers"
)

func SearchRouter(router *gin.Engine) {
	sc := controllers.NewSearchController()

	search := router.Group("/search")
	{
		search.POST("init/recipe-collection", sc.CreateRecipeCollection)
	}
}
