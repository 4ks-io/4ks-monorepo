// Package user is the user service
package usersvc

import (
	"context"
	"errors"
	"regexp"
	"strings"
	"time"

	firestore "cloud.google.com/go/firestore"
	"github.com/go-playground/validator/v10"
	"github.com/rs/zerolog/log"
	"google.golang.org/api/iterator"

	"4ks/apps/api/dtos"
	"4ks/apps/api/utils"
	models "4ks/libs/go/models"
)

var (
	// ErrEmailInUse is returned when a user is unable to create a recipe
	ErrEmailInUse = errors.New("a user with that email already exists")
	// ErrUsernameInUse is returned when a user is unable to create a recipe
	ErrUsernameInUse = errors.New("a user with that username already exists")
	// ErrInvalidUsername is returned when a user is unable to create a recipe
	ErrInvalidUsername = errors.New("invalid username")
	// ErrUserNotFound is returned when a user is unable to create a recipe
	ErrUserNotFound = errors.New("a user with that email was not found")
)

// Service is the interface for the user service
type Service interface {
	GetAllUsers(ctx context.Context) ([]*models.User, error)
	GetUserByID(ctx context.Context, id *string) (*models.User, error)
	GetUserByUsername(ctx context.Context, username *string) (*models.User, error)
	GetUserByEmail(ctx context.Context, emailAddress *string) (*models.User, error)
	CreateUser(ctx context.Context, userID *string, userEmail *string, user *dtos.CreateUser) (*models.User, error)
	UpdateUserByID(ctx context.Context, userID *string, user *dtos.UpdateUser) (*models.User, error)
	DeleteUser(ctx context.Context, id *string) error
	TestUsernameValid(username *string) bool
	TestUsernameExist(ctx context.Context, username *string) (bool, error)

	// new
	// TestName(string) error
	// TestValidName(string) bool
	// TestReservedWord(string) bool
	// TestAvailableName(string) (bool, error)
}

type userService struct {
	userCollection *firestore.CollectionRef
	validator      *validator.Validate
	reservedWords  *[]string
	sysFlags *utils.SystemFlags
}

// New creates a new user service
func New(sysFlags *utils.SystemFlags, store *firestore.Client, validator *validator.Validate, reservedWords *[]string) Service {
	return &userService{
		sysFlags: sysFlags,
		validator:      validator,
		reservedWords:  reservedWords,
		userCollection: store.Collection("users"),
	}
}

func (s userService) GetAllUsers(ctx context.Context) ([]*models.User, error) {
	var all []*models.User
	iter := s.userCollection.Documents(ctx)
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
		// fmt.Println(u.ID)
		all = append(all, &u)
	}

	return all, nil
}

func (s userService) GetUserByID(ctx context.Context, id *string) (*models.User, error) {
	result, err := s.userCollection.Doc(*id).Get(ctx)
	if err != nil {
		return nil, ErrUserNotFound
	}

	user := new(models.User)
	err = result.DataTo(user)

	if err != nil {
		return nil, err
	}

	user.ID = result.Ref.ID
	return user, nil
}

func (s userService) GetUserByUsername(ctx context.Context, username *string) (*models.User, error) {
	// result, err := userCollection.Where("usernameLower", "==", l).Documents(ctx).GetAll()
	result, err := s.userCollection.Where("usernameLower", "==", strings.ToLower(*username)).Documents(ctx).GetAll()
	if err != nil || len(result) == 0 {
		return nil, ErrUserNotFound
	}
	// fmt.Print(result)

	userSnapshot := result[0]
	user := new(models.User)
	// fmt.Print(user.ID)

	err = userSnapshot.DataTo(user)
	if err != nil {
		return nil, err
	}

	user.ID = userSnapshot.Ref.ID
	return user, nil
}

func (s userService) GetUserByEmail(ctx context.Context, emailAddress *string) (*models.User, error) {
	result, err := s.userCollection.Where("emailAddress", "==", emailAddress).Documents(ctx).GetAll()
	if err != nil || len(result) == 0 {
		return nil, ErrUserNotFound
	}

	userSnapshot := result[0]
	user := new(models.User)

	err = userSnapshot.DataTo(user)
	if err != nil {
		return nil, err
	}

	user.ID = userSnapshot.Ref.ID
	return user, nil
}

func (s userService) TestUsernameValid(username *string) bool {
	/*
		1. at least 8 characters
		2. no longer than 24 characters
		3. alphanumeric characters or hyphens
		4. no consecutive hyphens
		5. cannot begin or end with a hyphen
	*/

	// todo: combine these 2 regex...
	if regexp.MustCompile("^[a-zA-Z0-9][a-zA-Z0-9-]{6,22}[a-zA-Z0-9]$").MatchString(*username) {
		if regexp.MustCompile("--").MatchString(*username) {
			return false
		}
		return true
	}

	return false
}

func (s userService) CreateUser(ctx context.Context, userID *string, userEmail *string, user *dtos.CreateUser) (*models.User, error) {
	isValid := s.TestUsernameValid(&user.Username)
	if !isValid {
		return nil, ErrInvalidUsername
	}

	existingUserID, _ := s.userCollection.Doc(*userID).Get(ctx)
	if existingUserID.Exists() {
		return nil, ErrEmailInUse
	}

	usersWithUsername, err := s.userCollection.Where("usernameLower", "==", strings.ToLower(user.Username)).Documents(ctx).GetAll()

	if len(usersWithUsername) > 0 {
		return nil, ErrUsernameInUse
	} else if err != nil {
		return nil, err
	}

	newUser := &models.User{
		ID:            *userID,
		Username:      user.Username,
		UsernameLower: strings.ToLower(user.Username),
		DisplayName:   user.DisplayName,
		EmailAddress:  strings.ToLower(*userEmail),
		CreatedDate:   time.Now().UTC(),
		UpdatedDate:   time.Now().UTC(),
	}

	_, err = s.userCollection.Doc(*userID).Create(ctx, newUser)
	if err != nil {
		return nil, err
	}

	return newUser, nil
}

func (s userService) UpdateUserByID(ctx context.Context, userID *string, user *dtos.UpdateUser) (*models.User, error) {
	if user.Username != "" {
		isValid := s.TestUsernameValid(&user.Username)
		if !isValid {
			return nil, ErrInvalidUsername
		}
	}

	_, err := s.userCollection.Doc(*userID).Update(ctx, []firestore.Update{
		{
			Path:  "username",
			Value: user.Username,
		},
		{
			Path:  "usernameLower",
			Value: strings.ToLower(user.Username),
		},
	})
	if err != nil {
		log.Printf("An error has occurred: %s", err)
	}

	u, err := s.GetUserByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	return u, nil
}

// todo: add with disableUser/enableUser as we never want to delete a recipe
func (s userService) DeleteUser(ctx context.Context, userID *string) error {
	existingUserID, _ := s.userCollection.Doc(*userID).Get(ctx)
	if !existingUserID.Exists() {
		return ErrUserNotFound
	}

	_, err := s.userCollection.Doc(*userID).Delete(ctx)
	if err != nil {
		return err
	}

	return nil
}

func (s userService) TestUsernameExist(ctx context.Context, username *string) (bool, error) {
	// u, err := url.PathUnescape(*username)
	usersWithUsername, err := s.userCollection.Where("usernameLower", "==", strings.ToLower(*username)).Documents(ctx).GetAll()
	if err != nil || len(usersWithUsername) > 0 {
		return true, ErrUsernameInUse
	}
	return false, nil
}
