package pubsub

import (
	"context"

	"cloud.google.com/go/pubsub"
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

func ConnectTopic(ctx context.Context, c *pubsub.Client, o PubsubOpts) (*pubsub.Topic, error) {
	t := c.Topic(o.TopicID)

	exist, err := t.Exists(ctx)
	if err != nil {
		return t, err
	}
	if !exist {
		// Create topic if it does not exist
		t, err = c.CreateTopic(ctx, o.TopicID)
		if err != nil { // && err != pubsub.Err
			return t, err
		}
	}

	return t, nil
}

func SubscribeTopic(ctx context.Context, c *pubsub.Client, o PubsubOpts, t *pubsub.Topic) (*pubsub.Subscription, error) {
	s := c.Subscription(o.SubscriptionID)

	ok, err := s.Exists(ctx)
	if err != nil {
		return s, err
	}

	if !ok {
		s, err = c.CreateSubscription(ctx, o.SubscriptionID,
			pubsub.SubscriptionConfig{Topic: t},
		)
		if err != nil {
			return s, err
		}

	}

	return s, nil
}
