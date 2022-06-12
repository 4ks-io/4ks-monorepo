package user

import (
	"context"
	"errors"
	"fmt"
	"os"
	"strings"
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
	ErrEmailInUse    = errors.New("a user with that email already exists")
	ErrUsernameInUse = errors.New("a user with that username already exists")
	ErrUserNotFound  = errors.New("a user with that email was not found")
)

type UserService interface {
	GetUserById(id *string) (*models.User, error)
	GetUserByEmail(emailAddress *string) (*models.User, error)
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

func (us userService) GetUserByEmail(emailAddress *string) (*models.User, error) {
	result, err := userCollection.Where("emailAddress", "==", emailAddress).Documents(ctx).GetAll()

	if err != nil || len(result) == 0 {
		return nil, ErrUserNotFound
	}

	userSnapshot := result[0]
	user := new(models.User)
	err = userSnapshot.DataTo(user)

	if err != nil {
		return nil, err
	}

	user.Id = userSnapshot.Ref.ID
	return user, nil
}

func (us userService) CreateUser(user *dtos.CreateUser) (*models.User, error) {
	usersWithEmail, err := userCollection.Where("emailAddress", "==", strings.ToLower(user.EmailAddress)).Documents(ctx).GetAll()

	if len(usersWithEmail) > 0 {
		return nil, ErrEmailInUse
	} else if err != nil {
		return nil, err
	}

	usersWithUsername, err := userCollection.Where("username", "==", strings.ToLower(user.Username)).Documents(ctx).GetAll()

	if len(usersWithUsername) > 0 {
		return nil, ErrUsernameInUse
	} else if err != nil {
		return nil, err
	}

	newUserRef := userCollection.NewDoc()
	newUser := &models.User{
		Id:           newUserRef.ID,
		Username:     strings.ToLower(user.Username),
		DisplayName:  user.DisplayName,
		EmailAddress: strings.ToLower(user.EmailAddress),
		CreatedDate:  time.Now().UTC(),
		UpdatedDate:  time.Now().UTC(),
	}

	_, err = newUserRef.Create(ctx, newUser)

	if err != nil {
		return nil, err
	}

	return newUser, nil
}
