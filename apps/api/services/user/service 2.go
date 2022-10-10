package user

import (
	"context"
	"errors"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	firestore "cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"

	"4ks/apps/api/dtos"
	models "4ks/libs/go/models"
)

var firstoreProjectId = os.Getenv("FIRESTORE_PROJECT_ID")
var ctx = context.Background()
var storage, _ = firestore.NewClient(ctx, firstoreProjectId)
var userCollection = storage.Collection("users")

var (
	ErrEmailInUse    = errors.New("a user with that email already exists")
	ErrUsernameInUse = errors.New("a user with that username already exists")
	ErrUserNotFound  = errors.New("a user with that email was not found")
)

type UserService interface {
	GetAllUsers() ([]*models.User, error)
	GetUserById(id *string) (*models.User, error)
	GetUserByEmail(emailAddress *string) (*models.User, error)
	CreateUser(userId *string, userEmail *string, user *dtos.CreateUser) (*models.User, error)
	DeleteUser(id *string) error
}

type userService struct {
}

func New() UserService {
	if value, ok := os.LookupEnv("FIRESTORE_EMULATOR_HOST"); ok {
		log.Printf("Using Firestore Emulator: '%s'", value)
	}
	return &userService{}
}

func (us userService) GetAllUsers() ([]*models.User, error) {
	var all []*models.User
	iter := userCollection.Documents(ctx)
	defer iter.Stop() // add this line to ensure resources cleaned up

	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			// Handle error, possibly by returning the error
			// to the caller. Break the loop or return.
			return nil, err
		}
		var u models.User
		if err := doc.DataTo(&u); err != nil {
			// Handle error, possibly by returning the error
			// to the caller. Continue the loop,
			// break the loop or return.
			return nil, err
		}
		fmt.Println(u.Id)
		all = append(all, &u)
	}

	return all, nil
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

func (us userService) CreateUser(userId *string, userEmail *string, user *dtos.CreateUser) (*models.User, error) {
	existingUserId, _ := userCollection.Doc(*userId).Get(ctx)
	if existingUserId.Exists() {
		return nil, ErrEmailInUse
	}

	usersWithUsername, err := userCollection.Where("username", "==", strings.ToLower(user.Username)).Documents(ctx).GetAll()

	if len(usersWithUsername) > 0 {
		return nil, ErrUsernameInUse
	} else if err != nil {
		return nil, err
	}

	newUser := &models.User{
		Id:           *userId,
		Username:     strings.ToLower(user.Username),
		DisplayName:  user.DisplayName,
		EmailAddress: strings.ToLower(*userEmail),
		CreatedDate:  time.Now().UTC(),
		UpdatedDate:  time.Now().UTC(),
	}

	_, err = userCollection.Doc(*userId).Create(ctx, newUser)
	if err != nil {
		return nil, err
	}

	return newUser, nil
}

// todo: add with disableUser/enableUser as we never want to delete a recipe
func (us userService) DeleteUser(userId *string) error {
	existingUserId, _ := userCollection.Doc(*userId).Get(ctx)
	if !existingUserId.Exists() {
		return ErrUserNotFound
	}

	_, err := userCollection.Doc(*userId).Delete(ctx)
	if err != nil {
		return err
	}

	return nil
}
