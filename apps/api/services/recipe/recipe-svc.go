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

var firstoreProjectId = os.Getenv("FIRESTORE_PROJECT_ID")
var ctx = context.Background()
var s, _ = firestore.NewClient(ctx, firstoreProjectId)
var recipeCollection = s.Collection("recipes")
var recipeMediasCollection = s.Collection("recipe-medias")
var recipeRevisionsCollection = s.Collection("recipe-revisions")
var recipeStarsCollection = s.Collection("recipe-stars")

var distributionBucket = os.Getenv("DISTRIBUTION_BUCKET")
var uploadableBucket = os.Getenv("UPLOADABLE_BUCKET")
var serviceAccountName = os.Getenv("SERVICE_ACCOUNT_EMAIL")

var cgpStorageUrl = "https://storage.googleapis.com"
var baseReadUrl = fmt.Sprintf("%s/%s", cgpStorageUrl, distributionBucket)

const expirationMinutes = 2

var (
	ErrUnauthorized              = errors.New("unauthorized user")
	ErrUnableToUpdateRecipe      = errors.New("error updating recipe")
	ErrUnableToCreateRecipeMedia = errors.New("error creating recipe media")
	ErrUnableToForkRecipe        = errors.New("error forking recipe")
	ErrUnableToCreateRecipe      = errors.New("error creating recipe")
	ErrRecipeNotFound            = errors.New("recipe not found")
	ErrRecipeAlreadyStarred      = errors.New("recipe already starred")
	ErrRecipeRevisionNotFound    = errors.New("recipe revision not found")
	// ErrFailedToSign              = errors.New("failed to sign url")
)

type RecipeService interface {
	// create
	CreateRecipe(recipe *dtos.CreateRecipe) (*models.Recipe, error)
	CreateRecipeMedia(mp *utils.MediaProps, recipeId *string, userId *string, wg *sync.WaitGroup) (*models.RecipeMedia, error)
	CreateRecipeMediaSignedUrl(mp *utils.MediaProps, wg *sync.WaitGroup) (*string, error)
	// delete
	DeleteRecipe(id *string) error
	// get
	GetAdminRecipeMedias(recipeId *string) ([]*models.RecipeMedia, error)
	GetRecipes(limit int) ([]*models.Recipe, error)
	GetRecipeById(id *string) (*models.Recipe, error)
	GetRecipesByUsername(username *string, limit int) ([]*models.Recipe, error)
	GetRecipeMedia(recipeId *string) ([]*models.RecipeMedia, error)
	GetRecipeRevisions(recipeId *string) ([]*models.RecipeRevision, error)
	GetRecipeRevisionById(revisionId *string) (*models.RecipeRevision, error)
	// set
	ForkRecipeById(id *string, forkAuthor models.UserSummary) (*models.Recipe, error)
	StarRecipeById(id *string, user models.UserSummary) (bool, error)
	// update
	UpdateRecipeById(id *string, recipeUpdate *dtos.UpdateRecipe) (*models.Recipe, error)
}

type recipeService struct {
}

func New() RecipeService {
	if value, ok := os.LookupEnv("FIRESTORE_EMULATOR_HOST"); ok {
		log.Printf("Using Firestore Emulator: '%s'", value)
	}
	return &recipeService{}
}
