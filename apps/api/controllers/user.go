package controllers

import (
	"4ks/apps/api/dtos"
	userService "4ks/apps/api/services/user"

	"net/http"

	"github.com/gin-gonic/gin"
)

type UserController interface {
	CreateUser(c *gin.Context)
	GetUser(c *gin.Context)
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
// @Param       user     body  	   models.User  true  "User Data"
// @Success 		200 		 {array} 	 models.User
// @Router		 	/users   [post]
// @Security 		ApiKeyAuth
func (uc *userController) CreateUser(c *gin.Context) {
	payload := dtos.CreateUser{}
	if err := c.BindJSON(&payload); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	createdUser, err := uc.userService.CreateUser(&payload)
	if err == userService.ErrEmailInUse {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	} else if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, createdUser)
}

// GetUser  		godoc
// @Schemes
// @Summary 	  Get a User (by ID)
// @Description Get a User (by ID)
// @Tags 		    Users
// @Accept 	   	json
// @Produce   	json
// @Param       userId 	path      	string  true  "User Id"
// @Success 		200 		{array} 	models.User
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

// UpdateUser	godoc
// @Summary 		Update User
// @Description Update User
// @Tags 				Users
// @Accept 			json
// @Produce 		json
// @Param       userId 	path      string  true  "User Id"
// @Success 		200 		{array} 	models.RecipeRevision
// @Router 			/users/{userId}   [patch]
// @Security 		ApiKeyAuth
func (uc *userController) UpdateUser(c *gin.Context) {

}
