package search

import (
	"github.com/typesense/typesense-go/typesense"
	"github.com/typesense/typesense-go/typesense/api"
)

type SearchService interface {
	CreateRecipeSearchCollection() (error)
}

type searchService struct {
}

func New() SearchService {
	return &searchService{}
}

var tsUrl = "http://typesense.default.svc.cluster.local:8108"
var tsKey = "local-4ks-api-key"
var tsc = typesense.NewClient(typesense.WithServer(tsUrl), typesense.WithAPIKey(tsKey))

func (us searchService) CreateRecipeSearchCollection() (error) {
	
	schema := &api.CollectionSchema{
		Name: "recipes",
		Fields: []api.Field{
			{
				Name: "recipeId",
				Type: "string",
			},
			{
				Name: "author",
				Type: "string",
			},
			{
				Name: "name",
				Type: "string",
			},
			{
				Name: "instructions",
				Type: "string[]",
			},
			{
				Name: "ingredients",
				Type: "string[]",
			},
		},
	}

	_, err := tsc.Collections().Create(schema)
	if err != nil {
		return err
	}

	return nil
}
