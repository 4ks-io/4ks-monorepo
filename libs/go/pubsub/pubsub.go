package pubsub

import (
	"context"

	"cloud.google.com/go/pubsub"
	"github.com/go-kit/log"
	"github.com/go-kit/log/level"
)

type PubsubOpts struct {
	ProjectID      string
	TopicID        string
	SubscriptionID string
}

type PubSubConnection struct {
	ProjectID      string
	TopicID        string
	Topic          *pubsub.Topic
	SubscriptionID string
	Subscription   *pubsub.Subscription
}

func ConnectTopic(ctx context.Context, l log.Logger, c *pubsub.Client, o PubsubOpts) *pubsub.Topic {
	t := c.Topic(o.TopicID)

	exist, err := t.Exists(ctx)
	if err != nil {
		level.Error(l).Log("msg", "failed to check if pubsub client exist", "topicID", o.TopicID, "error", err)
		panic(err)
	}
	if !exist {
		// Create topic if it does not exist
		t, err = c.CreateTopic(ctx, o.TopicID)
		if err != nil { // && err != pubsub.Err
			level.Error(l).Log("msg", "failed to create pubsub topic", "topicID", o.TopicID, "error", err)
			panic(err)
		}
		level.Info(l).Log("msg", "pubsub topic created", "topic", o.TopicID)

	}
	level.Info(l).Log("msg", "pubsub topic connection established", "project", o.ProjectID, "topic", o.TopicID)

	return t
}

func SubscribeTopic(ctx context.Context, l log.Logger, c *pubsub.Client, o PubsubOpts, t *pubsub.Topic) *pubsub.Subscription {
	s := c.Subscription(o.SubscriptionID)

	ok, err := s.Exists(ctx)
	if err != nil {
		level.Error(l).Log("msg", "failed to check if pubsub subscription exist", "project", o.ProjectID, "topic", o.TopicID, "subscripion", o.SubscriptionID, "error", err)
		panic(err)
	}

	if !ok {
		s, err = c.CreateSubscription(ctx, o.SubscriptionID,
			pubsub.SubscriptionConfig{Topic: t},
		)
		if err != nil {
			level.Error(l).Log("msg", "failed to create pubsub subscription", "project", o.ProjectID, "topic", o.TopicID, "subscripion", o.SubscriptionID, "error", err)
			panic(err)
		}
		level.Info(l).Log("msg", "pubsub subscription created", "project", o.ProjectID, "topic", o.TopicID, "subscripion", o.SubscriptionID)

	}
	level.Info(l).Log("msg", "pubsub subscription established", "project", o.ProjectID, "topic", o.TopicID, "subscripion", o.SubscriptionID)

	return s
}
