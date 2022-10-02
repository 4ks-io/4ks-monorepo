package tracing

import (
	"log"
	"os"
	"strings"

	texporter "github.com/GoogleCloudPlatform/opentelemetry-operations-go/exporter/trace"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/jaeger"
	semconv "go.opentelemetry.io/otel/semconv/v1.4.0"
	"go.opentelemetry.io/otel/trace"

	"4ks/apps/api/utils"

	// "go.opentelemetry.io/otel/attribute"

	stdout "go.opentelemetry.io/otel/exporters/stdout/stdouttrace"
	"go.opentelemetry.io/otel/propagation"
	resource "go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
)

const (
	service = "4ks-api"

// 	environment = "local"
// 	port
)

func InitTracerProvider() *sdktrace.TracerProvider {
	var exporter sdktrace.SpanExporter
	var err error

	exporterType := strings.ToUpper(utils.GetStrEnvVar("EXPORTER_TYPE", "CONSOLE"))
	switch exporterType {
	case "GOOGLE":
		projectID := os.Getenv("GOOGLE_CLOUD_PROJECT")
		exporter, err = texporter.New(texporter.WithProjectID(projectID))
	case "JAEGER":
		jaegerEndpoint := utils.GetStrEnvVar("OTEL_EXPORTER_JAEGER_ENDPOINT", "http://jaeger:14268/api/traces")
		exporter, err = jaeger.New(jaeger.WithCollectorEndpoint(jaeger.WithEndpoint(jaegerEndpoint)))
	case "CONSOLE":
		exporter, err = stdout.New(stdout.WithPrettyPrint())
	default:
		exporter, err = stdout.New(stdout.WithPrettyPrint())
	}

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
		sdktrace.WithResource(resource.NewWithAttributes(
			semconv.SchemaURL,
			semconv.ServiceNameKey.String(service),
		)),
	)

	otel.SetTracerProvider(tp)
	otel.SetTextMapPropagator(propagation.NewCompositeTextMapPropagator(propagation.TraceContext{}, propagation.Baggage{}))
	return tp
}

func NewTracer(tracerName string) trace.Tracer {
	return otel.Tracer(tracerName)
}
