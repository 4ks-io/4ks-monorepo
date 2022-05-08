package dtos

type CreateUser struct {
	Username     string `json:"username" binding:"required"`
	DisplayName  string `json:"displayName" binding:"required"`
	EmailAddress string `json:"emailAddress" binding:"required,email"`
}
