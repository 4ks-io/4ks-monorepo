package recipe

import (
	models "4ks/libs/go/models"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	s "strings"

	"github.com/PuerkitoBio/goquery"
	"golang.org/x/net/html"
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
  if (contentType != "" && !s.Contains(contentType, "text/html")) {
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
    parsed := make([]interface{}, 0)
    if err := json.Unmarshal([]byte(content), &parsed); err != nil {
      return nil, err
    }
    json.
  }
	return nil, nil // TODO
}

type pageScraper struct {
	stack []string
	z     *html.Tokenizer
}

// Create a new scraper instance from a URL
func NewPageScraper(url *string) (*pageScraper, error) {
	// Fetch page from URL
	webpage, err := http.Get(*url)
	if err != nil {
		return nil, err
	}

	// Create tokenizer from page
	z := html.NewTokenizer(webpage.Body)
	stack := make([]string, 0, 10) // stack of open tags

	return &pageScraper{z: z, stack: stack}, nil
}

func (ps *pageScraper) ScrapeRecipe() (*models.Recipe, error) {
	// Iterate over each token
	for {
		// Match token type
		tt := ps.z.Next()

		switch tt {
		case html.ErrorToken:
			// Return nil, nil if we've reached the end of the document, otherwise return the error
			err := ps.z.Err()
			if err == io.EOF {
				return nil, nil
			} else {
				return nil, err
			}

		case html.StartTagToken: // Start of tag
			// Add the new tag to the stack. append should grow the stack if necessary
			ps.stack = append(ps.stack, ps.z.Token().Data)

		case html.EndTagToken: // End of tag
			// Sanity check: make sure the stack isn't empty
			if len(ps.stack) == 0 {
				return nil, errors.New("error tokenizing webpage: Encountered end tag token but stack is empty")
			}
			// Sanity check: make sure the tag we're closing matches the top of the
			// stack.
			td := ps.z.Token().Data
			if td != ps.stack[len(ps.stack)-1] && td != "" {
				return nil, errors.New("error tokenizing webpage: Encountered end tag token but tag doesn't match top of stack")
			}
			// Pop the top of the stack
			ps.stack = ps.stack[:len(ps.stack)-1]

		case html.SelfClosingTagToken: // Self-closing tag
			// No need to add to the stack.
			continue

		case html.TextToken: // Text
		}

	}

}

// Returns true if the provided tag is self-closing
func isSelfClosing(tag string) bool {
	switch tag {
	case "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr":
		return true
	default:
		return false
	}
}
