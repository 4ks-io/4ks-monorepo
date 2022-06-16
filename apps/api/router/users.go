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
		users.DELETE(":id", middleware.Authorize("/users/*", "delete"), uc.DeleteUser)
		users.POST("", uc.CreateUser)
		users.GET("profile", uc.GetCurrentUser)
		users.GET("list", middleware.Authorize("/users/*", "list"), uc.GetUserList)
		users.GET(":id", uc.GetUser)
		users.PATCH(":id", uc.UpdateUser)
	}
}
