package recipe

import (
	"4ks/apps/api/middleware"
	"4ks/apps/api/utils"
	models "4ks/libs/go/models"
	"context"
	"fmt"
	"os"
	"sync"
	"time"

	firestore "cloud.google.com/go/firestore"
	"cloud.google.com/go/storage"
)

var isLocalDevelopment = os.Getenv("IO_4KS_DEVING")

func (rs recipeService) CreateRecipeMedia(mp *utils.MediaProps, recipeID *string, userID *string, wg *sync.WaitGroup) (*models.RecipeMedia, error) {
	defer wg.Done()

	recipeDoc, err := recipeCollection.Doc(*recipeID).Get(ctx)
	if err != nil {
		return nil, ErrRecipeNotFound
	}

	recipe := new(models.Recipe)
	recipeDoc.DataTo(recipe)

	e, err := middleware.EnforceContributor(*userID, recipe.Contributors)
	if err != nil {
		return nil, ErrUnableToCreateRecipeMedia
	} else if !e {
		return nil, ErrUnauthorized
	}

	newRecipeMediaDoc := recipeMediasCollection.NewDoc()
	timestamp := time.Now().UTC()

	a := []models.RecipeMediaVariant{}
	a = append(a, models.RecipeMediaVariant{
		MaxWidth: 256,
		URL:      fmt.Sprintf("%s/%s", baseReadURL, mp.Basename+"_256"+mp.Extension),
		Filename: mp.Basename + "_256" + mp.Extension,
		Alias:    "sm",
	})
	a = append(a, models.RecipeMediaVariant{
		MaxWidth: 1024,
		URL:      fmt.Sprintf("%s/%s", baseReadURL, mp.Basename+"_1024"+mp.Extension),
		Filename: mp.Basename + "_1024" + mp.Extension,
		Alias:    "md",
	})

	// https://github.com/4ks-io/4ks-monorepo/blob/f4f12c2f7eb4c6dc671b6b58dcafbeaf5702eeb8/apps/media-upload/function.go
	recipeMedia := &models.RecipeMedia{
		ID:           newRecipeMediaDoc.ID,
		Variants:     a,
		ContentType:  mp.ContentType,
		RecipeId:     recipe.ID,
		RootRecipeId: recipe.Root,
		OwnerId:      *userID,
		Status:       models.MediaStatusRequested,
		BestUse:      models.MediaBestUseGeneral,
		CreatedDate:  timestamp,
		UpdatedDate:  timestamp,
	}

	_, err = recipeMediasCollection.Doc(mp.Basename).Create(ctx, recipeMedia)
	if err != nil {
		return nil, err
	}

	return recipeMedia, nil
}

func (rs recipeService) CreateRecipeMediaSignedURL(mp *utils.MediaProps, wg *sync.WaitGroup) (*string, error) {
	defer wg.Done()

	ctx := context.Background()
	client, err := storage.NewClient(ctx)
	if err != nil {
		return nil, fmt.Errorf("storage.NewClient: %v", err)
	}
	defer client.Close()

	// https://pkg.go.dev/cloud.google.com/go/storage#SignedURLOptions
	opts := &storage.SignedURLOptions{
		Scheme:         storage.SigningSchemeV4,
		GoogleAccessID: serviceAccountName,
		Method:         "PUT",
		Expires:        time.Now().Add(expirationMinutes * time.Minute),
		// ContentType:    mp.ct,
	}

	filename := mp.Basename + mp.Extension
	url, err := client.Bucket(uploadableBucket).SignedURL(filename, opts)
	if err != nil {
		return nil, fmt.Errorf("Bucket(%q). SignedURL: %v", uploadableBucket, err)
	}

	return &url, nil
}

func (rs recipeService) GetRecipeMedia(recipeID *string) ([]*models.RecipeMedia, error) {
	var status [2]int
	status[0] = int(models.MediaStatusReady)
	// workaround to see images locally; upload-media status update callback only works in hosted firestore
	if isLocalDevelopment == "true" {
		status[1] = int(models.MediaStatusRequested)
	}
	recipeMediasDocs, err := recipeMediasCollection.Where("rootRecipeId", "==", recipeID).Where("status", "in", status).OrderBy("createdDate", firestore.Desc).Documents(ctx).GetAll()

	if err != nil {
		return nil, err
	}

	numberOfMedias := len(recipeMediasDocs)
	if numberOfMedias == 0 {
		recipeMedias := make([]*models.RecipeMedia, 0)
		return recipeMedias, nil
	}

	recipeMedias := make([]*models.RecipeMedia, numberOfMedias)
	for i, ds := range recipeMediasDocs {
		recipeMedia := new(models.RecipeMedia)
		ds.DataTo(recipeMedia)
		recipeMedias[i] = recipeMedia
	}

	return recipeMedias, nil
}

func (rs recipeService) GetAdminRecipeMedias(recipeID *string) ([]*models.RecipeMedia, error) {
	recipeMediasDocs, err := recipeMediasCollection.Where("rootRecipeId", "==", recipeID).Documents(ctx).GetAll()

	if err != nil {
		return nil, err
	}

	numberOfMedias := len(recipeMediasDocs)
	if numberOfMedias == 0 {
		recipeMedias := make([]*models.RecipeMedia, 0)
		return recipeMedias, nil
	}

	recipeMedias := make([]*models.RecipeMedia, numberOfMedias)
	for i, ds := range recipeMediasDocs {
		recipeMedia := new(models.RecipeMedia)
		ds.DataTo(recipeMedia)
		recipeMedias[i] = recipeMedia
	}

	return recipeMedias, nil
}
