package tracing

import (
	"log"

	// texporter "github.com/GoogleCloudPlatform/opentelemetry-operations-go/exporter/trace"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/trace"

	// "go.opentelemetry.io/otel/attribute"
	stdout "go.opentelemetry.io/otel/exporters/stdout/stdouttrace"
	"go.opentelemetry.io/otel/propagation"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
)

// const (
// 	service     = "api"
// 	environment = "local"
// 	port
// )

func InitTracerProvider() *sdktrace.TracerProvider {
	// projectID := os.Getenv("GOOGLE_CLOUD_PROJECT")
	// googleExporter, err := texporter.New(texporter.WithProjectID(projectID))
	exporter, err := stdout.New(stdout.WithPrettyPrint())
	if err != nil {
		log.Fatal(err)
	}

	// r, err := resource.Merge(
	// 	resource.Default(),
	// 	resource.NewWithAttributes(semconv.SchemaURL, semconv.ServiceNameKey.String("ExampleService")),
	// )
	// if err != nil {
	// 	panic(err)
	// }

	tp := sdktrace.NewTracerProvider(
		sdktrace.WithSampler(sdktrace.AlwaysSample()),
		sdktrace.WithBatcher(exporter),
		// sdktrace.WithResource(resource.NewWithAttributes(
		// 	semconv.SchemaURL,
		// 	semconv.ServiceNameKey.String(service),
		// 	attribute.String("environment", environment),
		// )),
	)

	otel.SetTracerProvider(tp)
	otel.SetTextMapPropagator(propagation.NewCompositeTextMapPropagator(propagation.TraceContext{}, propagation.Baggage{}))
	return tp
}

func NewTracer(tracerName string) trace.Tracer {
	return otel.Tracer(tracerName)
}
