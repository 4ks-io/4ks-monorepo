package dtos

import (
	"4ks/libs/go/models"

	"github.com/google/uuid"
)

// import "4ks/libs/go/models"

// GetAuthenticatedUser godoc
// type GetAuthenticatedUserResponse struct {
// 	Data *models.User `json:"data"`
// }

// CreateUser godoc
type CreateUser struct {
	Username    string `json:"username"    binding:"required" example:"BobDylan"`
	DisplayName string `json:"displayName" binding:"required" example:"Bob Dylan"`
}

// UpdateUser godoc
type UpdateUser struct {
	Username    string `json:"username"`
	DisplayName string `json:"displayName"`
}

// TestUsernameRequest godoc
type TestUsernameRequest struct {
	Username string `json:"username" binding:"required"`
}

// TestUsernameResponse godoc
type TestUsernameResponse struct {
	Available bool   `json:"available" binding:"required"`
	Valid     bool   `json:"valid" binding:"required"`
	Message   string `json:"msg" binding:"required"`
	Username  string `json:"username" binding:"required"`
}

// CreateUserEvent godoc
type CreateUserEvent struct {
	Type   models.UserEventType   `json:"type"`
	Status models.UserEventStatus `json:"status"`
	Data   interface{}            `json:"data"`
}

// UpdateUserEvent godoc
type UpdateUserEvent struct {
	ID     uuid.UUID              `json:"id"`
	Status models.UserEventStatus `json:"status"`
	Error  models.UserEventError  `json:"error"`
	Data   interface{}            `json:"data"`
}
