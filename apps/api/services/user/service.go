package user

import (
	"context"
	"errors"
	"os"
	"time"

	firestore "cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"

	models "4ks/libs/go/models"
)

type UserService interface {
	GetUserByEmail(emailAddress *string) (*models.User, error)
	GetUserById(id *string) (*models.User, error)
	CreateUser(user *models.User) (*models.User, error)
}

type userService struct {
}

var firstoreProjectId = os.Getenv("FIRESTORE_PROJECT_ID")
var ctx = context.Background()
var storage, _ = firestore.NewClient(ctx, firstoreProjectId)
var userCollection = storage.Collection("users")

func New() UserService {
	return &userService{}
}

func (us userService) GetUserById(id *string) (*models.User, error) {
	result, err := userCollection.Doc(*id).Get(ctx)

	if err != nil {
		return nil, err
	}

	user := new(models.User)
	err = result.DataTo(user)

	if err != nil {
		return nil, err
	}

	return user, nil
}

func (us userService) GetUserByEmail(emailAddress *string) (*models.User, error) {
	iter := userCollection.Where("emailAddress", "==", emailAddress).Limit(1).Documents(ctx)
	defer iter.Stop()

	result, err := iter.Next()

	if err == iterator.Done {
		return nil, errors.New("unable to find user with email")
	}

	user := new(models.User)
	err = result.DataTo(user)

	if err != nil {
		return nil, err
	}

	return user, nil
}

func (us userService) CreateUser(user *models.User) (*models.User, error) {
	user.CreatedDate = time.Now().UTC()
	user.UpdatedDate = time.Now().UTC()
	doc, _, err := userCollection.Add(ctx, user)

	if err != nil {
		return nil, errors.New("unable to insert user into collection")
	}

	result, err := doc.Get(ctx)

	if err != nil {
		return nil, errors.New("unable to fetch user after insert")
	}

	newUser := new(models.User)
	err = result.DataTo(newUser)

	if err != nil {
		return nil, errors.New("unable to convert User object")
	}

	return newUser, nil
}
