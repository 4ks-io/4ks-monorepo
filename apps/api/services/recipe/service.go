package recipe

import (
	"context"
	"errors"
	"os"
	"time"

	firestore "cloud.google.com/go/firestore"

	"4ks/apps/api/dtos"
	models "4ks/libs/go/models"
)

var firstoreProjectId = os.Getenv("FIRESTORE_PROJECT_ID")
var ctx = context.Background()
var storage, _ = firestore.NewClient(ctx, firstoreProjectId)
var recipeCollection = storage.Collection("recipes")
var recipeRevisionsCollection = storage.Collection("recipe-revisions")

var (
	ErrUnableToCreateRecipe = errors.New("there was an error creating the recipe")
	ErrRecipeNotFound       = errors.New("recipe was not found")
)

type RecipeService interface {
	GetRecipeById(id *string) (*models.Recipe, error)
	CreateRecipe(recipe *dtos.CreateRecipe) (*models.Recipe, error)
}

type recipeService struct {
}

func New() RecipeService {
	return &recipeService{}
}

func (rs recipeService) GetRecipeById(id *string) (*models.Recipe, error) {
	result, err := recipeCollection.Doc(*id).Get(ctx)

	if err != nil {
		return nil, ErrRecipeNotFound
	}

	recipe := new(models.Recipe)
	err = result.DataTo(recipe)

	if err != nil {
		return nil, err
	}

	recipe.Id = result.Ref.ID
	return recipe, nil
}

func (rs recipeService) CreateRecipe(recipe *dtos.CreateRecipe) (*models.Recipe, error) {
	newRecipeDoc := recipeCollection.NewDoc()
	newRevisionDoc := recipeRevisionsCollection.NewDoc()

	recipeCreatedDate := time.Now().UTC()

	recipeRevision := &models.RecipeRevision{
		Id:          newRevisionDoc.ID,
		RecipeId:    newRecipeDoc.ID,
		Author:      recipe.Author,
		Images:      recipe.Images,
		CreatedDate: recipeCreatedDate,
		UpdatedDate: recipeCreatedDate,
	}
	newRecipe := &models.Recipe{
		Id:    newRecipeDoc.ID,
		Title: recipe.Title,
		Metadata: models.RecipeMetada{
			Stars: 0,
			Forks: 0,
		},
		CurrentRevision: *recipeRevision,
		CreatedDate:     recipeCreatedDate,
		UpdatedDate:     recipeCreatedDate,
	}

	_, err := storage.Batch().Create(newRevisionDoc, recipeRevision).Create(newRecipeDoc, newRecipe).Commit(ctx)

	if err != nil {
		return nil, errors.New("unable to create new recipe with revision")
	}

	return newRecipe, nil
}
