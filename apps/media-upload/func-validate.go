package function

import (
	"context"
	"errors"
	"fmt"
	"image"
	"image/gif"
	"image/jpeg"
	"image/png"

	"cloud.google.com/go/storage"
	vision "cloud.google.com/go/vision/apiv1"
	"golang.org/x/xerrors"
	pb "google.golang.org/genproto/googleapis/cloud/vision/v1"
)

var retryableError = xerrors.New("upload: retryable error")

func validate(ctx context.Context, obj *storage.ObjectHandle) error {
	attrs, err := obj.Attrs(ctx)
	if err != nil {
		return xerrors.Errorf("upload: failed to get object attributes %q : %w",
			obj.ObjectName(), retryableError)
	}
	// max 5MB
	if attrs.Size >= 1024*1024*6 {
		return fmt.Errorf("upload: image file is too large, got = %d", attrs.Size)
	}
	// Validates obj and returns true if it conforms supported image formats.
	if err := validateMIMEType(ctx, attrs, obj); err != nil {
		return err
	}
	// Validates obj by calling Vision API.
	return validateByVisionAPI(ctx, obj)
}

func validateMIMEType(ctx context.Context, attrs *storage.ObjectAttrs, obj *storage.ObjectHandle) error {
	r, err := obj.NewReader(ctx)
	if err != nil {
		return xerrors.Errorf("upload: failed to open new file %q : %w",
			obj.ObjectName(), retryableError)
	}
	defer r.Close()
	if _, err := func(ct string) (image.Image, error) {
		switch ct {
		case "image/png":
			return png.Decode(r)
		case "image/jpeg", "image/jpg":
			return jpeg.Decode(r)
		case "image/gif":
			return gif.Decode(r)
		default:
			return nil, fmt.Errorf("upload: unsupported MIME type, got = %q", ct)
		}
	}(attrs.ContentType); err != nil {
		return err
	}
	return nil
}

// validateByVisionAPI uses Safe Search Detection provided by Cloud Vision API.
// See more details: https://cloud.google.com/vision/docs/detecting-safe-search
func validateByVisionAPI(ctx context.Context, obj *storage.ObjectHandle) error {
	client, err := vision.NewImageAnnotatorClient(ctx)
	if err != nil {
		return xerrors.Errorf(
			"upload: failed to create a ImageAnnotator client, error = %v : %w",
			err,
			retryableError,
		)
	}
	ssa, err := client.DetectSafeSearch(
		ctx,
		vision.NewImageFromURI(fmt.Sprintf("gs://%s/%s", obj.BucketName(), obj.ObjectName())),
		nil,
	)
	if err != nil {
		return xerrors.Errorf(
			"upload: failed to detect safe search, error = %v : %w",
			err,
			retryableError,
		)
	}
	// Returns an unretryable error if there is any possibility of inappropriate image.
	// Likelihood has been defined in the following:
	// https://github.com/google/go-genproto/blob/5fe7a883aa19554f42890211544aa549836af7b7/googleapis/cloud/vision/v1/image_annotator.pb.go#L37-L50
	if ssa.Adult >= pb.Likelihood_POSSIBLE ||
		ssa.Medical >= pb.Likelihood_POSSIBLE ||
		ssa.Violence >= pb.Likelihood_POSSIBLE ||
		ssa.Racy >= pb.Likelihood_POSSIBLE {
		return errors.New("upload: exceeds the prescribed likelihood")
	}
	return nil
}
