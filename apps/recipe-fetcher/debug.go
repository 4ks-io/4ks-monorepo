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
)

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

			d, err := encodeToBase64(data)
			if err != nil {
				http.Error(w, "Error encoding JSON", http.StatusBadRequest)
				return
			}

			result := t.Publish(ctx, &pubsub.Message{
				Data: []byte(d),
				// Attributes: map[string]string{
				// 	"URL": data.URL,
				// 	"UserID": data.UserID,
				// },
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
