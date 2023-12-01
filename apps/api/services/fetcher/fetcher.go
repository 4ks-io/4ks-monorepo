// Package fetchervc is the user service
package fetchervc

import (
	"4ks/apps/api/dtos"
	recipeService "4ks/apps/api/services/recipe"
	searchService "4ks/apps/api/services/search"
	staticService "4ks/apps/api/services/static"
	userService "4ks/apps/api/services/user"
	"4ks/libs/go/models"
	pb "4ks/libs/go/pubsub"
	"context"

	"cloud.google.com/go/pubsub"
	"github.com/google/uuid"
	"github.com/rs/zerolog/log"

	"4ks/apps/api/utils"
)

// Service is the interface for the user service
type Service interface {
	Send(context.Context, *models.FetcherRequest) (string, error)
	Start() error
}

type fetcherService struct {
	sysFlags      *utils.SystemFlags
	receiver      *pb.PubSubConnection
	sender        *pb.PubSubConnection
	context       context.Context
	recipeService recipeService.Service
	userService   userService.Service
	searchService searchService.Service
	staticService staticService.Service
	ready         bool
}

// New creates a new user service
func New(ctx context.Context, sysFlags *utils.SystemFlags, client *pubsub.Client, reqo pb.PubsubOpts, reso pb.PubsubOpts, userSvc userService.Service, recipeSvc recipeService.Service, searchSvc searchService.Service, staticSvc staticService.Service) Service {
	// connect to receiver topic
	topreq, err := pb.ConnectTopic(ctx, client, reqo)
	if err != nil {
		log.Error().Caller().Err(err).Str("project", reqo.ProjectID).Str("topic", reqo.TopicID).Msg("failed to connect to topic")
		panic(err)
	}

	// subscribe to receiver topic
	subreq, err := pb.SubscribeTopic(ctx, client, reqo, topreq)
	if err != nil {
		log.Error().Caller().Err(err).Str("project", reqo.ProjectID).Str("topic", reqo.TopicID).Str("subscription", reqo.SubscriptionID).Msg("failed to establish subscription")
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
		log.Error().Caller().Err(err).Str("project", reso.ProjectID).Str("topic", reso.TopicID).Msg("failed to connect to topic")
		panic(err)
	}

	// create sender
	sender := &pb.PubSubConnection{
		ProjectID: reso.ProjectID,
		TopicID:   reqo.TopicID,
		Topic:     topres,
	}

	return &fetcherService{
		sysFlags:      sysFlags,
		staticService: staticSvc,
		searchService: searchSvc,
		recipeService: recipeSvc,
		userService:   userSvc,
		receiver:      receiver,
		sender:        sender,
		context:       ctx,
	}
}

func (s *fetcherService) Send(ctx context.Context, data *models.FetcherRequest) (string, error) {
	var id string
	t := s.sender.Topic

	d, err := pb.EncodeToBase64(data)
	if err != nil {
		log.Error().Caller().Err(err).Msg("Failed to encode message")
		return id, err
	}

	result := t.Publish(ctx, &pubsub.Message{
		Data: []byte(d),
		Attributes: map[string]string{
			"URL":         data.URL,
			"UserID":      data.UserID,
			"UserEventID": (data.UserEventID).String(),
		},
	})

	// Block until the result is returned and a server-generated
	// ID is returned for the published message.
	id, err = result.Get(ctx)
	if err != nil {
		log.Error().Caller().Err(err).Msg("failed to publish message")
	}

	return id, nil
}

func (s *fetcherService) MessageHandler() error {
	return nil
}

