package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/go-kit/log/level"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

type FetcherRequest struct {
	URL    string `json:"url"`
	UserID string `json:"userId"`
}

func startWebServer(ctx context.Context, svc FetcherService, exit chan error, port string) {
	l := loggerFromContext(ctx)
	debug := debugFromContext(ctx)

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
		if debug {
			http.HandleFunc("/test", func(w http.ResponseWriter, r *http.Request) {
				if handleUnexpectedMethod("POST", w, r) {
					return
				}
				// not ready
				if !svc.IsReady() {
					w.WriteHeader(http.StatusInternalServerError)
					_, _ = w.Write([]byte("not ready"))
					return
				}
				// ready

				// Read the body of the request
				body, err := io.ReadAll(r.Body)
				if err != nil {
					http.Error(w, "Error reading request body", http.StatusInternalServerError)
					return
				}
				defer r.Body.Close()

				// Unmarshal the JSON data into the struct
				var data FetcherRequest
				err = json.Unmarshal(body, &data)
				if err != nil {
					http.Error(w, "Error unmarshalling JSON", http.StatusBadRequest)
					return
				}

				recipe, err := svc.Visit(data.URL)

				w.WriteHeader(http.StatusOK)
				json.NewEncoder(w).Encode(recipe)
			})
		}

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
