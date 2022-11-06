package main

import (
	"context"
	"log"

	ginprometheus "github.com/zsais/go-gin-prometheus"

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

	prom := ginprometheus.NewPrometheus("gin")
	prom.Use(router)

	// Configure Open Telemetry Middleware for Gin
	// moved into groups to avoid logging system routes (eg. /ready)
	// router.Use(otelgin.Middleware("4ks-api"))

	addr := "0.0.0.0:" + utils.GetStrEnvVar("PORT", "5000")
	if err := router.Run(addr); err != nil {
		log.Fatalf("http server error: %v", err)
	}
}
