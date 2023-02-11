package recipe

import (
	firestore "cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"

	models "4ks/libs/go/models"
)

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

func (rs recipeService) GetRecipes(limit int) ([]*models.Recipe, error) {
	var all []*models.Recipe
	iter := recipeCollection.Limit(limit).Documents(ctx)
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


func (rs recipeService) GetRecipesByUsername(username *string, limit int) ([]*models.Recipe, error) {
	var all []*models.Recipe
	iter := recipeCollection.Where("author.username", "==", &username).Limit(limit).Documents(ctx)
	
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
