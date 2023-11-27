package main

import (
	"fmt"
	"net"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/go-kit/log"
	"github.com/go-kit/log/level"
	"github.com/gocolly/colly/v2"
	"github.com/google/go-cmp/cmp"
)

var serverIndexResponse = []byte("hello world\n")

func newTestHTTPServer(dat []byte) *httptest.Server {
	srv := newUnstartedTestServer(dat)

	// create a listener with the desired port.
	l, err := net.Listen("tcp", "127.0.0.1:44245")
	if err != nil {
		panic(err)
	}

	// NewUnstartedServer creates a listener. Close that listener and replace with new
	srv.Listener.Close()
	srv.Listener = l

	srv.Start()
	return srv
}

func newUnstartedTestServer(dat []byte) *httptest.Server {
	mux := http.NewServeMux()

	mux.HandleFunc("/recipe", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html")
		w.Write(dat)
	})

	return httptest.NewUnstartedServer(mux)
}

const mockURL = "http://127.0.0.1:44245/recipe"

var testCases = map[string]struct {
	Callbacks int
	Recipe    Recipe
}{
	"bigoven": {
		Callbacks: 1,
		Recipe: Recipe{
			SourceURL: mockURL,
			Title:     "Lemony Chicken and Rice Soup",
			Ingredients: []string{
				"1 tablespoon extra-virgin olive oil",
				"1 medium onion chopped",
				"4 celery stalks trimmed and sliced",
				"4 carrots sliced into rounds",
				"2 boneless, skinless chicken breasts",
				"8 cups chicken stock homemade or store-bought",
				"1 teaspoon kosher salt",
				"1/4 teaspoon black pepper",
				"1 cup long-grain white rice",
				"1/4 cup freshly squeezed lemon juice about 1 lemon",
				"1 teaspoon finely grated lemon zest optional",
				"1/4 cup fresh dill (or 1 tablespoon dried) roughly chopped",
				"1/4 cup fresh parsley (or 1 tablespoon dried) roughly chopped",
				"2 tablespoons unsalted butter",
			},
		},
	},
	"minimalistbaker": {
		Callbacks: 1,
		Recipe: Recipe{
			SourceURL: mockURL,
			Title:     "Creamy Vegan Tofu Cauliflower Curry (Korma-Inspired)",
			Ingredients: []string{
				"1 small head cauliflower, trimmed and cut into bite-sized florets",
				"1 (14 oz.) package  extra-firm tofu, torn into 1-inch pieces",
				"2 Tbsp olive or coconut oil",
				"1 Tbsp DIY curry powder ((or store-bought))",
				"1/2 tsp sea salt",
				"1 Tbsp olive or coconut oil",
				"1 medium onion, diced ((1 onion yields ~2 cups or 220 g))",
				"4 medium cloves garlic, minced",
				"1 Tbsp minced fresh ginger",
				"1 Tbsp DIY curry powder ((or store-bought))",
				"1 Tbsp tomato paste",
				"3/4 tsp sea salt",
				"2 ½ cups water ((DIVIDED))",
				"1/4 cup raw cashews",
				"1 Tbsp lemon juice ((optional))",
				"White or brown rice",
				"Coconut yogurt ((or other plain/unsweetened yogurt))",
				"Quick pickled onions",
				"Fresh cilantro",
			},
		},
	},
	"cooking-nytimes": {
		Callbacks: 1,
		Recipe: Recipe{
			SourceURL: mockURL,
			Title:     "Skillet Chicken With Mushrooms and Caramelized Onions",
			Ingredients: []string{
				"5 tablespoons olive oil", "2 tablespoons plus 2 teaspoons sherry vinegar",
				"2 teaspoons honey", "1 teaspoon Dijon mustard",
				"1/4 teaspoon red-pepper flakes", "Kosher salt and black pepper",
				"1 1/2 pounds boneless, skinless chicken thighs, cut into 3-inch pieces",
				"2 medium yellow onions, thinly sliced (about 4 cups)",
				"3/4 pound cremini mushrooms, stems removed and thinly sliced (about 4 cups)",
				"1/2 cup fresh flat-leaf parsley or dill leaves and fine stems, roughly chopped",
				"1/4 cup grated Parmesan or pecorino (optional)",
				"Bread or cooked pasta, for serving",
			},
		},
	},
	"ricardocuisine": {
		Callbacks: 1,
		Recipe: Recipe{
			SourceURL: mockURL,
			Title:     "Rôti de porc braisé aux pommes",
			Ingredients: []string{
				"2,5 kg  (5 1/2 lb) d’épaule de porc avec la couenne et l’os  (ou échine)",
				"60 ml  (1/4 tasse) d’huile d’olive",
				"3   oignons, hachés",
				"3   gousses d’ail, hachées",
				"500 ml  (2 tasses) de bouillon de poulet",
				"375 ml  (1 1/2 tasse) de compote de pommes non sucrée",
				"15 ml  (1 c. à soupe) de moutarde à l’ancienne",
				"1 litre  (4 tasses) de pommes de terre pelées et coupées  en gros cubes ou de petites pommes de terre grelots entières",
				"60 ml  (1/4 tasse) de persil plat ciselé",
				"60 ml  (1/4 tasse) de ciboulette fraîche ciselée",
				"3   pommes Lobo ou Cortland épépinées et  coupées en 12 quartiers chacune",
				"15 ml  (1 c. à soupe) de miel",
				"Sel et poivre",
			},
		},
	},
	"traeger": {
		Callbacks: 3,
		Recipe: Recipe{
			SourceURL: mockURL,
			Title:     "BBQ Pulled Pork Sliders Recipe | Traeger Grills",
			Ingredients: []string{
				"Persian cucumbers, washed", "kosher salt", "Sugar", "garlic cloves",
				"dried bay leaves", "whole black peppercorns", "whole white peppercorns",
				"whole fennel seeds", "whole coriander seeds", "red pepper flakes",
				"white wine vinegar", "ice water", "fresh dill", "(8-10 lb) bone-in pork butt",
				"Traeger Pork &amp; Poultry Rub, plus more to taste",
				"Traeger Apricot BBQ Sauce",
				"Mayonnaise",
				"ketchup",
				"Traeger Apricot BBQ Sauce",
				"sweet pickle relish",
				"yellow mustard",
				"Sugar",
				"distilled white vinegar",
				"Slider Buns",
			},
		},
	},
}

