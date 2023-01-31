package function

import (
	"bytes"
	"context"
	"fmt"
	"image"
	"io"
	"log"
	"os"
	"sync"
	"time"

	firestore "cloud.google.com/go/firestore"
	"cloud.google.com/go/storage"
	"github.com/GoogleCloudPlatform/functions-framework-go/functions"
	"github.com/cloudevents/sdk-go/v2/event"
)

var distributionBucket = os.Getenv("DISTRIBUTION_BUCKET")
var firstoreProjectId = os.Getenv("FIRESTORE_PROJECT_ID")
var ftx = context.Background()
var s, _ = firestore.NewClient(ftx, firstoreProjectId)
var recipeMediasCollection = s.Collection("recipe-medias")

func init() {
	functions.CloudEvent("UploadImage", uploadImage)
}

func updateRecipeMedia(id string, status MediaStatus) {
	_, err := recipeMediasCollection.Doc(id).Update(ftx, []firestore.Update{
		{
			Path:  "updatedDate",
			Value: time.Now().UTC(),
		},
		{
			Path:  "status",
			Value: status,
		},
	})
	if err != nil {
		fmt.Errorf("error updating recipe-media: %s", err)
	}
}

// creates size variants of an uploaded image
func uploadImage(ctx context.Context, e event.Event) error {

	// init
	var data StorageObjectData
	if err := e.DataAs(&data); err != nil {
		return fmt.Errorf("event.DataAs: %v", err)
	}
	log.Printf("Processing gs://%s/%s", data.Bucket, data.Name)
	f := getFilenameDetails(data.Name)
	docId := f.Basename

	updateRecipeMedia(docId, MediaStatusProcessing)

	// storage client
	client, err := storage.NewClient(ctx)
	if err != nil {
		return fmt.Errorf("upload: failed to construct a client, error = %v", err)
	}
	defer client.Close()

	// src ObjectHandle
	src := client.Bucket(data.Bucket).Object(data.Name)
	// dst BucketHandle
	dstbkt := client.Bucket(distributionBucket)
	// dst ObjectHandle
	dst := dstbkt.Object(data.Name)

	// terminate if the object exists in destination
	_, err = dst.Attrs(ctx)
	if err == nil {
		log.Printf("upload: %s has already been copied to destination\n", data.Name)
		updateRecipeMedia(docId, MediaStatusErrorUnknown)
		return nil
	}
	// return retryable error as there is a possibility that object does not temporarily exist
	if err != storage.ErrObjectNotExist {
		return err
	}

	// verify and validate src content-type and content (image vision)
	if err, status := validate(ctx, src); err != nil {
		// log.Printf("ERROR: validation error -> ", err)
		// if xerrors.Is(err, retryableError) {
		// 	return err
		// }
		updateRecipeMedia(docId, status)
		return err
	}

	// return error if the copy failed
	if _, err := dst.CopierFrom(src).Run(ctx); err != nil {
		updateRecipeMedia(docId, MediaStatusErrorFailedCopy)
		return err
	}

	// read and decode src image
	rc, err := src.NewReader(ctx)
	if err != nil {
		updateRecipeMedia(docId, MediaStatusErrorFailedResize)
		fmt.Errorf("unable to read file %s in %s (%v)", data.Name, distributionBucket, err)
		return err
	}
	// read as []byte
	slurp, err := io.ReadAll(rc)
	rc.Close()
	if err != nil {
		updateRecipeMedia(docId, MediaStatusErrorFailedResize)
		fmt.Errorf("unable to slurp: %v", err)
		return err
	}
	i, ifmt, _ := image.Decode(bytes.NewReader(slurp))

	// create variants
	variants := []int{256, 800, 2048}
	var wg sync.WaitGroup
	wg.Add(len(variants))
	for _, s := range variants {
		o, err := createVariant(ctx, dstbkt, i, ifmt, f, s, &wg)
		if err != nil {
			updateRecipeMedia(docId, MediaStatusErrorFailedVariant)
			fmt.Errorf("failed to create %s variant %d: %v", o, s, err)
			return err
		}
	}

	updateRecipeMedia(docId, MediaStatusReady)

	// delete src file
	ctx, cancel := context.WithTimeout(ctx, time.Second*10)
	defer cancel()
	if err := src.Delete(ctx); err != nil {
		return fmt.Errorf("Object(%q).Delete: %v", data.Name, err)
	}

	// terminate ctx
	if err := client.Close(); err != nil {
		fmt.Errorf("client.Close: %v", err)
	}

	return nil
}
