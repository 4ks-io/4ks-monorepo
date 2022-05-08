package recipe

import (
	"context"
	"errors"
	"os"
	"time"

	firestore "cloud.google.com/go/firestore"

	models "4ks/libs/go/models"
)

type RecipeService interface {
	GetRecipeById(id *string) (*models.Recipe, error)
	CreateRecipe(recipe *models.Recipe) (*models.Recipe, error)
}

type recipeService struct {
}

var firstoreProjectId = os.Getenv("FIRESTORE_PROJECT_ID")
var ctx = context.Background()
var storage, _ = firestore.NewClient(ctx, firstoreProjectId)
var recipeCollection = storage.Collection("recipes")

func New() RecipeService {
	return &recipeService{}
}

func (rs recipeService) GetRecipeById(id *string) (*models.Recipe, error) {
	result, err := recipeCollection.Doc(*id).Get(ctx)

	if err != nil {
		return nil, err
	}

	recipe := new(models.Recipe)
	err = result.DataTo(recipe)

	if err != nil {
		return nil, err
	}

	return recipe, nil
}

func (rs recipeService) CreateRecipe(recipe *models.Recipe) (*models.Recipe, error) {
	recipe.CreatedDate = time.Now().UTC()
	recipe.UpdatedDate = time.Now().UTC()
	doc, _, err := recipeCollection.Add(ctx, recipe)

	if err != nil {
		return nil, errors.New("unable to insert user into collection")
	}

	result, err := doc.Get(ctx)

	if err != nil {
		return nil, errors.New("unable to fetch user after insert")
	}

	newRecipe := new(models.Recipe)
	err = result.DataTo(newRecipe)

	if err != nil {
		return nil, errors.New("unable to convert User object")
	}

	return newRecipe, nil
}
