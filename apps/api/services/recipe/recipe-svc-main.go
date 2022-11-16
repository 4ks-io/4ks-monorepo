package recipe

import (
	"context"
	"errors"
	"log"
	"os"

	firestore "cloud.google.com/go/firestore"

	"4ks/apps/api/dtos"
	models "4ks/libs/go/models"
)

var firstoreProjectId = os.Getenv("FIRESTORE_PROJECT_ID")
var ctx = context.Background()
var s, _ = firestore.NewClient(ctx, firstoreProjectId)
var recipeCollection = s.Collection("recipes")
var recipeRevisionsCollection = s.Collection("recipe-revisions")
var recipeStarsCollection = s.Collection("recipe-stars")

var (
	ErrUnauthorized           = errors.New("unauthorized user")
	ErrUnableToUpdateRecipe   = errors.New("there was an error updating the recipe")
	ErrUnableToForkRecipe     = errors.New("there was an error forking the recipe")
	ErrUnableToCreateRecipe   = errors.New("there was an error creating the recipe")
	ErrRecipeNotFound         = errors.New("recipe was not found")
	ErrRecipeAlreadyStarred   = errors.New("recipe is already starred")
	ErrRecipeRevisionNotFound = errors.New("recipe revision not found")
	ErrFailedToSign           = errors.New("failed to sign by internal server error")
)

const expirationMinutes = 5

type RecipeService interface {
	GetRecipeById(id *string) (*models.Recipe, error)
	DeleteRecipe(id *string) error
	GetAllRecipes() ([]*models.Recipe, error)
	CreateRecipe(recipe *dtos.CreateRecipe) (*models.Recipe, error)
	UpdateRecipeById(id *string, recipeUpdate *dtos.UpdateRecipe) (*models.Recipe, error)
	ForkRecipeById(id *string, forkAuthor models.UserSummary) (*models.Recipe, error)
	StarRecipeById(id *string, user models.UserSummary) (bool, error)
	GetRecipeRevisions(recipeId *string) ([]*models.RecipeRevision, error)
	GetRecipeRevisionById(revisionId *string) (*models.RecipeRevision, error)
	GetRecipeMediaSignedUrl(ext *string, ct *string) (*string, error)
}

type recipeService struct {
}

func New() RecipeService {
	if value, ok := os.LookupEnv("FIRESTORE_EMULATOR_HOST"); ok {
		log.Printf("Using Firestore Emulator: '%s'", value)
	}
	return &recipeService{}
}
