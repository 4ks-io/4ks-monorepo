package recipe

import (
	"fmt"
	"time"

	firestore "cloud.google.com/go/firestore"
	mp "github.com/geraldo-labs/merge-struct"

	"4ks/apps/api/dtos"
	"4ks/apps/api/middleware"
	models "4ks/libs/go/models"
)

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

func (rs recipeService) CreateRecipe(recipe *dtos.CreateRecipe) (*models.Recipe, error) {
	newRecipeDoc := recipeCollection.NewDoc()
	newRevisionDoc := recipeRevisionsCollection.NewDoc()

	recipeCreatedDate := time.Now().UTC()

	recipeRevision := &models.RecipeRevision{
		Id:           newRevisionDoc.ID,
		Name:         recipe.Name,
		Link:         recipe.Link,
		RecipeId:     newRecipeDoc.ID,
		Author:       recipe.Author,
		Instructions: recipe.Instructions,
		Ingredients:  recipe.Ingredients,
		Banner:       recipe.Banner,
		CreatedDate:  recipeCreatedDate,
		UpdatedDate:  recipeCreatedDate,
	}
	newRecipe := &models.Recipe{
		Id:           newRecipeDoc.ID,
		Root:         newRecipeDoc.ID,
		Author:       recipe.Author,
		Contributors: []models.UserSummary{recipe.Author},
		Metadata: models.RecipeMetadata{
			Stars: 0,
			Forks: 0,
		},
		CurrentRevision: *recipeRevision,
		CreatedDate:     recipeCreatedDate,
		UpdatedDate:     recipeCreatedDate,
	}

	_, err := s.Batch().Create(newRevisionDoc, recipeRevision).Create(newRecipeDoc, newRecipe).Commit(ctx)

	if err != nil {
		return nil, ErrUnableToCreateRecipe
	}


	type RecipeTs struct {
		Id					 string   `json:"recipeId"`
		Author       string   `json:"author"`
		Name         string   `json:"name"`
		Instructions []string `json:"instructions"`
		Ingredients  []string `json:"ingredients"`
	}

	var ing []string
	for _, v := range newRecipe.CurrentRevision.Ingredients {
		ing = append(ing, v.Name)
	}

	var ins []string
	for _, v := range newRecipe.CurrentRevision.Instructions {
		ins = append(ins, v.Text)
	}

	document := RecipeTs{
		Id:						newRecipe.Id,
		Author:       newRecipe.Author.Username,
		Name:         newRecipe.CurrentRevision.Name,
		Ingredients:  ing,
		Instructions: ins,
	}

	_, err = tsc.Collection("recipes").Documents().Create(document)
	if err != nil {
		fmt.Println(err)
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

	_, err = s.Batch().Create(newRevisionDocRef, newRevision).Set(recipeDoc.Ref, recipe).Commit(ctx)

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

	recipe.Branch = recipe.Id
	recipe.Id = newRecipeDocRef.ID

	recipe.Author = forkAuthor
	recipe.Contributors = []models.UserSummary{forkAuthor}
	recipe.CurrentRevision.Author = forkAuthor
	recipe.CurrentRevision.Id = newRevisionDocRef.ID
	recipe.CurrentRevision.RecipeId = newRecipeDocRef.ID
	recipe.Metadata.Forks = 0
	recipe.Metadata.Stars = 0

	_, err = s.Batch().Create(newRevisionDocRef, recipe.CurrentRevision).Create(newRecipeDocRef, recipe).Update(recipeDoc.Ref, []firestore.Update{
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

	_, err = s.Batch().Create(recipeStarsCollection.NewDoc(), recipeStarDoc).Update(recipeDoc.Ref, []firestore.Update{
		{Path: "metadata.stars", Value: firestore.Increment(1)},
	}).Commit(ctx)

	if err != nil {
		return false, err
	}

	return true, nil
}
