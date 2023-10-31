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
	// ErrEmailInUse is returned when a user email is already in use
	ErrEmailInUse = errors.New("email already in use")
	// ErrUsernameInUse is returned when a username is already in use
	ErrUsernameInUse = errors.New("username already in use")
	// ErrInvalidUsername is returned when a username is invalid
	ErrInvalidUsername = errors.New("invalid username")
	// ErrUserNotFound is returned when a user is not found
	ErrUserNotFound = errors.New("user not found")
	// ErrReservedWord is returned when a username is a reserved word
	ErrReservedWord = errors.New("reserved word")
)

// Service is the interface for the user service
type Service interface {
	GetAllUsers(context.Context) ([]*models.User, error)
	GetUserByID(context.Context, string) (*models.User, error)
	GetUserByUsername(context.Context, string) (*models.User, error)
	GetUserByEmail(context.Context, string) (*models.User, error)
	CreateUser(context.Context, string, string, *dtos.CreateUser) (*models.User, error)
	UpdateUserByID(context.Context, string, *dtos.UpdateUser) (*models.User, error)
	DeleteUser(context.Context, string) error

	// test username
	TestName(context.Context, string) error
	TestValidName(string) bool
	TestReservedWord(string) bool
	TestAvailableName(context.Context, string) (bool, error)
}

type userService struct {
	userCollection *firestore.CollectionRef
	validator      *validator.Validate
	reservedWords  *[]string
	sysFlags       *utils.SystemFlags
}

// New creates a new user service
func New(sysFlags *utils.SystemFlags, store *firestore.Client, validator *validator.Validate, reservedWords *[]string) Service {
	return &userService{
		sysFlags:       sysFlags,
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

func (s userService) GetUserByID(ctx context.Context, id string) (*models.User, error) {
	result, err := s.userCollection.Doc(id).Get(ctx)
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

func (s userService) GetUserByUsername(ctx context.Context, username string) (*models.User, error) {
	// result, err := userCollection.Where("usernameLower", "==", l).Documents(ctx).GetAll()
	result, err := s.userCollection.Where("usernameLower", "==", strings.ToLower(username)).Documents(ctx).GetAll()
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

func (s userService) GetUserByEmail(ctx context.Context, emailAddress string) (*models.User, error) {
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

func (s userService) CreateUser(ctx context.Context, userID string, userEmail string, user *dtos.CreateUser) (*models.User, error) {
	if err := s.TestName(ctx, user.Username); err != nil {
		return nil, err
	}

	newUser := &models.User{
		ID:            userID,
		Username:      user.Username,
		UsernameLower: strings.ToLower(user.Username),
		DisplayName:   user.DisplayName,
		EmailAddress:  strings.ToLower(userEmail),
		CreatedDate:   time.Now().UTC(),
		UpdatedDate:   time.Now().UTC(),
	}

	if _, err := s.userCollection.Doc(userID).Create(ctx, newUser); err != nil {
		return nil, err
	}

	return newUser, nil
}

func (s userService) UpdateUserByID(ctx context.Context, userID string, user *dtos.UpdateUser) (*models.User, error) {
	if err := s.TestName(ctx, user.Username); err != nil {
		return nil, err
	}

	_, err := s.userCollection.Doc(userID).Update(ctx, []firestore.Update{
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
func (s userService) DeleteUser(ctx context.Context, userID string) error {
	existingUserID, _ := s.userCollection.Doc(userID).Get(ctx)
	if !existingUserID.Exists() {
		return ErrUserNotFound
	}

	_, err := s.userCollection.Doc(userID).Delete(ctx)
	if err != nil {
		return err
	}

	return nil
}

// TestReservedWord tests if the entityname is a reserved word
func (s userService) TestReservedWord(name string) bool {
	for _, word := range *s.reservedWords {
		if word == name {
			return true
		}
	}
	return false
}

// TestValidName tests if the entityname is valid
func (s userService) TestValidName(name string) bool {
	/*
		1. at least 8 characters
		2. no longer than 24 characters
		3. alphanumeric characters or hyphens
		4. no consecutive hyphens
		5. cannot begin or end with a hyphen
	*/

	// todo: combine these 2 regex...
	if regexp.MustCompile("^[a-zA-Z0-9][a-zA-Z0-9-]{6,22}[a-zA-Z0-9]$").MatchString(name) {
		return !regexp.MustCompile("--").MatchString(name)
	}

	return false
}

// TestAvailableName tests if the name is available
func (s userService) TestAvailableName(ctx context.Context, username string) (bool, error) {
	// u, err := url.PathUnescape(*username)
	usersWithUsername, err := s.userCollection.Where("usernameLower", "==", strings.ToLower(username)).Documents(ctx).GetAll()
	if err != nil || len(usersWithUsername) > 0 {
		return true, ErrUsernameInUse
	}
	return false, nil
}

func (s userService) TestName(ctx context.Context, n string) error {
	// test validity
	if isValid := s.TestValidName(n); !isValid {
		return ErrInvalidUsername
	}

	// test reserved word
	if isReserved := s.TestReservedWord(n); isReserved {
		return ErrReservedWord
	}

	if _, err := s.TestAvailableName(ctx, n); err != nil {
		if err == ErrUsernameInUse {
			return ErrUsernameInUse
		} else if err != ErrUserNotFound {
			return err
		}
	}

	return nil
}
