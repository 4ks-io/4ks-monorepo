package search

import (
	"fmt"
	"math/rand"
	"os"
	"time"

	"cloud.google.com/go/storage"
	"github.com/bluele/gcache"
	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
	"google.golang.org/api/iterator"
)

var MEDIA_FALLBACK_URL = os.Getenv("MEDIA_FALLBACK_URL")
var STATIC_MEDIA_BUCKET = os.Getenv("STATIC_MEDIA_BUCKET")

type StaticService interface {
	GetRandomFallbackImage(c *gin.Context) (string, error)
	GetRandomFallbackImageUrl(filename string) string
}

type staticService struct {
	cache gcache.Cache
}

func New() StaticService {
	return &staticService{
		cache: gcache.New(20).LRU().Build(),
	}
}

func (ss staticService) GetRandomFallbackImageUrl(filename string) string {
	return fmt.Sprintf("%s/%s", MEDIA_FALLBACK_URL, filename)
}

func (ss staticService) GetRandomFallbackImage(c *gin.Context) (string, error) {
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

// fetch fallback images from cache or bucket
func FetchFallbackImages(c *gin.Context, cache gcache.Cache) ([]string, error) {
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

// fetch fallback images from bucket
func FetchFallbackImagesFromBucket(c *gin.Context) ([]string, error) {
	client, err := storage.NewClient(c)
	if err != nil {
		return nil, fmt.Errorf("storage.NewClient: %v", err)
	}
	defer client.Close()

	bkt := client.Bucket(STATIC_MEDIA_BUCKET)
	query := &storage.Query{Prefix: "fallback/f"}

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
