package favorites

import (
	"time"

	models "4ks/libs/go/models"
)

type UserService interface {
	GetUser(id *string) *models.User
	CreateUser(id *string) models.User
}

type userService struct {
}

func New() UserService {
	return &userService{}
}

func (us userService) GetUser(id *string) *models.User {
	return &models.User{
		Username:     "hkmushtaq",
		DisplayName:  "Hammad Mushtaq",
		EmailAddress: "hkmushtaq@gmail.com",
		CreatedDate:  time.Now().String(),
		UpdatedDate:  time.Now().String(),
	}
}

func (us userService) CreateUser(id *string) models.User {

}