func TestRecipeHTML(t *testing.T) {
	// logger
	l := log.NewLogfmtLogger(log.NewSyncWriter(os.Stderr))
	l = level.NewFilter(l, level.Allow(level.ErrorValue()))

	// http client
	client := http.Client{
		Transport: &loggingTransport{},
	}

	// ld processor
	ld := NewLdProcessor(client)

	// run through test cases
	for name, tc := range testCases {
		// sub tests
		t.Run(name, func(t *testing.T) {
			callbackCount := 0

			// read test html
			dat, err := os.ReadFile(fmt.Sprintf("./testdata/%s.html", name))
			if err != nil {
				t.Errorf("(%s) failed to read file: %v", name, err)
			}

			// start mock html server
			ts := newTestHTTPServer(dat)
			defer ts.Close()

			c := colly.NewCollector()

			u := ts.URL + "/recipe"

			// onHTML callback
			c.OnHTML(ApplicationJSONLDScriptTag, func(e *colly.HTMLElement) {
				callbackCount++

				r, err := getRecipeFromJSONLD(l, ld, e, u)
				if err == notRecipe {
					return
				}
				if err != nil {
					t.Errorf("(%s) failed to get recipe from jsonld: %v", name, err)
				}
				diff := cmp.Diff(r, tc.Recipe)
				if diff != "" {
					t.Errorf("(%s) unexpected number ld+json scripts detected. %v", name, diff)
				}

				PrintStruct(r)

			})

			// visit
			c.Visit(u)

			// validate
			diff := cmp.Diff(callbackCount, tc.Callbacks)
			if diff != "" {
				t.Errorf("(%s) unexpected number ld+json scripts detected. %v", name, diff)
			}

		})
	}

}

// func TestJSONGold(t *testing.T) {
// 		// Inline JSON-LD formatted recipe
// 		jsonContent := `{
// 			"@context": "https://schema.org",
// 			"@type": "Recipe",
// 			"name": "Grandma's Holiday Apple Pie",
// 			"author": {
// 				"@type": "Person",
// 				"name": "Carol Smith"
// 			},
// 			"datePublished": "2009-11-05",
// 			"description": "A classic apple pie."
// 		}`

// 		// jsonContent := `{
// 		// 	"@context": {
// 		// 		"t1": "http://example.com/t1",
// 		// 		"t2": "http://example.com/t2",
// 		// 		"term1": "http://example.com/term1",
// 		// 		"term2": "http://example.com/term2",
// 		// 		"term3": "http://example.com/term3",
// 		// 		"term4": "http://example.com/term4",
// 		// 		"term5": "http://example.com/term5"
// 		// 	},
// 		// 	"@id": "http://example.com/id1",
// 		// 	"@type": "t1",
// 		// 	"term1": "v1",
// 		// 	"term2": {"@value": "v2", "@type": "t2"},
// 		// 	"term3": {"@value": "v3", "@language": "en"},
// 		// 	"term4": 4,
// 		// 	"term5": [50, 51]
// 		// }`

// 		var doc map[string]interface{}
// 		err := json.Unmarshal([]byte(jsonContent), &doc)
// 		if err != nil {
// 			fmt.Println("Error unmarshaling JSON:", err)
// 			return
// 		}

// 		proc := ld.NewJsonLdProcessor()
// 		options := ld.NewJsonLdOptions("")

// 		// Expanding the JSON-LD document
// 		expanded, err := proc.Expand(doc, options)
// 		if err != nil {
// 			fmt.Println("Error expanding JSON-LD:", err)
// 			return
// 		}

// 		// Printing the expanded JSON-LD
// 		ld.PrintDocument("Expanded JSON-LD", expanded)
// }
