package recipe

import (
	"context"
	"errors"
	"os"
	"time"

	firestore "cloud.google.com/go/firestore"
	mp "github.com/geraldo-labs/merge-struct"

	"4ks/apps/api/dtos"
	models "4ks/libs/go/models"
)

var firstoreProjectId = os.Getenv("FIRESTORE_PROJECT_ID")
var ctx = context.Background()
var storage, _ = firestore.NewClient(ctx, firstoreProjectId)
var recipeCollection = storage.Collection("recipes")
var recipeRevisionsCollection = storage.Collection("recipe-revisions")

var (
	ErrUnableToUpdateRecipe = errors.New("there was an error updating the recipe")
	ErrUnableToForkRecipe   = errors.New("there was an error forking the recipe")
	ErrUnableToCreateRecipe = errors.New("there was an error creating the recipe")
	ErrRecipeNotFound       = errors.New("recipe was not found")
)

type RecipeService interface {
	GetRecipeById(id *string) (*models.Recipe, error)
	CreateRecipe(recipe *dtos.CreateRecipe) (*models.Recipe, error)
	UpdateRecipeById(id *string, recipeUpdate *dtos.UpdateRecipe) (*models.Recipe, error)
	ForkRecipeById(id *string) (*models.Recipe, error)
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
		Id:           newRevisionDoc.ID,
		Name:         recipe.Name,
		RecipeId:     newRecipeDoc.ID,
		Author:       recipe.Author,
		Images:       recipe.Images,
		Instructions: recipe.Instructions,
		CreatedDate:  recipeCreatedDate,
		UpdatedDate:  recipeCreatedDate,
	}
	newRecipe := &models.Recipe{
		Id: newRecipeDoc.ID,
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
		return nil, ErrUnableToCreateRecipe
	}

	return newRecipe, nil
}

func (rs recipeService) UpdateRecipeById(recipeId *string, recipeUpdate *dtos.UpdateRecipe) (*models.Recipe, error) {
	recipeDoc, err := recipeCollection.Doc(*recipeId).Get(ctx)

	if err != nil {
		return nil, ErrRecipeNotFound
	}

	recipe := new(models.Recipe)
	recipeDoc.DataTo(recipe)

	recipeUpdatedDate := time.Now().UTC()

	newRevisionDocRef := recipeRevisionsCollection.NewDoc()
	newRevision := &models.RecipeRevision{}

	// Copy the existing revision data into the new revision
	// Set the id of the new revision
	mp.Struct(newRevision, recipe.CurrentRevision)
	newRevision.Id = newRevisionDocRef.ID

	// Apply the new revision updates
	mp.Struct(newRevision, recipeUpdate)

	newRevision.CreatedDate = recipeUpdatedDate
	newRevision.UpdatedDate = recipeUpdatedDate

	recipe.CurrentRevision = *newRevision
	recipe.UpdatedDate = recipeUpdatedDate

	_, err = storage.Batch().Create(newRevisionDocRef, newRevision).Set(recipeDoc.Ref, recipe).Commit(ctx)

	if err != nil {
		return nil, ErrUnableToUpdateRecipe
	}

	return recipe, nil
}

func (rs recipeService) ForkRecipeById(recipeId *string) (*models.Recipe, error) {
	recipeDoc, err := recipeCollection.Doc(*recipeId).Get(ctx)

	if err != nil {
		return nil, ErrRecipeNotFound
	}

	recipe := new(models.Recipe)
	recipeDoc.DataTo(recipe)

	newRecipeDocRef := recipeCollection.NewDoc()
	newRevisionDocRef := recipeRevisionsCollection.NewDoc()

	recipe.Source = recipe.Id
	recipe.Id = newRecipeDocRef.ID

	recipe.CurrentRevision.Id = newRevisionDocRef.ID
	recipe.CurrentRevision.RecipeId = newRecipeDocRef.ID

	_, err = storage.Batch().Create(newRevisionDocRef, recipe.CurrentRevision).Create(newRecipeDocRef, recipe).Commit(ctx)

	if err != nil {
		return nil, ErrUnableToForkRecipe
	}

	return recipe, nil
}
