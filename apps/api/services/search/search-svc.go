package search

import (
	"4ks/apps/api/dtos"
	"4ks/libs/go/models"
	"errors"
	"os"

	"github.com/typesense/typesense-go/typesense"
	"github.com/typesense/typesense-go/typesense/api"
)

type SearchService interface {
	CreateSearchRecipeCollection() error
	CreateSearchRecipeDocument(r *models.Recipe) error
	UpdateSearchRecipeDocument(r *models.Recipe) error
}

type searchService struct {
}

func New() SearchService {
	return &searchService{}
}

var tsUrl = os.Getenv("TYPESENSE_URL")
var tsKey = os.Getenv("TYPESENSE_API_KEY")
var tsc = typesense.NewClient(typesense.WithServer(tsUrl), typesense.WithAPIKey(tsKey))


func (us searchService) UpdateSearchRecipeDocument(r *models.Recipe) error {

	ing := []string{}
	for _, v := range r.CurrentRevision.Ingredients {
		ing = append(ing, v.Name)
	}

	ins := []string{}
	for _, v := range r.CurrentRevision.Instructions {
		ins = append(ins, v.Text)
	}

	document := dtos.CreateSearchRecipe{
		Id:           r.Id,
		Author:       r.Author.Username,
		Name:         r.CurrentRevision.Name,
		Ingredients:  ing,
		Instructions: ins,
	}

	_, err := tsc.Collection("recipes").Documents().Upsert(document)
	if err != nil {
		return errors.New("failed to update search document")
	}

	return nil
}

func (us searchService) CreateSearchRecipeDocument(r *models.Recipe) error {

	ing := []string{}
	for _, v := range r.CurrentRevision.Ingredients {
		ing = append(ing, v.Name)
	}

	ins := []string{}
	for _, v := range r.CurrentRevision.Instructions {
		ins = append(ins, v.Text)
	}

	document := dtos.CreateSearchRecipe{
		Id:           r.Id,
		Author:       r.Author.Username,
		Name:         r.CurrentRevision.Name,
		Ingredients:  ing,
		Instructions: ins,
	}

	_, err := tsc.Collection("recipes").Documents().Create(document)
	if err != nil {
		return errors.New("failed to create search document")
	}

	return nil
}


func (us searchService) CreateSearchRecipeCollection() error {
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