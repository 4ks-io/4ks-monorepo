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

const (
	exitCodeSuccess   = 0
	exitCodeErr       = 1
	exitCodeInterrupt = 2
)

func parseCLIArgs() (bool, bool, string) {
	// toggle debug logging
	debug := flag.Bool("debug", false, "Debug logging level")
	silent := flag.Bool("silent", false, "Warning and Errors only")

	// port to listen on
	port := flag.String("port", "5858", "Port to listen on")
	flag.Parse()

	return *debug, *silent, *port
}

func main() {
	// args
	debug, silent, port := parseCLIArgs()

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

	svc := newFetcherService(ctx, debug)
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
		case <-ctx.Done():
		}
		<-sig // second signal, hard exit
		os.Exit(exitCodeInterrupt)
	}()

	startWebServer(ctx, svc, exit, port)
	level.Info(l).Log("exit", <-exit)
}

// PrintStruct prints a struct as json
func PrintStruct(t interface{}) {
	j, _ := json.MarshalIndent(t, "", "  ")
	fmt.Println(string(j))
}
