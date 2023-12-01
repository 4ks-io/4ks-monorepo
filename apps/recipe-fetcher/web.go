package main

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/go-kit/log/level"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

func startWebServer(ctx context.Context, svc FetcherService, exit chan error, port string) {
	l := loggerFromContext(ctx)

	go func() {
		p := ":" + port
		http.Handle("/metrics", promhttp.Handler())
		http.HandleFunc("/ready", func(w http.ResponseWriter, r *http.Request) {
			if handleUnexpectedMethod("GET", w, r) {
				return
			}
			// not ready
			if !svc.IsReady() {
				w.WriteHeader(http.StatusInternalServerError)
				_, _ = w.Write([]byte("not ready"))
				return
			}
			// ready
			w.WriteHeader(http.StatusOK)
			_, _ = w.Write([]byte("ready"))
		})

		level.Info(l).Log("msg", fmt.Sprintf("Serving '/metrics' on port %s", p))
		level.Info(l).Log("msg", fmt.Sprintf("Serving '/ready' on port %s", p))

		server := &http.Server{
			Addr:              p,
			ReadHeaderTimeout: 30 * time.Second,
		}
		exit <- server.ListenAndServe()
	}()
}

func handleUnexpectedMethod(method string, w http.ResponseWriter, r *http.Request) bool {
	if r.Method != method {
		w.WriteHeader(http.StatusMethodNotAllowed)
		_, _ = w.Write([]byte("Invalid request method"))
		return true
	}
	return false
}
