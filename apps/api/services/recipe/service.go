package recipe

import (
	"context"
	"errors"
	"log"
	"os"
	"time"

	firestore "cloud.google.com/go/firestore"
	mp "github.com/geraldo-labs/merge-struct"
	"google.golang.org/api/iterator"

	"4ks/apps/api/dtos"
	"4ks/apps/api/middleware"
	models "4ks/libs/go/models"
)

var firstoreProjectId = os.Getenv("FIRESTORE_PROJECT_ID")
var ctx = context.Background()
var storage, _ = firestore.NewClient(ctx, firstoreProjectId)
var recipeCollection = storage.Collection("recipes")
var recipeRevisionsCollection = storage.Collection("recipe-revisions")
var recipeStarsCollection = storage.Collection("recipe-stars")

var (
	ErrUnauthorized           = errors.New("unauthorized user")
	ErrUnableToUpdateRecipe   = errors.New("there was an error updating the recipe")
	ErrUnableToForkRecipe     = errors.New("there was an error forking the recipe")
	ErrUnableToCreateRecipe   = errors.New("there was an error creating the recipe")
	ErrRecipeNotFound         = errors.New("recipe was not found")
	ErrRecipeAlreadyStarred   = errors.New("recipe is already starred")
	ErrRecipeRevisionNotFound = errors.New("recipe revision not found")
)

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
}

type recipeService struct {
}

func New() RecipeService {
	if value, ok := os.LookupEnv("FIRESTORE_EMULATOR_HOST"); ok {
		log.Printf("Using Firestore Emulator: '%s'", value)
	}
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

func (rs recipeService) DeleteRecipe(id *string) error {
	existingId, _ := recipeCollection.Doc(*id).Get(ctx)
	if !existingId.Exists() {
		return ErrRecipeNotFound
	}

	_, err := recipeCollection.Doc(*id).Delete(ctx)
	if err != nil {
		return err
	}

	return nil
}

func (rs recipeService) GetAllRecipes() ([]*models.Recipe, error) {
	var all []*models.Recipe
	iter := recipeCollection.Documents(ctx)
	defer iter.Stop()

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
		var u models.Recipe
		if err := doc.DataTo(&u); err != nil {
			// Handle error, possibly by returning the error
			// to the caller. Continue the loop,
			// break the loop or return.
			return nil, err
		}
		// fmt.Println(u.Id)
		all = append(all, &u)
	}

	return all, nil
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
		Ingredients:  recipe.Ingredients,
		CreatedDate:  recipeCreatedDate,
		UpdatedDate:  recipeCreatedDate,
	}
	newRecipe := &models.Recipe{
		Id:           newRecipeDoc.ID,
		Author:       recipe.Author,
		Contributors: []models.UserSummary{recipe.Author},
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

	// e, err := middleware.EnforceAuthor(&recipeUpdate.Author.Id, &recipe.Author)
	e, err := middleware.EnforceContributor(&recipeUpdate.Author.Id, &recipe.Contributors)
	if err != nil {
		return nil, ErrUnableToUpdateRecipe
	} else if !e {
		return nil, ErrUnauthorized
	}

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

func (rs recipeService) ForkRecipeById(recipeId *string, forkAuthor models.UserSummary) (*models.Recipe, error) {
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

	recipe.Author = forkAuthor
	recipe.Contributors = []models.UserSummary{forkAuthor}
	recipe.CurrentRevision.Author = forkAuthor
	recipe.CurrentRevision.Id = newRevisionDocRef.ID
	recipe.CurrentRevision.RecipeId = newRecipeDocRef.ID
	recipe.Metadata.Forks = 0
	recipe.Metadata.Stars = 0

	_, err = storage.Batch().Create(newRevisionDocRef, recipe.CurrentRevision).Create(newRecipeDocRef, recipe).Update(recipeDoc.Ref, []firestore.Update{
		{Path: "metadata.forks", Value: firestore.Increment(1)},
	}).Commit(ctx)

	if err != nil {
		return nil, ErrUnableToForkRecipe
	}

	return recipe, nil
}

func (rs recipeService) StarRecipeById(recipeId *string, author models.UserSummary) (bool, error) {
	recipeStarDocs, err := recipeStarsCollection.Where("user.id", "==", author.Id).Where("recipe.id", "==", *recipeId).Documents(ctx).GetAll()

	if err != nil {
		return false, err
	}

	if len(recipeStarDocs) > 0 {
		return false, ErrRecipeAlreadyStarred
	}

	recipeDoc, err := recipeCollection.Doc(*recipeId).Get(ctx)

	if err != nil {
		return false, ErrRecipeNotFound
	}

	recipe := new(models.Recipe)
	recipeDoc.DataTo(recipe)

	starredDate := time.Now().UTC()
	recipeStarDoc := models.RecipeStar{
		User: author,
		Recipe: models.RecipeSummary{
			Id:   recipe.Id,
			Name: recipe.CurrentRevision.Name,
		},
		CreatedDate: starredDate,
		UpdatedDate: starredDate,
	}

	_, err = storage.Batch().Create(recipeStarsCollection.NewDoc(), recipeStarDoc).Update(recipeDoc.Ref, []firestore.Update{
		{Path: "metadata.stars", Value: firestore.Increment(1)},
	}).Commit(ctx)

	if err != nil {
		return false, err
	}

	return true, nil
}

func (rs recipeService) GetRecipeRevisions(recipeId *string) ([]*models.RecipeRevision, error) {
	recipeRevisionsDocs, err := recipeRevisionsCollection.Where("recipeId", "==", recipeId).OrderBy("createdDate", firestore.Desc).Documents(ctx).GetAll()

	if err != nil {
		return nil, err
	}

	numberOfRevisions := len(recipeRevisionsDocs)
	if numberOfRevisions == 0 {
		return nil, ErrRecipeNotFound
	}

	recipeRevisions := make([]*models.RecipeRevision, numberOfRevisions)
	for i, ds := range recipeRevisionsDocs {
		recipeRevision := new(models.RecipeRevision)
		ds.DataTo(recipeRevision)
		recipeRevisions[i] = recipeRevision
	}

	return recipeRevisions, nil
}

func (rs recipeService) GetRecipeRevisionById(revisionId *string) (*models.RecipeRevision, error) {
	recipeRevisionDoc, err := recipeRevisionsCollection.Doc(*revisionId).Get(ctx)

	if err != nil {
		return nil, ErrRecipeRevisionNotFound
	}

	recipeRevision := new(models.RecipeRevision)
	recipeRevisionDoc.DataTo(recipeRevision)

	return recipeRevision, nil
}
