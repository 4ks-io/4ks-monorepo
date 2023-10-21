package dtos

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

// TestUserName godoc
type TestUserName struct {
	Username string `json:"username" binding:"required"`
}
