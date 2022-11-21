package recipe

import (
	"4ks/apps/api/middleware"
	models "4ks/libs/go/models"
	"context"
	"fmt"
	"os"
	"sync"
	"time"

	firestore "cloud.google.com/go/firestore"
	"cloud.google.com/go/storage"
)

func (rs recipeService) CreateRecipeMedia(filename *string, ct *string, recipeId *string, userId *string, wg *sync.WaitGroup) (*models.RecipeMedia, error) {
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

	newRecipeMediaDoc := recipeMediasCollection.NewDoc()
	timestamp := time.Now().UTC()

	bucket := os.Getenv("DISTRIBUTION_BUCKET")

	recipeMedia := &models.RecipeMedia{
		Id:           newRecipeMediaDoc.ID,
		Uri:          fmt.Sprintf("https://storage.cloud.google.com/%s/%s", bucket, *filename),
		Filename:     *filename,
		ContentType:  *ct,
		RecipeId:     recipe.Id,
		RootRecipeId: recipe.Root,
		OwnerId:      *userId,
		Status:       models.MediaStatusRequested,
		BestUse:      models.MediaBestUseGeneral,
		CreatedDate:  timestamp,
		UpdatedDate:  timestamp,
	}

	_, err = recipeMediasCollection.Doc(newRecipeMediaDoc.ID).Create(ctx, recipeMedia)
	if err != nil {
		return nil, err
	}

	return recipeMedia, nil
}

func (rs recipeService) CreateRecipeMediaSignedUrl(filename *string, ct *string, wg *sync.WaitGroup) (*string, error) {
	// reading env var takes ~75ns. maybe better to read only once?
	// but this keeps everything together and also won't blow up locally
	// should we disable media route locally?
	uploadableBucket := os.Getenv("UPLOADABLE_BUCKET")
	serviceAccountName := os.Getenv("SERVICE_ACCOUNT_EMAIL")

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
		// ContentType:    *ct,
	}

	url, err := client.Bucket(uploadableBucket).SignedURL(*filename, opts)
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
		recipeMedias := make([]*models.RecipeMedia,0)
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