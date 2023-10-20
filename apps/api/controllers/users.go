package controllers

import (
	"4ks/apps/api/dtos"
	userService "4ks/apps/api/services/user"
	"4ks/libs/go/models"

	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
)

type UserController interface {
	CreateUser(c *gin.Context)
	HeadAuthenticatedUser(c *gin.Context)
	// GetCurrentUserExist(c *gin.Context)
	GetCurrentUser(c *gin.Context)
	GetUser(c *gin.Context)
	GetUsers(c *gin.Context)
	DeleteUser(c *gin.Context)
	UpdateUser(c *gin.Context)
	TestUsername(c *gin.Context)
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
// @Router		 	/user   [post]
// @Security 		ApiKeyAuth
func (uc *userController) CreateUser(c *gin.Context) {
	userId := c.GetString("id")
	userEmail := c.GetString("email")

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
// @Router 			/user [get]
// @Security 		ApiKeyAuth
func (uc *userController) GetCurrentUser(c *gin.Context) {
	userId := c.GetString("id")
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

// GetCurrentUserExist godoc
// @Schemes
// @Summary 	  Get Current User Exist
// @Description Get Current User Exist
// @Tags 		    Users
// @Produce   	json
// @Success 		200 		{object} 	models.UserExist
// @Router 			/users/exist [get]
// @Security 		ApiKeyAuth
func (uc *userController) GetCurrentUserExist(c *gin.Context) {
	userId := c.GetString("id")
	_, err := uc.userService.GetUserById(&userId)

	data := models.UserExist{}

	if err == userService.ErrUserNotFound {
		data.Exist = false
		c.JSON(http.StatusOK, data)
		return
	} else if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	data.Exist = true
	c.JSON(http.StatusOK, data)
}


// HeadAuthenticatedUser godoc
// @Schemes
// @Summary 	  Head Authenticated user
// @Description Head Authenticated user
// @Router 			/user [head]
// @Tags 		    Users
// @Produce   	json
// @Success 		200
// @Success 		204   "No Content"
// @Failure     400		"Invalid Request"
// @Failure     404		"Record Not Found"
// @Failure     500		"Internal Error"
// @Security 		ApiKeyAuth
func (uc *userController) HeadAuthenticatedUser(c *gin.Context) {
	userId := c.GetString("id")
	
	if _, err := uc.userService.GetUserById(&userId); err != nil {
		// handle user not found
		if err == userService.ErrUserNotFound {
			c.JSON(http.StatusNoContent, nil)
			return
		}
		// handle other errors
		log.Error().Err(err).Caller().Msg("GetUserById")
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, nil)
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

// UpdateUser	  godoc
// @Summary 		Update User
// @Description Update User
// @Tags 				Users
// @Accept 			json
// @Produce 		json
// @Param       payload  body  	   dtos.UpdateUser  true  "User Data"
// @Success 		200 		 {object}  models.User
// @Router 			/user   [patch]
// @Security 		ApiKeyAuth
func (uc *userController) UpdateUser(c *gin.Context) {
	userId := c.GetString("id")

	payload := dtos.UpdateUser{}
	if err := c.BindJSON(&payload); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	u, err := uc.userService.UpdateUserById(&userId, &payload)
	if err == userService.ErrUserNotFound {
		c.AbortWithError(http.StatusNotFound, err)
		return
	} else if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, u)
}

// TestUsername	godoc
// @Summary 		Test if a username exists
// @Description Test if a username exists
// @Tags 				Users
// @Accept 			json
// @Produce 		json
// @Param       username    body  	   dtos.TestUserName  true  "Username Data"
// @Success 		200 		 		{object} 	 models.Username
// @Router 			/users/username   [post]
// @Security 		ApiKeyAuth
func (uc *userController) TestUsername(c *gin.Context) {
	payload := dtos.TestUserName{}

	if err := c.BindJSON(&payload); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	resp := models.Username{}

	isValid := uc.userService.TestUsernameValid(&payload.Username)
	if !isValid {
		resp.Msg = "invalid"
		resp.Valid = isValid
		c.JSON(http.StatusOK, resp)
		return
	}

	isFound, err := uc.userService.TestUsernameExist(&payload.Username)
	resp.Valid = !isFound

	if err == userService.ErrUsernameInUse {
		resp.Msg = "unavailable"
	} else if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, resp)
}
