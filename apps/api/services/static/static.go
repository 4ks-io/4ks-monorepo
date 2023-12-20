// Package static is the static service
package static

import (
	"context"
	"fmt"
	"math/rand"
	"os"
	"time"

	"cloud.google.com/go/storage"
	"github.com/bluele/gcache"
	"github.com/rs/zerolog/log"
	"google.golang.org/api/iterator"
)

// todo: move to main
var mediaFallbackURL = os.Getenv("MEDIA_FALLBACK_URL")
var staticMediaBucket = os.Getenv("STATIC_MEDIA_BUCKET")

// Service is the interface for the static service
type Service interface {
	GetRandomFallbackImage(context.Context) (string, error)
	GetRandomFallbackImageURL(string) string
}

type staticService struct {
	cache gcache.Cache
}

// New creates a new static service
func New() Service {
	return &staticService{
		cache: gcache.New(20).LRU().Build(),
	}
}

func (ss staticService) GetRandomFallbackImageURL(filename string) string {
	return fmt.Sprintf("%s/%s", mediaFallbackURL, filename)
}

// GetRandomFallbackImage returns a random fallback image
func (ss staticService) GetRandomFallbackImage(c context.Context) (string, error) {
	images, err := FetchFallbackImages(c, ss.cache)
	if err != nil {
		return "", err
	}

	// random static bucket fallback image
	s := rand.NewSource(time.Now().UnixNano())
	r := rand.New(s) // initialize local pseudorandom generator
	i := images[r.Intn(len(images))]

	return i, nil
}

// FetchFallbackImages fetches fallback images from cache or bucket
func FetchFallbackImages(c context.Context, cache gcache.Cache) ([]string, error) {
	key := "fallback"
	images, err := cache.Get(key)
	if err != nil {
		img, err := FetchFallbackImagesFromBucket(c)
		if err != nil {
			return nil, err
		}

		cache.SetWithExpire(key, img, time.Second*3600)
		log.Info().Msg("Fallback images cached for 3600 seconds")

		images, err = cache.Get(key)
		if err != nil {
			return nil, err
		}
	}

	return images.([]string), nil
}

// FetchFallbackImagesFromBucket fetches fallback images from bucket
func FetchFallbackImagesFromBucket(c context.Context) ([]string, error) {
	client, err := storage.NewClient(c)
	if err != nil {
		return nil, fmt.Errorf("storage.NewClient: %v", err)
	}
	defer client.Close()

	bkt := client.Bucket(staticMediaBucket)
	query := &storage.Query{Prefix: "static/fallback/f"}

	var files []string
	it := bkt.Objects(c, query)
	for {
		attrs, err := it.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, err
		}
		files = append(files, attrs.Name)
	}

	return files, nil
}
