// package main is the entrypoint for the fetcher app
package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"github.com/go-kit/log/level"
)

func main() {
	// flags
	debug := flag.Bool("d", false, "Enable debugging")
	silent := flag.Bool("s", false, "Warning and Errors only")
	target := flag.String("t", "", "Web target to scrape")
	flag.Parse()

	// set log level
	if *silent && *debug {
		panic("Cannot use both silent and debug flags")
	}
	logLevel := "info"
	if *debug {
		logLevel = "debug"
	} else if *silent {
		logLevel = "warn"
	}

	// context and logger
	ctx := context.Background()
	ctx = contextWithLogger(ctx, newLogger(logLevel))
	l := loggerFromContext(ctx)

	// Channel to listen for interrupt signals
	exit := make(chan os.Signal, 1)
	signal.Notify(exit, syscall.SIGINT, syscall.SIGTERM)
	// Channel to listen for completion
	done := make(chan bool)

	s := NewFetcherService(ctx, *debug)

	go func() {
		if err := s.Visit(*target); err != nil {
			level.Error(l).Log("msg", "failed to fetch", "target", *target)
		}

		// level.Info(l).Log("title", recipe.Title)
		done <- true
	}()

	select {
	case <-exit:
		fmt.Println("\nReceived an interrupt. Waiting for goroutine to finish...")
		<-done
		fmt.Println("Goroutine terminated.")
	case <-done:
		fmt.Println("Goroutine completed successfully.")
	}
}

func PrintStruct(t interface{}) {
	j, _ := json.MarshalIndent(t, "", "  ")
	fmt.Println(string(j))
}
