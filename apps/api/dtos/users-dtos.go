package dtos

type CreateUser struct {
	Username    string `json:"username"    binding:"required" example:"BobDylan"`
	DisplayName string `json:"displayName" binding:"required" example:"Bob Dylan"`
}

type UpdateUser struct {
	Username    string `json:"username"`
	DisplayName string `json:"displayName"`
}

type TestUserName struct {
	Username string `json:"username" binding:"required"`
}
