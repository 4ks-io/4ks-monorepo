package dtos

type NewMedia struct {
	Filename    string `json:"filename" binding:"required"`
	ContentType string `json:"contentType" binding:"required"`
}

type CreateUser struct {
	Username    string `json:"username" binding:"required"`
	DisplayName string `json:"displayName" binding:"required"`
}

type UpdateUser struct {
	Username    string `json:"username"`
	DisplayName string `json:"displayName"`
}

type TestUserName struct {
	Username string `json:"username" binding:"required"`
}
