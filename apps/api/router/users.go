package router

import (
	"github.com/gin-gonic/gin"

	controllers "4ks/apps/api/controllers"
)

func UsersRouter(router *gin.Engine) {
	uc := controllers.NewUserController()

	users := router.Group("/users")
	{
		users.POST("", uc.CreateUser)
		users.GET(":id", uc.GetUser)
		users.PATCH(":id", uc.UpdateUser)
	}
}
