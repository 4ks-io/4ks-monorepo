package function

import (
	"4ks/libs/go/models"
	"bytes"
	"context"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"time"

	"cloud.google.com/go/firestore"
	"cloud.google.com/go/storage"
	"github.com/disintegration/imaging"
)

var firstoreProjectId = os.Getenv("FIRESTORE_PROJECT_ID")
var ctx = context.Background()
var s, _ = firestore.NewClient(ctx, firstoreProjectId)
var recipeMediasCollection = s.Collection("recipe-medias")

func createVariant(ctx context.Context, bkt *storage.BucketHandle, i image.Image, ifmt string, f FileProps, size int, wg *sync.WaitGroup) (string, error) {
	// resize
	var v *image.NRGBA
	v = imaging.Resize(i, size, 0, imaging.Lanczos)

	// destination
	out := f.Basename + "_" + strconv.Itoa(size) + f.Extension
	ctx, cancel := context.WithTimeout(ctx, time.Second*15)
	defer cancel()
	wc := bkt.Object(out).NewWriter(ctx)

	// encode
	buf := new(bytes.Buffer)
	switch ifmt {
	case "png":
		err := png.Encode(buf, v)
		if err != nil {
			return "", fmt.Errorf("failed to encode %v", err)
		}
	case "jpeg", "jpg":
		err := jpeg.Encode(buf, v, &jpeg.Options{Quality: 90})
		if err != nil {
			return "", fmt.Errorf("failed to encode %v", err)
		}
	default:
		return "", fmt.Errorf("upload: unsupported MIME type, got = %q", ifmt)
	}

	// write file directly from memory
	if _, err := io.Copy(wc, buf); err != nil {
		return "", fmt.Errorf("io.Copy: %v", err)
	}
	if err := wc.Close(); err != nil {
		return "", fmt.Errorf("Writer.Close: %v", err)
	}

	return out, nil
}

func getFilenameDetails(name *string) FileProps {
	ext := filepath.Ext(*name)
	base := strings.Replace(*name, ext, "", 1)
	return FileProps{ext, base}
}

func UpdateRecipeMedia(filename *string) error {
	recipeMediasDocs, err := recipeMediasCollection.Where("filename", "==", *filename).Documents(ctx).GetAll()
	if err != nil {
		return nil, err
	}

	numberOfMedias := len(recipeMediasDocs)
	if numberOfMedias == 0 {
		recipeMedias := make([]*models.RecipeMedia, 0)
		return nil
	}

	recipeUpdatedDate := time.Now().UTC()

	_, err = s.Batch().Create(newRevisionDocRef, newRevision).Set(recipeDoc.Ref, recipe).Commit(ctx)
	if err != nil {
		return nil, ErrUnableToUpdateRecipe
	}

	return nil
}
