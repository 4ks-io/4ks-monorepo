// package function is the entrypoint for the Cloud Function that validates and resizes images
package function

import (
	"bytes"
	"context"
	"fmt"
	"image"
	"io"
	"log"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"

	firestore "cloud.google.com/go/firestore"
	"cloud.google.com/go/storage"
	"github.com/GoogleCloudPlatform/functions-framework-go/functions"
	"github.com/cloudevents/sdk-go/v2/event"
)

var distributionBucket = os.Getenv("DISTRIBUTION_BUCKET")
var firstoreProjectId = os.Getenv("FIRESTORE_PROJECT_ID")

func init() {
	functions.CloudEvent("UploadImage", uploadImage)
}

func updateRecipeMedia(isDevelopment bool, c *firestore.CollectionRef, ctx context.Context, id string) func(MediaStatus) {
	return func(s MediaStatus) {
		if isDevelopment {
			log.Printf("mock action: update status %s (%d): %s", id, s, firstoreProjectId)
			return
		}
		_, err := c.Doc(id).Update(ctx, []firestore.Update{
			{
				Path:  "updatedDate",
				Value: time.Now().UTC(),
			},
			{
				Path:  "status",
				Value: s,
			},
		})
		if err != nil {
			log.Fatalf("error updating recipe-medias %s", err)
		}
		log.Printf("update status %s (%d): %s", id, s, firstoreProjectId)
	}
}

// creates size variants of an uploaded image
func uploadImage(ctx context.Context, e event.Event) error {
	var s, _ = firestore.NewClient(ctx, firstoreProjectId)
	var c = s.Collection("recipe-medias")

	isDevelopment := GetBoolEnv("IO_4KS_DEVELOPMENT", false)

	// init
	var data StorageObjectData
	if err := e.DataAs(&data); err != nil {
		return fmt.Errorf("event.DataAs: %v", err)
	}

	// get filename details
	f := getFilenameDetails(data.Name)

	// get firestore id from basename
	id := strings.Split(f.Basename, "/")[1]

	log.Printf("Processing (%s) gs://%s/%s", id, data.Bucket, data.Name)

	// update status
	var up = updateRecipeMedia(isDevelopment, c, ctx, id)
	up(MediaStatusProcessing)

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
	// dst := dstbkt.Object(data.Name)

	// // terminate if the object exists in destination
	// // enable if copying original file to destination (below)
	// _, err = dst.Attrs(ctx)
	// if err == nil {
	// 	log.Printf("upload: %s has already been copied to destination\n", data.Name)
	// 	up(MediaStatusErrorUnknown)
	// 	return nil
	// }
	// // return retryable error as there is a possibility that object does not temporarily exist
	// if err != storage.ErrObjectNotExist {
	// 	return err
	// }

	// verify and validate src content-type and content (image vision)
	if err, status := validate(ctx, src); err != nil {
		// log.Printf("ERROR: validation error -> ", err)
		// if xerrors.Is(err, retryableError) {
		// 	return err
		// }
		up(status)
		return err
	}

	// copy original file to destination
	// if _, err := dst.CopierFrom(src).Run(ctx); err != nil {
	// 	up(MediaStatusErrorFailedCopy)
	// 	return err
	// }

	// read and decode src image
	rc, err := src.NewReader(ctx)
	if err != nil {
		up(MediaStatusErrorFailedResize)
		return fmt.Errorf("unable to read file %s in %s (%v)", data.Name, distributionBucket, err)
	}
	// read as []byte
	slurp, err := io.ReadAll(rc)
	rc.Close()
	if err != nil {
		up(MediaStatusErrorFailedResize)
		return fmt.Errorf("unable to slurp: %v", err)
	}
	i, ifmt, _ := image.Decode(bytes.NewReader(slurp))

	// create variants
	variants := []int{256, 1024}
	var wg sync.WaitGroup
	for _, s := range variants {
		wg.Add(1)
		o, err := createVariant(ctx, dstbkt, i, ifmt, f, s)
		wg.Done()
		if err != nil {
			up(MediaStatusErrorFailedVariant)
			return fmt.Errorf("failed to create %s variant %d: %v", o, s, err)
		}
	}

	up(MediaStatusReady)

	// delete src file
	ctx, cancel := context.WithTimeout(ctx, time.Second*10)
	defer cancel()
	if err := src.Delete(ctx); err != nil {
		return fmt.Errorf("Object(%q).Delete: %v", data.Name, err)
	}

	// terminate ctx
	if err := client.Close(); err != nil {
		return fmt.Errorf("client.Close: %v", err)
	}

	return nil
}

// GetStrEnvVar returns a string from an environment variable
func GetStrEnvVar(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

// GetBoolEnv returns a bool from an environment variable
func GetBoolEnv(key string, fallback bool) bool {
	val := GetStrEnvVar(key, strconv.FormatBool(fallback))
	ret, err := strconv.ParseBool(val)
	if err != nil {
		return fallback
	}
	return ret
}
