package main

import (
	"context"
	"fmt"
	"net/http"
	"net/http/httputil"
	"os"

	"github.com/go-kit/log"
	"github.com/go-kit/log/level"
)

type ctxDebug struct{}
type ctxSilent struct{}
type ctxLogger struct{}

// contextWithDebug adds debug flag to context
func contextWithDebug(ctx context.Context, d bool) context.Context {
	return context.WithValue(ctx, ctxDebug{}, d)
}

func debugFromContext(ctx context.Context) bool {
	if d, ok := ctx.Value(ctxDebug{}).(bool); ok {
		return d
	}
	return false
}

// contextWithSilent adds silent flag to context
func contextWithSilent(ctx context.Context, s bool) context.Context {
	return context.WithValue(ctx, ctxSilent{}, s)
}

func silentFromContext(ctx context.Context) bool {
	if s, ok := ctx.Value(ctxSilent{}).(bool); ok {
		return s
	}
	return false
}

func newLogger(logLevel string) *log.Logger {
	var logger log.Logger
	{
		// logger = log.NewJSONLogger(log.NewSyncWriter(os.Stderr))
		logger = log.NewLogfmtLogger(log.NewSyncWriter(os.Stderr))
		if logLevel == "debug" {
			logger = level.NewFilter(logger, level.AllowDebug())
		}
		logger = log.With(logger, "ts", log.DefaultTimestampUTC, "caller", log.DefaultCaller)
	}
	return &logger
}

// contextWithLogger adds logger to context
func contextWithLogger(ctx context.Context, l *log.Logger) context.Context {
	return context.WithValue(ctx, ctxLogger{}, l)
}

func loggerFromContext(ctx context.Context) log.Logger {
	if l, ok := ctx.Value(ctxLogger{}).(*log.Logger); ok {
		return *l
	}

	w := log.NewSyncWriter(os.Stderr)
	logger := log.NewLogfmtLogger(w)
	return logger
}

// https://www.jvt.me/posts/2023/03/11/go-debug-http/

type loggingTransport struct{}

func (s *loggingTransport) RoundTrip(r *http.Request) (*http.Response, error) {
	bytes, _ := httputil.DumpRequestOut(r, true)

	resp, err := http.DefaultTransport.RoundTrip(r)
	// err is returned after dumping the response

	respBytes, _ := httputil.DumpResponse(resp, true)
	bytes = append(bytes, respBytes...)

	fmt.Printf("%s\n", bytes)

	return resp, err
}