// Start watches pubsub for messages
func (svc *fetcherService) Start() error {
	msgHandler := func(ctx context.Context, m *pubsub.Message) {
		log.Info().Caller().Msg("msg received from fetcher service")
		// utils.PrintStruct(m.Data)

		var f models.FetcherResponse
		if err := pb.DecodeFromBase64(&f, string(m.Data)); err != nil {
			m.Nack()
			return
		}

		// Acknowledge the message
		m.Ack()

		// update event
		var userID string
		var userEventID uuid.UUID
		var err error

		// log.Info().Msg("attributes")
		// utils.PrintStruct(m.Attributes)

		userID = m.Attributes["UserID"]
		userEventID, err = uuid.Parse(m.Attributes["UserEventID"])

		e := dtos.UpdateUserEvent{
			ID: userEventID,
		}

		// convert []string to recipe instructions
		var instructions []models.Instruction
		for _, i := range f.Instructions {
			instructions = append(instructions, models.Instruction{
				Text: i,
			})
		}

		// convert []string to recipe ingredients
		var ingredients []models.Ingredient
		for _, i := range f.Ingredients {
			ingredients = append(ingredients, models.Ingredient{
				Name: i,
			})
		}

		// recipe
		payload := dtos.CreateRecipe{
			Name: f.Name,
			Link: f.Link,
			Author: models.UserSummary{
				ID:          "bot",
				Username:    "4ks-bot",
				DisplayName: "4ks bot",
			},
			Instructions: instructions,
			Ingredients:  ingredients,
		}

		fallback, err := svc.staticService.GetRandomFallbackImage(ctx)
		if err != nil {
			log.Error().Err(err).Msg("failed to get random fallback image")
		}
		u := svc.staticService.GetRandomFallbackImageURL(fallback)
		payload.Banner = svc.recipeService.CreateMockBanner(fallback, u)

		// log.Info().Caller().Msg("payload")
		// utils.PrintStruct(payload)

		// create recipe
		createdRecipe, err := svc.recipeService.CreateRecipe(ctx, &payload)
		if err != nil {
			msg := "failed to create recipe"
			log.Error().Caller().Err(err).Str("userID", userID).Str("userEventID", (userEventID).String()).Msg(msg)
			e.Status = models.UserEventErrorState
			e.Error = models.UserEventError{Message: msg}
			svc.userService.UpdateUserEventByUserIDEventID(ctx, m.Attributes["UserID"], &e)
		}
		e.Data = models.FetcherEventData{
			RecipeID:    createdRecipe.ID,
			RecipeTitle: createdRecipe.CurrentRevision.Name,
			URL:         m.Attributes["URL"],
		}

		// update search
		if err == nil {
			err = svc.searchService.UpsertSearchRecipeDocument(createdRecipe)
			if err != nil {
				msg := "failed to update search"
				log.Error().Caller().Err(err).Str("userID", userID).Str("userEventID", (userEventID).String()).Msg(msg)
				e.Status = models.UserEventErrorState
				e.Error = models.UserEventError{Message: msg}
				svc.userService.UpdateUserEventByUserIDEventID(ctx, m.Attributes["UserID"], &e)
			}
		}

		// possibly update user event with error
		if err != nil || userID == "" || createdRecipe.ID == "" || userEventID == uuid.Nil {
			msg := "failed to parse event attributes"
			log.Error().Caller().Err(err).Str("userID", userID).Str("userEventID", (userEventID).String()).Msg(msg)
			e.Status = models.UserEventErrorState
			e.Error = models.UserEventError{Message: msg}
			svc.userService.UpdateUserEventByUserIDEventID(ctx, m.Attributes["UserID"], &e)
			return
		}

		e.Status = models.UserEventReady
		log.Debug().Caller().Msg("updating user event")
		svc.userService.UpdateUserEventByUserIDEventID(ctx, m.Attributes["UserID"], &e)
	}

	log.Info().Msg("fetcher service started")
	svc.ready = true

	for svc.ready {
		if err := svc.receiver.Subscription.Receive(svc.context, msgHandler); err != nil {
			log.Error().Caller().Err(err).Msg("failed to receive message")
		}
	}
	// level.Info(l).Log("msg", "service loop ...")
	return nil
}

// Stop instructs the service to stop processing new messages.
func (svc *fetcherService) Stop() {
	log.Info().Msg("fetcher service stopping")
	svc.ready = false
}
