package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"html"
	"net/url"
	"regexp"
	"strings"

	"cloud.google.com/go/pubsub"
	"github.com/go-kit/log"
	"github.com/go-kit/log/level"
	"github.com/gocolly/colly/v2"

	models "4ks/libs/go/models"
	pb "4ks/libs/go/pubsub"
)

var (
	errNotRecipe = errors.New("not a recipe")
)

const (
	// ApplicationJSONLDType is the content type for json-ld
	ApplicationJSONLDType = "application/ld+json"
	// ApplicationJSONLDScriptTag is the selector for json-ld script tags
	ApplicationJSONLDScriptTag = `script[type="application/ld+json"]`
)

// FetcherService is the interface for the fetcher service
type FetcherService interface {
	IsReady() bool
	Visit(string) (Recipe, error)
	Start() error
	Stop()
}

type fetcherService struct {
	ctx      context.Context
	ready    bool
	debug    bool
	receiver *pb.PubSubConnection
	sender   *pb.PubSubConnection
}

// newFetcherService returns a new FetcherService
func newFetcherService(ctx context.Context, debug bool, client *pubsub.Client, reqo pb.PubsubOpts, reso pb.PubsubOpts) *fetcherService {
	l := loggerFromContext(ctx)

	// connect to receiver topic
	topreq, err := pb.ConnectTopic(ctx, client, reqo)
	if err != nil {
		level.Error(l).Log("msg", "failed to connect to topic", "project", reso.ProjectID, "topic", reso.TopicID, "error", err)
		panic(err)
	}

	// subscribe to receiver topic
	subreq, err := pb.SubscribeTopic(ctx, client, reqo, topreq)
	if err != nil {
		level.Error(l).Log("msg", "failed to subscribe to topic", "project", reso.ProjectID, "topic", reso.TopicID, "subscription", reqo.SubscriptionID, "error", err)
		panic(err)
	}

	// create receiver
	receiver := &pb.PubSubConnection{
		ProjectID:    reqo.ProjectID,
		TopicID:      reqo.TopicID,
		Topic:        topreq,
		Subscription: subreq,
	}

	// connect to sender topic
	topres, err := pb.ConnectTopic(ctx, client, reso)
	if err != nil {
		level.Error(l).Log("msg", "failed to connect to topic", "project", reso.ProjectID, "topic", reso.TopicID, "error", err)
		panic(err)
	}

	// create sender
	sender := &pb.PubSubConnection{
		ProjectID: reso.ProjectID,
		TopicID:   reqo.TopicID,
		Topic:     topres,
	}

	return &fetcherService{
		ctx:      ctx,
		ready:    false,
		debug:    debug,
		receiver: receiver,
		sender:   sender,
	}
}

func collyOnRequest(l log.Logger) func(r *colly.Request) {
	return func(r *colly.Request) {
		level.Info(l).Log("msg", "visiting", "target", r.URL.String())
	}
}

func (s *fetcherService) IsReady() bool {
	return s.ready
}

func (s *fetcherService) Visit(target string) (Recipe, error) {
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
	var recipe Recipe

	// colly onRequest
	c.OnRequest(collyOnRequest(l))

	// process 'application/ld+json' scripts
	c.OnHTML(ApplicationJSONLDScriptTag, func(e *colly.HTMLElement) {
		// level.Debug(l).Log("msg", ApplicationJSONLDType+"script detected")
		recipe, err = getRecipeFromJSONLD(l, e, target)
	})

	if err := c.Visit(target); err != nil {
		level.Error(l).Log("msg", "failed to visit", "error", err)
		return recipe, err
	}

	return recipe, nil
}

func getRecipeFromJSONLD(l log.Logger, e *colly.HTMLElement, u string) (Recipe, error) {
	// json scrubbing
	jsonData := strings.TrimSpace(e.Text)
	jsonData = strings.ReplaceAll(jsonData, "\n", "")

	var data interface{}
	if err := json.Unmarshal([]byte(jsonData), &data); err != nil {
		return Recipe{}, err
	}

	node := searchJSON(data)
	if node == nil {
		return Recipe{}, errNotRecipe
	}

	ingredients, err := getIngredients(l, node["recipeIngredient"])
	if err != nil {
		level.Debug(l).Log("msg", "failed to get ingredients", "error", err)
	}

	var instructions []string
	if node["recipeInstructions"] != nil {
		instructions, err = getInstructions(l, node["recipeInstructions"])
		if err != nil {
			level.Debug(l).Log("msg", "failed to read recipeInstructions", "error", err)
			// todo: log this url/html
		}
	}

	return Recipe{
		SourceURL:    u,
		Title:        node["name"].(string),
		Ingredients:  ingredients,
		Instructions: instructions,
	}, nil
}

func removeEmptyStrings(s []string) []string {
	re := regexp.MustCompile(`^\s*$`)
	filteredLines := []string{}
	for _, line := range s {
		if line != "" || !re.MatchString(line) {
			filteredLines = append(filteredLines, line)
		}
	}
	return filteredLines
}

