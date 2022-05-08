package user

import (
	"context"
	"errors"
	"fmt"
	"os"
	"time"

	firestore "cloud.google.com/go/firestore"

	"4ks/apps/api/dtos"
	models "4ks/libs/go/models"
)

var firstoreProjectId = os.Getenv("FIRESTORE_PROJECT_ID")
var firestoreEmulatorHost = os.Getenv("FIRESTORE_EMULATOR_HOST")

var ctx = context.Background()
var storage, _ = firestore.NewClient(ctx, firstoreProjectId)
var userCollection = storage.Collection("users")

var (
	ErrEmailInUse   = errors.New("a user with that email already exists")
	ErrUserNotFound = errors.New("a user with that email was not found")
)

type UserService interface {
	GetUserById(id *string) (*models.User, error)
	CreateUser(user *dtos.CreateUser) (*models.User, error)
}

type userService struct {
}

func New() UserService {
	fmt.Println(firestoreEmulatorHost)

	return &userService{}
}

func (us userService) GetUserById(id *string) (*models.User, error) {
	result, err := userCollection.Doc(*id).Get(ctx)

	if err != nil {
		return nil, ErrUserNotFound
	}

	user := new(models.User)
	err = result.DataTo(user)

	if err != nil {
		return nil, err
	}

	user.Id = result.Ref.ID
	return user, nil
}

func (us userService) CreateUser(user *dtos.CreateUser) (*models.User, error) {
	newUser := &models.User{
		Id:           user.EmailAddress,
		Username:     user.Username,
		DisplayName:  user.DisplayName,
		EmailAddress: user.EmailAddress,
		CreatedDate:  time.Now().UTC(),
		UpdatedDate:  time.Now().UTC(),
	}
	_, err := userCollection.Doc(user.EmailAddress).Create(ctx, newUser)

	if err != nil {
		return nil, ErrEmailInUse
	}

	return newUser, nil
}
