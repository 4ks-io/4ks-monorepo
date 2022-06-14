package dtos

type CreateUser struct {
	// Id           string `json:"id" binding:"required"`
	Username    string `json:"username" binding:"required"`
	DisplayName string `json:"displayName" binding:"required"`
	// EmailAddress string `json:"emailAddress" binding:"required,email"`
}