// getInstructions returns a slice of strings from a slice of interface{}
func getInstructions(_ log.Logger, in interface{}) ([]string, error) {
	var o []string

	// marshal
	jsonData, err := json.Marshal(in)
	if err != nil {
		// todo: log this url/html
		return o, err
	}

	// unmarsal -- confirm is array
	var data []interface{}
	err = json.Unmarshal(jsonData, &data)
	if err != nil {
		// error unmarshaling -- expected array
		// todo: log this url/html
		return o, err
	}

	// handle known instruction shapes

	// [{
	//   "@type": "HowToStep"
	//   "text": "foo",
	// }]
	// -- OR --
	// [{
	// 	"@type": "HowToStep",
	// 	"name": "foo",
	// 	"text": "foo",
	// },
	var howtostep []HowToStep
	if err = json.Unmarshal(jsonData, &howtostep); err == nil { // inverted check
		if howtostep[0].Type == "HowToStep" {
			for _, v := range howtostep {
				o = append(o, html.UnescapeString(v.Text))
			}
			return removeEmptyStrings(o), nil
		}
	}

	// [{
	//   "@type": "HowToSection",
	//   "name": "bar",
	//   "itemListElement": [
	//     {
	//       "@type": "HowToStep",
	//       "text": "foo."
	//     },
	var howtosection []HowToSection
	if err = json.Unmarshal(jsonData, &howtosection); err == nil { // inverted check
		if howtosection[0].Type == "HowToSection" {
			for _, v := range howtosection[0].ItemList {
				o = append(o, html.UnescapeString(v.Text))
			}
		}
		return removeEmptyStrings(o), nil
	}

	// [ "1. foo 2. bar" ] || [ "foo", "bar" ]
	var simplestring []string
	if err = json.Unmarshal(jsonData, &simplestring); err == nil { // inverted check
		// handle very stupid case where instructions are possibly concatenated into a single string
		if len(simplestring) == 1 && len(simplestring[0]) >= 2 && simplestring[0][:2] == "1." {
			re := regexp.MustCompile(`\d+\. `)

			// Split the text into lines
			o = re.Split(simplestring[0], -1)

			// Trim the leading and trailing spaces from each line
			for i, line := range o {
				s := html.UnescapeString(line)
				o[i] = strings.TrimSpace(s)
			}

			return removeEmptyStrings(o), nil
		}

		return simplestring, nil
	}

	return o, nil
}

// getIngredients returns a slice of strings from a slice of interface{}
func getIngredients(_ log.Logger, in interface{}) ([]string, error) {
	data, err := json.Marshal(in)
	if err != nil {
		return []string{}, err
	}

	var o []string
	err = json.Unmarshal(data, &o)
	if err != nil {
		return []string{}, err
	}

	for i, v := range o {
		o[i] = html.UnescapeString(v)
	}

	return removeEmptyStrings(o), nil
}

// Recipe is a struct to hold the scraped recipe data
type Recipe struct {
	SourceURL    string
	Title        string
	Ingredients  []string
	Instructions []string
}

// HowToSection is a struct to hold the scraped recipe data
type HowToSection struct {
	Type     string      `json:"@type"`
	ItemList []HowToStep `json:"itemListElement"`
}

// HowToStep is a struct to hold the scraped recipe data
type HowToStep struct {
	Type string `json:"@type"`
	Text string `json:"text"`
}

type searchStack struct {
	value  interface{}
	parent map[string]interface{}
}

func searchJSON(data interface{}) map[string]interface{} {
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

type Message struct {
	Data string `json:"data"`
}

// Start the service and begin processing messages.
func (svc *fetcherService) Start() error {
	l := loggerFromContext(svc.ctx)
	svc.ready = true
	level.Info(l).Log("msg", "service started")

	msgHandler := func(ctx context.Context, m *pubsub.Message) {
		var f models.FetcherRequest
		if err := pb.DecodeFromBase64(&f, string(m.Data)); err != nil {
			m.Nack()
			return
		}

		// Acknowledge the message
		m.Ack()

		// todo: after ack, errors should be written to firestore for debugging and analytics

		// validate url
		u := fmt.Sprintf("%s", f.URL)
		if _, err := url.Parse(u); err != nil {
			m.Nack()
			return
		}

		recipe, err := svc.Visit(u)
		if err != nil {
			level.Error(l).Log("msg", "failed to visit", "error", err)
		}
		level.Info(l).Log("msg", "recipe", "title", recipe.Title, "userID", f.UserID, "userEventID", f.UserEventID)
		// PrintStruct(r)

		res := models.FetcherResponse{
			Name:         recipe.Title,
			Link:         recipe.SourceURL,
			Instructions: recipe.Instructions,
			Ingredients:  recipe.Ingredients,
		}

		d, err := pb.EncodeToBase64(res)
		if err != nil {
			level.Error(l).Log("msg", "failed to encode recipe", "error", err)
			return
		}

		result := svc.sender.Topic.Publish(ctx, &pubsub.Message{
			Data: []byte(d),
			Attributes: map[string]string{
				"URL":         u,
				"UserID":      f.UserID,
				"UserEventID": (f.UserEventID).String(),
			},
		})

		// Block until the result is returned and a server-generated
		// ID is returned for the published message.
		_, err = result.Get(ctx)
		if err != nil {
			level.Error(l).Log("msg", "failed to publish message", "error", err)
		}

	}

	for svc.ready {
		// level.Info(l).Log("msg", "service loop ...")
		// time.Sleep(5 * time.Second)
		if err := svc.receiver.Subscription.Receive(svc.ctx, msgHandler); err != nil {
			level.Error(l).Log("msg", "failed to receive message", "error", err)
		}
		// level.Info(l).Log("msg", "service loop ...")
	}
	return nil
}

// Stop instructs the service to stop processing new messages.
func (svc *fetcherService) Stop() {
	l := loggerFromContext(svc.ctx)
	level.Info(l).Log("msg", "stopping service")
	svc.receiver.Subscription.Delete(svc.ctx)
	svc.ready = false
}
