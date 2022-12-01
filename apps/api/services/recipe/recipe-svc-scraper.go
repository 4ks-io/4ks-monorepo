package recipe

import (
	models "4ks/libs/go/models"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/PuerkitoBio/goquery"
)

func (rs recipeService) CreateRecipeFromWebpage(url *string) (*models.Recipe, error) {
	// Request the HTML page.
	res, err := http.Get(*url)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	// Ensure we have a valid response
	if res.StatusCode != 200 {
		return nil, fmt.Errorf("Failed to scrape webpage: request failed with code %s", res.Status)
	}

	// Ensure the response is HTML
	contentType := res.Header.Get("Content-Type")
	if contentType != "" && !s.Contains(contentType, "text/html") {
		return nil, fmt.Errorf("Failed to scrape webpage: expected content to be text/html, got %s", contentType)
	}

	// Load the HTML Document
	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		return nil, err
	}

	// If a JSON-LD recipe is found, use that
	// @see https://json-ld.org/
	// @see https://schema.org/Recipe
	if jsonLd := doc.Find("script[type='application/ld+json']").First(); jsonLd != nil {
		content := jsonLd.Text()

		// Parse the JSON-LD, which is just a JSON array
		// var result map[string]any
		parsed := make(map[string]interface{}, 0)
		if err := json.Unmarshal([]byte(content), &parsed); err != nil {
			return nil, err
		}

		return parseJsonLD(parsed)
	}

	return nil, nil // TODO
}

func parseJsonLD(json map[string]any) (*models.Recipe, error) {

	// Assert that '@context' is 'https://schema.org'
	if context, ok := json["@context"]; !ok || context != "https://schema.org" {
		return nil, errors.New("JSON-LD is not a schema.org object")
	}

	// "@graph" contains a list of entities, which may include a recipe
	graph, ok := json["@graph"].([]interface{})
	if !ok || len(graph) == 0 {
		return nil, errors.New("JSON-LD does not contain a @graph")
	}

	// Find recipe types in the graph
	recipes := make([]interface{}, 0)
	for _, item := range graph {
		if item.(map[string]interface{})["@type"].(string) == "Recipe" {
			recipes = append(recipes, item)
		}
	}

	// If there are no recipes, return an error
	if len(recipes) == 0 {
		return nil, errors.New("JSON-LD does not contain any recipes")
	}

	// For now, only pick the first recipe. Later we should find the best one
	// or just grab them all.
	r := recipes[0].(map[string]interface{})

	// Map Schema.org recipes to our own recipe model
	// Reference: https://schema.org/Recipe
	newRecipeDoc := recipeCollection.NewDoc()
	newRevisionDoc := recipeRevisionsCollection.NewDoc()

	recipeCreatedDate := time.Now().UTC()

	recipeRevision := &models.RecipeRevision{
		Id: newRevisionDoc.ID,
		// Name:     r["name"],
		// extract "name" from r safely
		Name:         r["name"].(string),
		RecipeId:     newRecipeDoc.ID,
		Author:       models.UserSummary{},   // TODO
		Images:       []models.Image{},       // TODO
		Instructions: []models.Instruction{}, // TODO
		Ingredients:  []models.Ingredient{},  // TODO
		// CreateDate:   recipeCreatedDate,
		// UpdateDate:   recipeCreatedDate,
		// Media:        []models.Media{}, // TODO
	}

	recipe := models.Recipe{}
	recipe.Author = models.UserSummary{}

	return nil, errors.New("todo") // TODO
}
