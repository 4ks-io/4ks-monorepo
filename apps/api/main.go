package main

import (
	"context"
	"log"

	// texporter "github.com/GoogleCloudPlatform/opentelemetry-operations-go/exporter/trace"

	router "4ks/apps/api/router"
	utils "4ks/apps/api/utils"
	tracing "4ks/libs/go/tracer"
)

// @title 4ks API
// @version 1.0
// @description This is the 4ks api

// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name Authorization

// @BasePath /api
func main() {
	if value := utils.GetBoolEnv("JAEGER_ENABLED", false); value {
		log.Printf("Jaeger enabled: %t", value)

		tp := tracing.InitTracerProvider()
		defer func() {
			if err := tp.Shutdown(context.Background()); err != nil {
				log.Printf("Error shutting down tracer provider: %v", err)
			}
		}()
	}

	router := router.New()

	addr := "0.0.0.0:" + utils.GetStrEnvVar("PORT", "5000")
	if err := router.Run(addr); err != nil {
		log.Fatalf("http server error: %v", err)
	}
}
