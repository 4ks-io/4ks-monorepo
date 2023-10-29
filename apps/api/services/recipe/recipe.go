// Package recipesvc is the interface for the recipe service
package recipesvc

import (
	"context"
	"errors"
	"fmt"
	"os"
	"sync"

	"4ks/apps/api/dtos"
	"4ks/apps/api/utils"
	models "4ks/libs/go/models"

	firestore "cloud.google.com/go/firestore"
	"github.com/go-playground/validator/v10"
)

var distributionBucket = os.Getenv("DISTRIBUTION_BUCKET")
var uploadableBucket = os.Getenv("UPLOADABLE_BUCKET")
var serviceAccountName = os.Getenv("SERVICE_ACCOUNT_EMAIL")

var cgpStorageURL = "https://storage.googleapis.com"
var baseReadURL = fmt.Sprintf("%s/%s", cgpStorageURL, distributionBucket)

const expirationMinutes = 2

var (
	// ErrUnauthorized is returned when a user is not authorized to perform an action
	ErrUnauthorized = errors.New("unauthorized user")
	// ErrUnableToUpdateRecipe is returned when a user is unable to update a recipe
	ErrUnableToUpdateRecipe = errors.New("error updating recipe")
	// ErrUnableToCreateRecipeMedia is returned when a user is unable to create a recipe media
	ErrUnableToCreateRecipeMedia = errors.New("error creating recipe media")
	// ErrUnableToForkRecipe is returned when a user is unable to fork a recipe
	ErrUnableToForkRecipe = errors.New("error forking recipe")
	// ErrUnableToCreateRecipe is returned when a user is unable to create a recipe
	ErrUnableToCreateRecipe = errors.New("error creating recipe")
	// ErrRecipeNotFound is returned when a user is unable to find a recipe
	ErrRecipeNotFound = errors.New("recipe not found")
	// ErrRecipeAlreadyStarred is returned when a user is unable to star a recipe
	ErrRecipeAlreadyStarred = errors.New("recipe already starred")
	// ErrRecipeRevisionNotFound is returned when a user is unable to find a recipe revision
	ErrRecipeRevisionNotFound = errors.New("recipe revision not found")
	// ErrFailedToSign              = errors.New("failed to sign url")
)

// Service is the interface for the recipe service
type Service interface {
	// create
	CreateRecipe(context.Context, *dtos.CreateRecipe) (*models.Recipe, error)
	CreateRecipeMedia(context.Context, *utils.MediaProps, *string, *string, *sync.WaitGroup) (*models.RecipeMedia, error)
	CreateRecipeMediaSignedURL(*utils.MediaProps, *sync.WaitGroup) (*string, error)
	// delete
	DeleteRecipe(context.Context, string, string) error
	// get
	GetAdminRecipeMedias(context.Context, *string) ([]*models.RecipeMedia, error)
	GetRecipes(context.Context, int) ([]*models.Recipe, error)
	GetRecipeByID(context.Context, *string) (*models.Recipe, error)
	GetRecipesByUsername(context.Context, *string, int) ([]*models.Recipe, error)
	GetRecipesByUserID(context.Context, *string, int) ([]*models.Recipe, error)
	GetRecipeMedia(context.Context, *string) ([]*models.RecipeMedia, error)
	GetRecipeRevisions(context.Context, *string) ([]*models.RecipeRevision, error)
	GetRecipeRevisionByID(context.Context, *string) (*models.RecipeRevision, error)
	// set
	ForkRecipeByID(context.Context, *string, models.UserSummary) (*models.Recipe, error)
	StarRecipeByID(context.Context, *string, models.UserSummary) (bool, error)
	// update
	UpdateRecipeByID(context.Context, *string, *dtos.UpdateRecipe) (*models.Recipe, error)
}

type recipeService struct {
	store                     *firestore.Client
	recipeCollection          *firestore.CollectionRef
	recipeMediasCollection    *firestore.CollectionRef
	recipeRevisionsCollection *firestore.CollectionRef
	recipeStarsCollection     *firestore.CollectionRef
	validator                 *validator.Validate
	sysFlags                  *utils.SystemFlags
}

// New returns a new RecipeService
func New(sysFlags *utils.SystemFlags, store *firestore.Client, validator *validator.Validate) Service {
	return &recipeService{
		store:                     store,
		validator:                 validator,
		recipeCollection:          store.Collection("recipes"),
		recipeMediasCollection:    store.Collection("recipe-medias"),
		recipeRevisionsCollection: store.Collection("recipe-revisions"),
		recipeStarsCollection:     store.Collection("recipe-stars"),
		sysFlags:                  sysFlags,
	}
}
