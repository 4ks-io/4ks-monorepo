package controllers

import (
	"4ks/apps/api/dtos"
	userService "4ks/apps/api/services/user"
	"4ks/libs/go/models"

	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
)

// UserController is the interface for the user controller
type UserController interface {
	CreateUser(ctx *gin.Context)
	HeadAuthenticatedUser(ctx *gin.Context)
	GetCurrentUserExist(ctx *gin.Context)
	GetCurrentUser(ctx *gin.Context)
	GetUser(ctx *gin.Context)
	GetUsers(ctx *gin.Context)
	DeleteUser(ctx *gin.Context)
	UpdateUser(ctx *gin.Context)
	TestUsername(ctx *gin.Context)
}

type userController struct {
	userService userService.Service
}

// NewUserController creates a new user controller
func NewUserController(u userService.Service) UserController {
	return &userController{
		userService: u,
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
func (uc *userController) CreateUser(ctx *gin.Context) {
	userID := ctx.GetString("id")
	userEmail := ctx.GetString("email")

	payload := dtos.CreateUser{}
	if err := ctx.BindJSON(&payload); err != nil {
		ctx.AbortWithError(http.StatusBadRequest, err)
		return
	}

	createdUser, err := uc.userService.CreateUser(ctx, &userID, &userEmail, &payload)
	if err == userService.ErrEmailInUse || err == userService.ErrUsernameInUse {
		ctx.AbortWithError(http.StatusBadRequest, err)
		return
	} else if err != nil {
		ctx.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	ctx.JSON(http.StatusOK, createdUser)
}

// DeleteUser		godoc
// @Summary 		Delete User
// @Description Delete User
// @Tags 				Users
// @Accept 			json
// @Produce 		json
// @Param       userID 	path      string  true  "User ID"
// @Success 		200
// @Router 			/users/{userID}   [delete]
// @Security 		ApiKeyAuth
func (uc *userController) DeleteUser(ctx *gin.Context) {
	userID := ctx.Param("id")
	err := uc.userService.DeleteUser(ctx, &userID)

	if err == userService.ErrUserNotFound {
		ctx.AbortWithError(http.StatusNotFound, err)
		return
	} else if err != nil {
		ctx.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	ctx.JSON(http.StatusOK, "ok")
}

// GetUser  		godoc
// @Schemes
// @Summary 	  Get a User (by ID)
// @Description Get a User (by ID)
// @Tags 		    Users
// @Accept 	   	json
// @Produce   	json
// @Param       userID 	path      	string  true  "User ID"
// @Success 		200 		{object} 	models.User
// @Router 			/users/{userID} [get]
// @Security 		ApiKeyAuth
func (uc *userController) GetUser(ctx *gin.Context) {
	userID := ctx.Param("id")
	user, err := uc.userService.GetUserByID(ctx, &userID)

	if err == userService.ErrUserNotFound {
		ctx.AbortWithError(http.StatusNotFound, err)
		return
	} else if err != nil {
		ctx.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	ctx.JSON(http.StatusOK, user)
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
func (uc *userController) GetCurrentUser(ctx *gin.Context) {
	userID := ctx.GetString("id")
	user, err := uc.userService.GetUserByID(ctx, &userID)

	if err == userService.ErrUserNotFound {
		ctx.AbortWithError(http.StatusNotFound, err)
		return
	} else if err != nil {
		ctx.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	ctx.JSON(http.StatusOK, user)
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
func (uc *userController) GetCurrentUserExist(ctx *gin.Context) {
	userID := ctx.GetString("id")
	_, err := uc.userService.GetUserByID(ctx, &userID)

	data := models.UserExist{}

	if err == userService.ErrUserNotFound {
		data.Exist = false
		ctx.JSON(http.StatusOK, data)
		return
	} else if err != nil {
		ctx.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	data.Exist = true
	ctx.JSON(http.StatusOK, data)
}

// HeadAuthenticatedUser godoc
// @Schemes
// @Summary 	  Head Authenticated user
// @Description Head Authenticated user
// @Router 			/user/ [head]
// @Tags 		    Users
// @Produce   	json
// @Success 		200
// @Success 		204   "No Content"
// @Failure     400		"Invalid Request"
// @Failure     404		"Record Not Found"
// @Failure     500		"Internal Error"
// @Security 		ApiKeyAuth
func (uc *userController) HeadAuthenticatedUser(ctx *gin.Context) {
	userID := ctx.GetString("id")

	if _, err := uc.userService.GetUserByID(ctx, &userID); err != nil {
		// handle user not found
		if err == userService.ErrUserNotFound {
			ctx.JSON(http.StatusNoContent, nil)
			return
		}
		// handle other errors
		log.Error().Err(err).Caller().Msg("GetUserByID")
		ctx.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	ctx.JSON(http.StatusOK, nil)
}

// GetUsers	godoc
// @Schemes
// @Summary 	  Get All Users
// @Description Get All Users
// @Tags 		    Users
// @Accept 	   	json
// @Produce   	json
// @Success 		200 		{array} 	models.User
// @Router 			/users/	[get]
// @Security 		ApiKeyAuth
func (uc *userController) GetUsers(ctx *gin.Context) {
	user, err := uc.userService.GetAllUsers(ctx)

	if err != nil {
		ctx.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	ctx.JSON(http.StatusOK, user)
}

// UpdateUser	  godoc
// @Summary 		Update User
// @Description Update User
// @Tags 				Users
// @Accept 			json
// @Produce 		json
// @Param       payload  body  	   dtos.UpdateUser  true  "User Data"
// @Success 		200 		 {object}  models.User
// @Router 			/user/   [patch]
// @Security 		ApiKeyAuth
func (uc *userController) UpdateUser(ctx *gin.Context) {
	userID := ctx.GetString("id")

	payload := dtos.UpdateUser{}
	if err := ctx.BindJSON(&payload); err != nil {
		ctx.AbortWithError(http.StatusBadRequest, err)
		return
	}

	u, err := uc.userService.UpdateUserByID(ctx, &userID, &payload)
	if err == userService.ErrUserNotFound {
		ctx.AbortWithError(http.StatusNotFound, err)
		return
	} else if err != nil {
		ctx.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	ctx.JSON(http.StatusOK, u)
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
func (uc *userController) TestUsername(ctx *gin.Context) {
	payload := dtos.TestUserName{}

	if err := ctx.BindJSON(&payload); err != nil {
		ctx.AbortWithError(http.StatusBadRequest, err)
		return
	}

	resp := models.Username{}

	isValid := uc.userService.TestUsernameValid(&payload.Username)
	if !isValid {
		resp.Msg = "invalid"
		resp.Valid = isValid
		ctx.JSON(http.StatusOK, resp)
		return
	}

	isFound, err := uc.userService.TestUsernameExist(ctx, &payload.Username)
	resp.Valid = !isFound

	if err == userService.ErrUsernameInUse {
		resp.Msg = "unavailable"
	} else if err != nil {
		ctx.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	ctx.JSON(http.StatusOK, resp)
}
