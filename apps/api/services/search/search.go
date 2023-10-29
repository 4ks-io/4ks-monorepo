// Package search is the search service
package search

import (
	"4ks/apps/api/dtos"
	"4ks/libs/go/models"
	"errors"
	"os"

	"github.com/rs/zerolog/log"
	"github.com/typesense/typesense-go/typesense"
	"github.com/typesense/typesense-go/typesense/api"
)

// Service is the interface for the search service
type Service interface {
	CreateSearchRecipeCollection() error
	RemoveSearchRecipeDocument(*string) error
	UpsertSearchRecipeDocument(*models.Recipe) error
}

type searchService struct {
}

// New creates a new search service
func New() Service {
	return &searchService{}
}

var tsURL = os.Getenv("TYPESENSE_URL")
var tsKey = os.Getenv("TYPESENSE_API_KEY")
var tsc = typesense.NewClient(typesense.WithServer(tsURL), typesense.WithAPIKey(tsKey))

func (us searchService) UpsertSearchRecipeDocument(r *models.Recipe) error {
	ing := []string{}
	for _, v := range r.CurrentRevision.Ingredients {
		ing = append(ing, v.Name)
	}

	ins := []string{}
	for _, v := range r.CurrentRevision.Instructions {
		ins = append(ins, v.Text)
	}

	var banner string
	for _, b := range r.CurrentRevision.Banner {
		if b.Alias == "md" {
			banner = b.URL
		}
	}

	document := dtos.CreateSearchRecipe{
		ID:          r.ID,
		Author:      r.Author.Username,
		Name:        r.CurrentRevision.Name,
		Ingredients: ing,
		ImageURL:    banner,
	}

	_, err := tsc.Collection("recipes").Documents().Upsert(document)
	if err != nil {
		return errors.New("failed to create search document")
	}

	return nil
}

func (us searchService) RemoveSearchRecipeDocument(id *string) error {
	_, err := tsc.Collection("recipes").Document(*id).Delete()
	if err != nil {
		return errors.New("failed to create search document")
	}

	return nil
}

// note: schema must overlap with additionalSearchParameters in search-context.tsx
func (us searchService) CreateSearchRecipeCollection() error {
	False := false
	True := true
	schema := &api.CollectionSchema{
		Name: "recipes",
		Fields: []api.Field{
			{
				Name: "author",
				Type: "string",
			},
			{
				Name: "name",
				Type: "string",
			},
			{
				Name: "ingredients",
				Type: "string[]",
			},
			{
				Name:     "imageURL",
				Type:     "string",
				Index:    &False,
				Optional: &True,
			},
		},
	}

	_, err := tsc.Collections().Create(schema)
	log.Error().Err(err).Caller().Msg("failed to create search collection")
	if err != nil {
		return err
	}

	return nil
}
