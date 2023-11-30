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

	pb "4ks/libs/go/pubsub"
	"4ks/libs/go/utils"

	"cloud.google.com/go/pubsub"
	"github.com/go-kit/log/level"
)

const (
	exitCodeSuccess   = 0
	exitCodeErr       = 1
	exitCodeInterrupt = 2
)

func parseCLIArgs() (bool, bool) {
	// toggle debug logging
	debug := flag.Bool("debug", false, "Debug logging level")
	silent := flag.Bool("silent", false, "Warning and Errors only")
	flag.Parse()
	return *debug, *silent
}

func main() {
	// args
	debug, silent := parseCLIArgs()
	silent = utils.GetBoolEnv("SILENT", silent)
	debug = utils.GetBoolEnv("DEBUG", debug)
	port := utils.GetStrEnvVar("PORT", "5858")
	debugPort := utils.GetStrEnvVar("DEBUG_PORT", "5888")
	projectID := utils.GetStrEnvVar("PUBSUB_PROJECT_ID", "local-4ks")

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
	level.Info(l).Log("msg", "context and logger created")
	level.Debug(l).Log("msg", "port", "port", port, "debugPort", debugPort)

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

	if os.Getenv("PUBSUB_EMULATOR_HOST") != "" {
		level.Info(l).Log("msg", "connecting to pubsub emulator host", "host", os.Getenv("PUBSUB_EMULATOR_HOST"))
	}

	// Create a Pub/Sub client.
	client, err := pubsub.NewClient(ctx, projectID)
	if err != nil {
		level.Error(l).Log("msg", "failed to create pubsub client", "project", projectID, "error", err)
		panic(err)
	}
	defer client.Close()
	level.Info(l).Log("msg", "pubsub client created", "project", projectID)

	// pubsub request/receiver options
	reqo := pb.PubsubOpts{
		ProjectID:      projectID,
		TopicID:        "fetch-requests",
		SubscriptionID: "fetch-requests",
	}

	// pubsub response/sender options
	reso := pb.PubsubOpts{
		ProjectID: projectID,
		TopicID:   "fetch-responses",
	}

	svc := newFetcherService(ctx, debug, client, reqo, reso)
	level.Info(l).Log("msg", "fetcher service created")

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
		// connect to receiver topic
		t := pb.ConnectTopic(ctx, l, client, reqo)
		startDebugWebServer(ctx, svc, exit, debugPort, t)
	}
	level.Info(l).Log("exit", <-exit)
}

// PrintStruct prints a struct as json
func PrintStruct(t interface{}) {
	j, _ := json.MarshalIndent(t, "", "  ")
	fmt.Println(string(j))
}
