package main

import (
	"log"

	ginprometheus "github.com/zsais/go-gin-prometheus"

	// texporter "github.com/GoogleCloudPlatform/opentelemetry-operations-go/exporter/trace"

	router "4ks/apps/api/router"
	utils "4ks/apps/api/utils"
)

// var tracer = tracing.NewTracer("gin-server")

func main() {
	// tp := tracing.InitTracerProvider()
	// defer func() {
	// 	if err := tp.Shutdown(context.Background()); err != nil {
	// 		log.Printf("Error shutting down tracer provider: %v", err)
	// 	}
	// }()

	// auth, err := authenticator.New()
	// if err != nil {
	// 	log.Fatalf("Failed to initialize the authenticator: %v", err)
	// }

	router := router.New()

	prom := ginprometheus.NewPrometheus("gin")
	prom.Use(router)

	// Configure Open Telemetry Middleware for Gin
	// moved into groups to avoid logging system routes (eg. /ready)
	// router.Use(otelgin.Middleware("4ks-api"))

	addr := "0.0.0.0:" + utils.GetEnvVar("PORT", "5000")
	if err := router.Run(addr); err != nil {
		log.Fatalf("http server error: %v", err)
	}
}
