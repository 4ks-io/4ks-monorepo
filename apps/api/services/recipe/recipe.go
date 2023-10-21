// Package recipe is the interface for the recipe service
package recipe

import (
	"context"
	"errors"
	"fmt"
	"log"
	"os"
	"sync"

	firestore "cloud.google.com/go/firestore"

	"4ks/apps/api/dtos"
	"4ks/apps/api/utils"
	models "4ks/libs/go/models"
)

var firstoreProjectID = os.Getenv("FIRESTORE_PROJECT_ID")
var ctx = context.Background()
var s, _ = firestore.NewClient(ctx, firstoreProjectID)
var recipeCollection = s.Collection("recipes")
var recipeMediasCollection = s.Collection("recipe-medias")
var recipeRevisionsCollection = s.Collection("recipe-revisions")
var recipeStarsCollection = s.Collection("recipe-stars")

var distributionBucket = os.Getenv("DISTRIBUTION_BUCKET")
var uploadableBucket = os.Getenv("UPLOADABLE_BUCKET")
var serviceAccountName = os.Getenv("SERVICE_ACCOUNT_EMAIL")

var cgpStorageURL = "https://storage.googleapis.com"
var baseReadURL = fmt.Sprintf("%s/%s", cgpStorageURL, distributionBucket)

const expirationMinutes = 2

var (
	// ErrUnauthorized is returned when a user is not authorized to perform an action
	ErrUnauthorized              = errors.New("unauthorized user")
	// ErrUnableToUpdateRecipe is returned when a user is unable to update a recipe
	ErrUnableToUpdateRecipe      = errors.New("error updating recipe")
	// ErrUnableToCreateRecipeMedia is returned when a user is unable to create a recipe media
	ErrUnableToCreateRecipeMedia = errors.New("error creating recipe media")
	// ErrUnableToForkRecipe is returned when a user is unable to fork a recipe
	ErrUnableToForkRecipe        = errors.New("error forking recipe")
	// ErrUnableToCreateRecipe is returned when a user is unable to create a recipe
	ErrUnableToCreateRecipe      = errors.New("error creating recipe")
	// ErrRecipeNotFound is returned when a user is unable to find a recipe
	ErrRecipeNotFound            = errors.New("recipe not found")
	// ErrRecipeAlreadyStarred is returned when a user is unable to star a recipe
	ErrRecipeAlreadyStarred      = errors.New("recipe already starred")
	// ErrRecipeRevisionNotFound is returned when a user is unable to find a recipe revision
	ErrRecipeRevisionNotFound    = errors.New("recipe revision not found")
	// ErrFailedToSign              = errors.New("failed to sign url")
)

// Service is the interface for the recipe service
type Service interface {
	// create
	CreateRecipe(recipe *dtos.CreateRecipe) (*models.Recipe, error)
	CreateRecipeMedia(mp *utils.MediaProps, recipeID *string, userID *string, wg *sync.WaitGroup) (*models.RecipeMedia, error)
	CreateRecipeMediaSignedURL(mp *utils.MediaProps, wg *sync.WaitGroup) (*string, error)
	// delete
	DeleteRecipe(id string, usrSub string) error
	// get
	GetAdminRecipeMedias(recipeID *string) ([]*models.RecipeMedia, error)
	GetRecipes(limit int) ([]*models.Recipe, error)
	GetRecipeByID(id *string) (*models.Recipe, error)
	GetRecipesByUsername(username *string, limit int) ([]*models.Recipe, error)
	GetRecipesByUserID(id *string, limit int) ([]*models.Recipe, error)
	GetRecipeMedia(recipeID *string) ([]*models.RecipeMedia, error)
	GetRecipeRevisions(recipeID *string) ([]*models.RecipeRevision, error)
	GetRecipeRevisionByID(revisionID *string) (*models.RecipeRevision, error)
	// set
	ForkRecipeByID(id *string, forkAuthor models.UserSummary) (*models.Recipe, error)
	StarRecipeByID(id *string, user models.UserSummary) (bool, error)
	// update
	UpdateRecipeByID(id *string, recipeUpdate *dtos.UpdateRecipe) (*models.Recipe, error)
}

type recipeService struct {
}

// New returns a new RecipeService
func New() Service {
	if value, ok := os.LookupEnv("FIRESTORE_EMULATOR_HOST"); ok {
		log.Printf("Using Firestore Emulator: '%s'", value)
	}
	return &recipeService{}
}
