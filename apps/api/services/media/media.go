package media

import (
	"context"
	"errors"
	"fmt"
	"os"
	"time"

	"cloud.google.com/go/storage"
	"github.com/google/uuid"
)

var (
	ErrTargetNotFound = errors.New("unable to get token")
	ErrInvalidContentType = errors.New("invalid content-type")
)


type MediaService interface {
	GetToken(ext *string, ct *string) (*string, error)
}

type mediaService struct {
}

func New() MediaService {
	return &mediaService{}
}

const expirationMinutes = 5

var (
	ErrFailedToSign           = errors.New("failed to sign by internal server error")
)

func (ms mediaService) GetToken(ext *string, ct *string) (*string, error) {
	// reading env var takes ~75ns. maybe better to read only once?
	// but this keeps everything together and also won't blow up locally
	// should we disable media route locally?
	uploadableBucket := os.Getenv("UPLOADABLE_BUCKET")
	serviceAccountName := os.Getenv("SERVICE_ACCOUNT_EMAIL")

	// cred, err := google.DefaultClient(context.Background(), iam.CloudPlatformScope)
	// if err != nil {
	// 	log.Fatal(err)
	// }

	// iamService, err = iam.New(cred)
	// if err != nil {
	// 	log.Fatal(err)
	// }

	ctx := context.Background()
	client, err := storage.NewClient(ctx)
	if err != nil {
		return nil, fmt.Errorf("storage.NewClient: %v", err)
	}
	defer client.Close()

	object := uuid.New().String() + *ext

	fmt.Println("object: "+object)
	fmt.Println("contentType: "+ *ct)

	// https://pkg.go.dev/cloud.google.com/go/storage#SignedURLOptions
	opts := &storage.SignedURLOptions{
		Scheme: storage.SigningSchemeV4,
		GoogleAccessID: serviceAccountName,
		Method:         "PUT",
		Expires:        time.Now().Add(expirationMinutes * time.Minute),
		// ContentType:    *ct,
		// Headers: []string{
		// 	"Content-Type:image/jpeg",
		// },
	}

	url, err := client.Bucket(uploadableBucket).SignedURL(object, opts)

	if err != nil {
		return nil, fmt.Errorf("Bucket(%q). SignedURL: %v", uploadableBucket, err)
	}

	return &url, nil
}

