package controllers

import "github.com/gin-gonic/gin"

type UserController interface {
	CreateUser(c *gin.Context)
	GetUser(c *gin.Context)
	UpdateUser(c *gin.Context)
}

type userController struct {
}

func NewUserController() UserController {
	return &userController{}
}

func (uc *userController) CreateUser(c *gin.Context) {

}

func (uc *userController) GetUser(c *gin.Context) {

}

func (uc *userController) UpdateUser(c *gin.Context) {

}
