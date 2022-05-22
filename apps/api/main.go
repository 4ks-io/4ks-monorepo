package main

import (
	"github.com/gin-gonic/gin"
	ginprometheus "github.com/zsais/go-gin-prometheus"

	// texporter "github.com/GoogleCloudPlatform/opentelemetry-operations-go/exporter/trace"
	"go.opentelemetry.io/contrib/instrumentation/github.com/gin-gonic/gin/otelgin"

	tracing "4ks/libs/go/tracer"

	utils "4ks/apps/api/utils"
)

var tracer = tracing.NewTracer("gin-server")

func main() {
	// tp := tracing.InitTracerProvider()
	// defer func() {
	// 	if err := tp.Shutdown(context.Background()); err != nil {
	// 		log.Printf("Error shutting down tracer provider: %v", err)
	// 	}
	// }()

	router := gin.Default()
	prom := ginprometheus.NewPrometheus("gin")
	prom.Use(router)

	// Configure Open Telemetry Middleware for Gin
	router.Use(otelgin.Middleware("4ks-api"))

	systemRouter(router)
	usersRouter(router)
	recipesRouter(router)

	router.Run("0.0.0.0:" + utils.GetEnvVar("PORT", "5000"))
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
