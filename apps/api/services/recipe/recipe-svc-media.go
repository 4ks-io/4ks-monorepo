package recipe

import (
	"4ks/apps/api/middleware"
	"4ks/apps/api/utils"
	models "4ks/libs/go/models"
	"context"
	"fmt"
	"sync"
	"time"

	firestore "cloud.google.com/go/firestore"
	"cloud.google.com/go/storage"
)

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

	newRecipeMediaDoc := recipeMediasCollection.NewDoc()
	timestamp := time.Now().UTC()

	a := []models.RecipeMediaVariant{}
	// a = append(a, models.RecipeMediaVariant{
	// 	MaxWidth: 0,
	// 	Url:      fmt.Sprintf("%s/%s", baseReadUrl, mp.Basename+mp.Extension),
	// 	Filename: mp.Basename + mp.Extension,
	// 	Alias:    "orig",
	// })
	a = append(a, models.RecipeMediaVariant{
		MaxWidth: 256,
		Url:      fmt.Sprintf("%s/%s", baseReadUrl, mp.Basename+"_256"+mp.Extension),
		Filename: mp.Basename + "_256" + mp.Extension,
		Alias:    "sm",
	})
	a = append(a, models.RecipeMediaVariant{
		MaxWidth: 1024,
		Url:      fmt.Sprintf("%s/%s", baseReadUrl, mp.Basename+"_1024"+mp.Extension),
		Filename: mp.Basename + "_1024" + mp.Extension,
		Alias:    "md",
	})
	// a = append(a, models.RecipeMediaVariant{
	// 	MaxWidth: 2048,
	// 	Url:      fmt.Sprintf("%s/%s", baseReadUrl, mp.Basename+"_2048"+mp.Extension),
	// 	Filename: mp.Basename + "_2048" + mp.Extension,
	// 	Alias:    "lg",
	// })

	// https://github.com/4ks-io/4ks-monorepo/blob/f4f12c2f7eb4c6dc671b6b58dcafbeaf5702eeb8/apps/media-upload/function.go
	recipeMedia := &models.RecipeMedia{
		Id:           newRecipeMediaDoc.ID,
		Variants:     a,
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

func (rs recipeService) GetRecipeMedias(recipeId *string) ([]*models.RecipeMedia, error) {
	status := [][]models.MediaStatus{{models.MediaStatusReady}}
	// workaround to see images locally; upload-media status update callback only works in hosted firestore
	if (firstoreProjectId == "local-4ks") {
		status = append(status, []models.MediaStatus{models.MediaStatusRequested})
	}
	recipeMediasDocs, err := recipeMediasCollection.Where("rootRecipeId", "==", recipeId).Where("status", "in", status).OrderBy("createdDate", firestore.Desc).Documents(ctx).GetAll()

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


func (rs recipeService) GetAdminRecipeMedias(recipeId *string) ([]*models.RecipeMedia, error) {
	recipeMediasDocs, err := recipeMediasCollection.Where("rootRecipeId", "==", recipeId).Documents(ctx).GetAll()

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
