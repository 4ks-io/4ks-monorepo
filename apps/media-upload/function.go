package function

import (
	"bytes"
	"context"
	"fmt"
	"image"
	"io"
	"log"
	"os"
	"time"

	"cloud.google.com/go/storage"
	"github.com/GoogleCloudPlatform/functions-framework-go/functions"
	"github.com/cloudevents/sdk-go/v2/event"
	"golang.org/x/xerrors"
)

func init() {
	functions.CloudEvent("UploadImage", uploadImage)
}

// creates size variants of an uploaded image
func uploadImage(ctx context.Context, e event.Event) error {
	distributionBucket := os.Getenv("DISTRIBUTION_BUCKET")

	// log.Printf("Event ID: %s", e.ID())
	// log.Printf("Event Type: %s", e.Type())

	var data StorageObjectData
	if err := e.DataAs(&data); err != nil {
		return fmt.Errorf("event.DataAs: %v", err)
	}

	// log.Printf("Bucket: %s", data.Bucket)
	// log.Printf("File: %s", data.Name)
	// log.Printf("Metageneration: %d", data.Metageneration)
	// log.Printf("Created: %s", data.TimeCreated)
	// log.Printf("Updated: %s", data.Updated)

	log.Printf("Processing gs://%s/%s", data.Bucket, data.Name)
	f := getFilenameDetails(data.Name)

	// new client
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
		return nil
	}
	// return retryable error as there is a possibility that object does not temporarily exist
	if err != storage.ErrObjectNotExist {
		return err
	}

	// verify and validate src content-type and content (image vision)
	if err := validate(ctx, src); err != nil {
		fmt.Errorf("validation error, error = %v", err)
		if xerrors.Is(err, retryableError) {
			return err
		}
		return nil
	}

	// return error if the copy failed
	if _, err := dst.CopierFrom(src).Run(ctx); err != nil {
		return err
	}

	// read and decode src image
	rc, err := src.NewReader(ctx)
	if err != nil {
		fmt.Errorf("unable to read file %s in %s (%v)", data.Name, distributionBucket, err)
	}
	// read as []byte
	slurp, err := io.ReadAll(rc)
	rc.Close()
	if err != nil {
		fmt.Errorf("unable to slurp: %v", err)
	}
	i, ifmt, _ := image.Decode(bytes.NewReader(slurp))

	// create variants
	variants := []int{256, 800}
	// todo: consider making concurrent? faster, but might require more memory?
	for _, s := range variants {
		o, err := createVariant(ctx, dstbkt, i, ifmt, f, s)
		if err != nil {
			fmt.Errorf("failed to create %s variant %d: %v", o, s, err)
		}
	}

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
