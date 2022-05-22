package main

import (
	"context"
	"log"

	ginprometheus "github.com/zsais/go-gin-prometheus"

	// texporter "github.com/GoogleCloudPlatform/opentelemetry-operations-go/exporter/trace"

	"4ks/apps/api/authenticator"
	router "4ks/apps/api/router"
	utils "4ks/apps/api/utils"
	tracing "4ks/libs/go/tracer"
)

// var tracer = tracing.NewTracer("gin-server")

func main() {
	tp := tracing.InitTracerProvider()
	defer func() {
		if err := tp.Shutdown(context.Background()); err != nil {
			log.Printf("Error shutting down tracer provider: %v", err)
		}
	}()

	auth, err := authenticator.New()
	if err != nil {
		log.Fatalf("Failed to initialize the authenticator: %v", err)
	}

	router := router.New(auth)

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


// func initTracer() *sdktrace.TracerProvider {
// 	// projectID := os.Getenv("GOOGLE_CLOUD_PROJECT")
// 	// googleExporter, err := texporter.New(texporter.WithProjectID(projectID))
// 	exporter, err := stdout.New(stdout.WithPrettyPrint())
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	tp := sdktrace.NewTracerProvider(
// 		sdktrace.WithSampler(sdktrace.AlwaysSample()),
// 		sdktrace.WithBatcher(exporter),
// 	)
// 	otel.SetTracerProvider(tp)
// 	otel.SetTextMapPropagator(propagation.NewCompositeTextMapPropagator(propagation.TraceContext{}, propagation.Baggage{}))
// 	return tp
// }
