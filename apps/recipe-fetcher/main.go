// package main is the entrypoint for the fetcher app
package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"cloud.google.com/go/pubsub"
	"github.com/go-kit/log/level"
)

const (
	exitCodeSuccess   = 0
	exitCodeErr       = 1
	exitCodeInterrupt = 2
)

func parseCLIArgs() (bool, bool, string, string) {
	// toggle debug logging
	debug := flag.Bool("debug", false, "Debug logging level")
	silent := flag.Bool("silent", false, "Warning and Errors only")

	// port to listen on
	port := flag.String("port", "5858", "Port to listen on")
	debugPort := flag.String("debugPort", "5888", "Debug port to post pubsub request")

	flag.Parse()

	return *debug, *silent, *port, *debugPort
}

func main() {
	// args
	debug, silent, port, debugPort := parseCLIArgs()

	// set log level
	if silent && debug {
		panic("Cannot use both silent and debug flags")
	}
	logLevel := "info"
	if debug {
		logLevel = "debug"
	} else if silent {
		logLevel = "warn"
	}

	// context and logger
	ctx := context.Background()
	ctx = contextWithDebug(ctx, debug)
	ctx = contextWithSilent(ctx, silent)
	ctx = contextWithLogger(ctx, newLogger(logLevel))
	l := loggerFromContext(ctx)
	ctx, cancel := context.WithCancel(ctx)
	defer func() {
		level.Info(l).Log("msg", "context cancelled")
		cancel()
	}()

	// signal handling
	sig := make(chan os.Signal, 1)
	signal.Notify(sig, os.Interrupt)
	defer func() {
		signal.Stop(sig)
		cancel()
	}()

	// interrupt handling
	exit := make(chan error)
	go func() {
		c := make(chan os.Signal, 1)
		signal.Notify(c, syscall.SIGTERM, os.Interrupt)
	}()

	// https://cloud.google.com/go/docs/reference/cloud.google.com/go/pubsub/latest
	// export PUBSUB_EMULATOR_HOST=[::1]:8085
	// export PUBSUB_PROJECT_ID=local-4ks

	// Set PUBSUB_EMULATOR_HOST environment variable.
	err := os.Setenv("PUBSUB_EMULATOR_HOST", "localhost:8085")
	if err != nil {
		panic(err)
	}

	projectID := "local-4ks"

	// Create a Pub/Sub client.
	client, err := pubsub.NewClient(ctx, projectID)
	if err != nil {
		level.Error(l).Log("msg", "failed to create pubsub client", "project", projectID, "error", err)
		panic(err)
	}
	defer client.Close()
	level.Info(l).Log("msg", "pubsub client created", "project", projectID)

	topReqName := "fetch-requests"
	topReq := connectTopic(ctx, client, projectID, topReqName)
	// topres := connectTopic(ctx, client, projectID, "fetch-response")

	subreqID := "fetch-requests"
	var subreq *pubsub.Subscription
	subreq = client.Subscription(subreqID)
	exist, err := subreq.Exists(ctx)
	if err != nil {
		level.Error(l).Log("msg", "failed to check if pubsub subscription exist", "project", projectID, "subscriptionID", "topic", topReqName, subreqID, "error", err)
	}
	if !exist {
		subreq, err = client.CreateSubscription(ctx, subreqID,
			pubsub.SubscriptionConfig{Topic: topReq},
		)
		if err != nil {
			level.Error(l).Log("msg", "failed to create pubsub subscription", "project", projectID, "subscriptionID", "topic", topReqName, subreqID, "error", err)
		}
	}

	svc := newFetcherService(ctx, debug, topReq, subreq)
	go func() {
		if err := svc.Start(); err != nil {
			level.Error(l).Log("msg", "service failure", "error", err)
			os.Exit(exitCodeErr)
		}
		os.Exit(exitCodeSuccess)
	}()

	go func() {
		select {
		case <-sig: // first signal, cancel context
			cancel()
			svc.Stop()
			if err := client.Close(); err != nil {
				log.Fatalf("Failed to close client: %v", err)
			}
		case <-ctx.Done():
		}
		<-sig // second signal, hard exit
		os.Exit(exitCodeInterrupt)
	}()

	startWebServer(ctx, svc, exit, port)
	if debug {
		startDebugWebServer(ctx, svc, exit, debugPort, topReq)
	}
	level.Info(l).Log("exit", <-exit)
}

// PrintStruct prints a struct as json
func PrintStruct(t interface{}) {
	j, _ := json.MarshalIndent(t, "", "  ")
	fmt.Println(string(j))
}

func connectTopic(ctx context.Context, client *pubsub.Client, projectID, topicID string) *pubsub.Topic {
	l := loggerFromContext(ctx)
	t := client.Topic(topicID)

	exist, err := t.Exists(ctx)
	if err != nil {
		level.Error(l).Log("msg", "failed to check if pubsub client exist", "topicID", topicID, "error", err)
	}
	if !exist {
		// Create topic if it does not exist
		t, err = client.CreateTopic(ctx, topicID)
		if err != nil { // && err != pubsub.Err
			level.Error(l).Log("msg", "failed to create pubsub topic", "topicID", topicID, "error", err)
			panic(err)
		}
		level.Info(l).Log("msg", "pubsub topic created", "topic", topicID)
	}
	level.Info(l).Log("msg", "pubsub topic", "project", projectID, "topic", topicID)

	return t
}
