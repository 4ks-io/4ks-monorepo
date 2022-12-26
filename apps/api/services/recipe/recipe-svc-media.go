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

var distributionBucket = os.Getenv("DISTRIBUTION_BUCKET")
var uploadableBucket = os.Getenv("UPLOADABLE_BUCKET")
var serviceAccountEmail = os.Getenv("SERVICE_ACCOUNT_EMAIL")

func (rs recipeService) CreateRecipeMedia(mp *utils.MediaProps, recipeId *string, userId *string, wg *sync.WaitGroup) (*models.RecipeMedia, error) {
	recipeDoc, err := recipeCollection.Doc(*recipeId).Get(ctx)
	if err != nil {
		return nil, ErrRecipeNotFound
	}

	recipe := new(models.Recipe)
	recipeDoc.DataTo(recipe)

	e, err := middleware.EnforceContributor(userId, &recipe.Contributors)
	if err != nil {
		return nil, ErrUnableToCreateRecipeMedia
	} else if !e {
		return nil, ErrUnauthorized
	}

	timestamp := time.Now().UTC()
	filename := mp.Basename + mp.Extension

	recipeMedia := &models.RecipeMedia{
		Id:           mp.Basename,
		Uri:          fmt.Sprintf("https://storage.cloud.google.com/%s/%s", distributionBucket, filename),
		Filename:     filename,
		ContentType:  mp.ContentType,
		RecipeId:     recipe.Id,
		RootRecipeId: recipe.Root,
		OwnerId:      *userId,
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

func (rs recipeService) CreateRecipeMediaSignedUrl(mp *utils.MediaProps, wg *sync.WaitGroup) (*string, error) {
	ctx := context.Background()
	client, err := storage.NewClient(ctx)
	if err != nil {
		return nil, fmt.Errorf("storage.NewClient: %v", err)
	}
	defer client.Close()

	// https://pkg.go.dev/cloud.google.com/go/storage#SignedURLOptions
	opts := &storage.SignedURLOptions{
		Scheme:         storage.SigningSchemeV4,
		GoogleAccessID: serviceAccountEmail,
		Method:         "PUT",
		Expires:        time.Now().Add(expirationMinutes * time.Minute),
		// ContentType:    *ct,
	}

	filename := mp.Basename + mp.Extension

	url, err := client.Bucket(uploadableBucket).SignedURL(filename, opts)
	if err != nil {
		return nil, fmt.Errorf("Bucket(%q). SignedURL: %v", uploadableBucket, err)
	}

	return &url, nil
}

func (rs recipeService) GetRecipeMedias(recipeId *string) ([]*models.RecipeMedia, error) {
	recipeMediasDocs, err := recipeMediasCollection.Where("rootRecipeId", "==", recipeId).OrderBy("createdDate", firestore.Desc).Documents(ctx).GetAll()
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
