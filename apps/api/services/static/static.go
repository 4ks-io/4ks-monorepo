// Package static is the static service
package static

import (
	"context"
	"fmt"
	"math/rand"
	"time"

	"cloud.google.com/go/storage"
	"github.com/bluele/gcache"
	"github.com/rs/zerolog/log"
	"google.golang.org/api/iterator"
)

// Service is the interface for the static service
type Service interface {
	GetRandomFallbackImage(context.Context) (string, error)
	GetRandomFallbackImageURL(string) string
}

type staticService struct {
	store                     *storage.Client
	cache                     gcache.Cache
	mediaFallbackURL          string
	staticMediaBucket         string
	staticMediaFallbackPrefix string
}

// New creates a new static service
func New(store *storage.Client, mediaFallbackURL, staticMediaBucket string, staticMediaFallbackPrefix string) Service {
	return &staticService{
		store:                     store,
		cache:                     gcache.New(20).LRU().Build(),
		mediaFallbackURL:          mediaFallbackURL,
		staticMediaBucket:         staticMediaBucket,
		staticMediaFallbackPrefix: staticMediaFallbackPrefix,
	}
}

func (ss staticService) GetRandomFallbackImageURL(filename string) string {
	return fmt.Sprintf("%s/%s", ss.mediaFallbackURL, filename)
}

// GetRandomFallbackImage returns a random fallback image
func (ss staticService) GetRandomFallbackImage(c context.Context) (string, error) {
	images, err := FetchFallbackImages(c, ss.store, ss.cache, ss.staticMediaBucket, ss.staticMediaFallbackPrefix)
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
func FetchFallbackImages(c context.Context, store *storage.Client, cache gcache.Cache, staticMediaBucket string, staticMediaFallbackPrefix string) ([]string, error) {
	key := "fallback"
	images, err := cache.Get(key)
	if err != nil {
		img, err := FetchFallbackImagesFromBucket(c, store, staticMediaBucket, staticMediaFallbackPrefix)
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
func FetchFallbackImagesFromBucket(c context.Context, store *storage.Client, staticMediaBucket string, prefix string) ([]string, error) {
	bkt := store.Bucket(staticMediaBucket)
	query := &storage.Query{Prefix: prefix}
	log.Debug().Msgf("prefix: %s", prefix)

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
		log.Debug().Msg(attrs.Name)
		files = append(files, attrs.Name)
	}

	return files, nil
}
