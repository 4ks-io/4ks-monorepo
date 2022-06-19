package controllers

import (
	"4ks/apps/api/dtos"
	userService "4ks/apps/api/services/user"
	"4ks/apps/api/utils"
	"fmt"

	"net/http"

	"github.com/gin-gonic/gin"
)

type UserController interface {
	CreateUser(c *gin.Context)
	GetCurrentUser(c *gin.Context)
	GetUser(c *gin.Context)
	GetUsers(c *gin.Context)
	DeleteUser(c *gin.Context)
	UpdateUser(c *gin.Context)
}

type userController struct {
	userService userService.UserService
}

func NewUserController() UserController {
	return &userController{
		userService: userService.New(),
	}
}

// CreateUser   godoc
// @Schemes
// @Summary 		Create a new User
// @Description Create a new User
// @Tags 				Users
// @Accept 			json
// @Produce 		json
// @Param       user     body  	   dtos.CreateUser  true  "User Data"
// @Success 		200 		 {object} 	 models.User
// @Router		 	/users   [post]
// @Security 		ApiKeyAuth
func (uc *userController) CreateUser(c *gin.Context) {
	userId := c.Request.Context().Value(utils.UserId{}).(string)
	userEmail := c.Request.Context().Value(utils.UserEmail{}).(string)

	payload := dtos.CreateUser{}
	if err := c.BindJSON(&payload); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	createdUser, err := uc.userService.CreateUser(&userId, &userEmail, &payload)
	if err == userService.ErrEmailInUse || err == userService.ErrUsernameInUse {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	} else if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, createdUser)
}

// DeleteUser		godoc
// @Summary 		Delete User
// @Description Delete User
// @Tags 				Users
// @Accept 			json
// @Produce 		json
// @Param       userId 	path      string  true  "User Id"
// @Success 		200
// @Router 			/users/{userId}   [delete]
// @Security 		ApiKeyAuth
func (uc *userController) DeleteUser(c *gin.Context) {
	fmt.Println("DeleteUser")
	userId := c.Param("id")
	err := uc.userService.DeleteUser(&userId)

	if err == userService.ErrUserNotFound {
		c.AbortWithError(http.StatusNotFound, err)
		return
	} else if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, "ok")
}

// GetUser  		godoc
// @Schemes
// @Summary 	  Get a User (by ID)
// @Description Get a User (by ID)
// @Tags 		    Users
// @Accept 	   	json
// @Produce   	json
// @Param       userId 	path      	string  true  "User Id"
// @Success 		200 		{object} 	models.User
// @Router 			/users/{userId} [get]
// @Security 		ApiKeyAuth
func (uc *userController) GetUser(c *gin.Context) {
	userId := c.Param("id")
	user, err := uc.userService.GetUserById(&userId)

	if err == userService.ErrUserNotFound {
		c.AbortWithError(http.StatusNotFound, err)
		return
	} else if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, user)
}

// GetCurrentUser	godoc
// @Schemes
// @Summary 	  Get Current User
// @Description Get Current User
// @Tags 		    Users
// @Accept 	   	json
// @Produce   	json
// @Success 		200 		{object} 	models.User
// @Router 			/users/profile [get]
// @Security 		ApiKeyAuth
func (uc *userController) GetCurrentUser(c *gin.Context) {
	userId := c.Request.Context().Value(utils.UserId{}).(string)
	user, err := uc.userService.GetUserById(&userId)

	if err == userService.ErrUserNotFound {
		c.AbortWithError(http.StatusNotFound, err)
		return
	} else if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, user)
}

// GetUsers	godoc
// @Schemes
// @Summary 	  Get All Users
// @Description Get All Users
// @Tags 		    Users
// @Accept 	   	json
// @Produce   	json
// @Success 		200 		{array} 	models.User
// @Router 			/users	[get]
// @Security 		ApiKeyAuth
func (uc *userController) GetUsers(c *gin.Context) {
	user, err := uc.userService.GetAllUsers()

	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, user)
}

// UpdateUser	godoc
// @Summary 		Update User
// @Description Update User
// @Tags 				Users
// @Accept 			json
// @Produce 		json
// @Param       userId 	path      string  true  "User Id"
// @Success 		200 		{array} 	models.User
// @Router 			/users/{userId}   [patch]
// @Security 		ApiKeyAuth
func (uc *userController) UpdateUser(c *gin.Context) {

}
