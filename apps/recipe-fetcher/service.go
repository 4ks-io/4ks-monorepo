package main

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/url"
	"strings"

	"github.com/go-kit/log"
	"github.com/go-kit/log/level"
	"github.com/gocolly/colly/v2"
)

const (
	ApplicationJSONLDType      = "application/ld+json"
	ApplicationJSONLDScriptTag = `script[type="application/ld+json"]`
)

type FetcherService interface{}

type fetcherService struct {
	ctx   context.Context
	ld    LdProcessor
	debug bool
}

func NewFetcherService(ctx context.Context, debug bool) *fetcherService {
	// toggle debugging
	client := http.Client{}
	if debug {
		client = http.Client{
			Transport: &loggingTransport{},
		}
	}

	ld := NewLdProcessor(client)

	return &fetcherService{
		ctx,
		ld,
		debug,
	}
}

func collyOnRequest(l log.Logger) func(r *colly.Request) {
	return func(r *colly.Request) {
		level.Info(l).Log("msg", "visiting", "target", r.URL.String())
	}
}

func (s *fetcherService) Visit(target string) error {
	l := loggerFromContext(s.ctx)

	// get domain
	if target == "" {
		err := errors.New("target is required")
		level.Error(l).Log("msg", "target is required", "error", err)
		panic(err)
	}
	u, err := url.Parse(target)
	if err != nil {
		level.Error(l).Log("msg", "failed to parse target", "target", target)
		panic(err)
	}
	hostname := u.Hostname()
	level.Debug(l).Log("msg", "hostname", "hostname", hostname)

	// init colly
	c := initCollector(hostname, s.debug)

	// colly onRequest
	c.OnRequest(collyOnRequest(l))

	// process 'application/ld+json' scripts
	c.OnHTML(ApplicationJSONLDScriptTag, func(e *colly.HTMLElement) {
		// level.Debug(l).Log("msg", ApplicationJSONLDType+"script detected")
		// data, err := getRecipeFromJSONLD(l, e)
		_, _ = getRecipeFromJSONLD(l, s.ld, e, target)
	})

	if err := c.Visit(target); err != nil {
		level.Error(l).Log("msg", "failed to visit", "error", err)
		return err
	}

	return nil
}

func getRecipeFromJSONLD(l log.Logger, ld LdProcessor, e *colly.HTMLElement, u string) (Recipe, error) {
	// json scrubbing
	jsonData := strings.TrimSpace(e.Text)
	jsonData = strings.ReplaceAll(jsonData, "\n", "")

	var data interface{}
	if err := json.Unmarshal([]byte(jsonData), &data); err != nil {
		return Recipe{}, err
	}

	node := searchJSON(data)
	if node == nil {
		return Recipe{}, notRecipe
	}

	ingredients, err := getIngredients(node["recipeIngredient"])
	if err != nil {
		level.Debug(l).Log("msg", "failed to get ingredients", "error", err)
	}

	// PrintStruct(node["recipeIngredient"])
	// PrintStruct(node["recipeInstructions"])

	// // determine if node is a valide schema.org recipe implementation
	// expanded, err := ld.Parse(node)
	// if err == nil {
	// 	PrintStruct(expanded)
	// 	// node is a valide schema.org recipe implementation
	// 	jsonData, err := json.Marshal(expanded)
	// 	if err != nil {
	// 		return Recipe{}, err
	// 	}

	// 	r, err := unmarshalToRecipe(jsonData)
	// 	r.SourceURL = u
	// 	return r, err
	// }

	// PrintStruct(node)

	return Recipe{
		SourceURL:   u,
		Title:       node["name"].(string),
		Ingredients: ingredients,
	}, nil
}

func getIngredients(in interface{}) ([]string, error) {
	data, err := json.Marshal(in)
	if err != nil {
		return []string{}, err
	}

	var o []string
	err = json.Unmarshal(data, &o)
	if err != nil {
		return []string{}, err
	}

	return o, nil
}

// Unmarshal and determine type
func unmarshalToRecipe(jsonData []byte) (Recipe, error) {
	// generic map
	var g map[string]interface{}
	err := json.Unmarshal(jsonData, &g)
	if err != nil {
		return Recipe{}, err
	}

	const prefix = "http://schema.org/"

	r := Recipe{}

	if _, ok := g[prefix+"name"].([]interface{}); ok {
		r.Title = g[prefix+"name"].([]interface{})[0].(map[string]interface{})["@value"].(string)
	}

	if _, ok := g[prefix+"recipeIngredient"].([]interface{}); ok {
		for _, v := range g[prefix+"recipeIngredient"].([]interface{}) {
			r.Ingredients = append(r.Ingredients, v.(map[string]interface{})["@value"].(string))
		}
	}

	if _, ok := g[prefix+"recipeInstructions"].([]interface{}); ok {
		// [ "1. foo 2. bar" ],

		// [{
		//   "text": "foo.",
		//   "@type": "HowToStep"
		// }]

		// [{
		//   "@type": "HowToSection",
		//   "name": "R\u00f4ti de porc brais\u00e9 aux pommes",
		//   "itemListElement": [
		//     {
		//       "@type": "HowToStep",
		//       "text": "foo."
		//     },

		// [{
		// 	"@type": "HowToStep",
		// 	"name": "foo",
		// 	"text": "foo",
		// 	"url": "https://minimalistbaker.com/creamy-vegan-tofu-cauliflower-korma-curry/#wprm-recipe-115690-step-0-0"
		// },

		// PrintStruct(g[prefix + "recipeInstructions"].([]interface{}))
	}

	return r, nil
}

// Recipe is a struct to hold the scraped recipe data
type Recipe struct {
	SourceURL    string
	Title        string
	Ingredients  []string
	Instructions []string
}

type HowToSection struct {
	List []HowToStep `json:"http://schema.org/itemListElement"`
}

type HowToStep struct {
	Text []Value `json:"http://schema.org/text"`
}

type Value struct {
	Value string `json:"@value"`
}

func searchJSON(data interface{}) map[string]interface{} {
	return searchJSONIterative(data)
	// return searchJSONRecursive(data)
}

type searchStack struct {
	value  interface{}
	parent map[string]interface{}
}

func searchJSONIterative(data interface{}) map[string]interface{} {
	stack := []searchStack{{value: data}}

	for len(stack) > 0 {
		current := stack[len(stack)-1]
		stack = stack[:len(stack)-1]

		switch t := current.value.(type) {
		case map[string]interface{}:
			for key, value := range t {
				if key == "@type" && value == "Recipe" {
					return t
				}

				stack = append(stack, searchStack{value: value, parent: t})
			}
		case []interface{}:
			for _, item := range t {
				stack = append(stack, searchStack{value: item, parent: nil})
			}
		default:
			// fmt.Printf("Unsupported type: %T\n", data)
		}
	}

	return nil
}

// func searchJSONRecursive(data interface{}) map[string]interface{} {
//   switch t := data.(type) {
//   case map[string]interface{}:
//     if t["@type"] == "Recipe" {
//       return t
//     }

//     for _, item := range t {
//       if node := searchJSON(item); node != nil {
//         return node
//       }
//     }
//   case []interface{}:
//     for _, item := range t {
//       if node := searchJSON(item); node != nil {
//         return node
//       }
//     }
//   default:
//     // fmt.Printf("Unsupported type: %T\n", data)
//   }
//   return nil
// }
