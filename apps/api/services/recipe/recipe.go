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
	CreateRecipe(ctx context.Context, recipe *dtos.CreateRecipe) (*models.Recipe, error)
	CreateRecipeMedia(ctx context.Context, mp *utils.MediaProps, recipeID *string, userID *string, wg *sync.WaitGroup) (*models.RecipeMedia, error)
	CreateRecipeMediaSignedURL(mp *utils.MediaProps, wg *sync.WaitGroup) (*string, error)
	// delete
	DeleteRecipe(ctx context.Context, id string, usrSub string) error
	// get
	GetAdminRecipeMedias(ctx context.Context, recipeID *string) ([]*models.RecipeMedia, error)
	GetRecipes(ctx context.Context, limit int) ([]*models.Recipe, error)
	GetRecipeByID(ctx context.Context, id *string) (*models.Recipe, error)
	GetRecipesByUsername(ctx context.Context, username *string, limit int) ([]*models.Recipe, error)
	GetRecipesByUserID(ctx context.Context, id *string, limit int) ([]*models.Recipe, error)
	GetRecipeMedia(ctx context.Context, recipeID *string) ([]*models.RecipeMedia, error)
	GetRecipeRevisions(ctx context.Context, recipeID *string) ([]*models.RecipeRevision, error)
	GetRecipeRevisionByID(ctx context.Context, revisionID *string) (*models.RecipeRevision, error)
	// set
	ForkRecipeByID(ctx context.Context, id *string, forkAuthor models.UserSummary) (*models.Recipe, error)
	StarRecipeByID(ctx context.Context, id *string, user models.UserSummary) (bool, error)
	// update
	UpdateRecipeByID(ctx context.Context, id *string, recipeUpdate *dtos.UpdateRecipe) (*models.Recipe, error)
}

type recipeService struct {
	store                     *firestore.Client
	recipeCollection          *firestore.CollectionRef
	recipeMediasCollection    *firestore.CollectionRef
	recipeRevisionsCollection *firestore.CollectionRef
	recipeStarsCollection     *firestore.CollectionRef
	validator                 *validator.Validate
	sysFlags *utils.SystemFlags
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
		sysFlags: sysFlags,
	}
}
