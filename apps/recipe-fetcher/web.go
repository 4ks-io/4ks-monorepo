package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"cloud.google.com/go/pubsub"
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

func startDebugWebServer(ctx context.Context, svc FetcherService, exit chan error, port string, t *pubsub.Topic) {
	l := loggerFromContext(ctx)

	go func() {
		p := ":" + port
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

			// recipe, err := svc.Visit(data.URL)

			// var buf bytes.Buffer
			// encoder := gob.NewEncoder(&buf)
			// err = encoder.Encode(data)
			// if err != nil {
			// 	fmt.Println("Error encoding struct:", err)
			// 	return
			// }

			// encodedBytes := buf.Bytes()
			// _ = t.Publish(ctx, &pubsub.Message{Data: encodedBytes})
			result := t.Publish(ctx, &pubsub.Message{
				Data: []byte(data.URL),
				Attributes: map[string]string{
						"userID": data.UserID,
				},
			})
			// Block until the result is returned and a server-generated
			// ID is returned for the published message.
			id, err := result.Get(ctx)
			if err != nil {
				level.Error(l).Log("msg", "Failed to publish message", "error", err)
			}
			// fmt.Fprintf(w, "Published message with custom attributes; msg ID: %v\n", id)
			// return nil

			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(id)

		})

		level.Info(l).Log("msg", fmt.Sprintf("Serving '/test' on port %s", p))

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
