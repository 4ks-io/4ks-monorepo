package router

import (
	"github.com/gin-gonic/gin"

	controllers "4ks/apps/api/controllers"
	"4ks/apps/api/middleware"
)

func UsersRouter(router *gin.Engine) {
	uc := controllers.NewUserController()

	users := router.Group("/users")
	{
		// validate user is authorized to call path
		users.POST("", middleware.Authorize("/users", "POST"),  uc.CreateUser)
		// validate user is authorized to call path + read given recipe
		users.GET(":id", middleware.Authorize("/users/:id", "GET"),  uc.GetUser)
		users.PATCH(":id", middleware.Authorize("/users/:id", "PATCH"), uc.UpdateUser)
	}
}
