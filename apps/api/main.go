package main

import (
	"context"
	"log"

	"github.com/gin-gonic/gin"

	// texporter "github.com/GoogleCloudPlatform/opentelemetry-operations-go/exporter/trace"
	"go.opentelemetry.io/contrib/instrumentation/github.com/gin-gonic/gin/otelgin"

	tracing "4ks/libs/go/tracer"
)

var tracer = tracing.NewTracer("gin-server")

func main() {
	tp := tracing.InitTracerProvider()
	defer func() {
		if err := tp.Shutdown(context.Background()); err != nil {
			log.Printf("Error shutting down tracer provider: %v", err)
		}
	}()

	r := gin.Default()

	// Configure Open Telemetry Middleware for Gin
	r.Use(otelgin.Middleware("4ks-api"))

	r.GET("/recipes", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Yolo2",
		})
	})
	r.POST("/recipes", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong222",
		})
	})
	r.GET("/recipes/:recipeId", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "yolo22",
		})
	})
	r.PUT("/recipes/:recipeId", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong222",
		})
	})
	r.POST("/recipes/:recipeId/star", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong2222",
		})
	})
	r.POST("/recipes/:recipeId/fork", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong222",
		})
	})
	r.GET("/recipes/:recipeId/revisions", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong222",
		})
	})
	r.GET("/recipes/:recipeId/revisions/:revisionId", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong222",
		})
	})

	r.GET("/ready", func(c *gin.Context) {
		_, span := tracer.Start(c.Request.Context(), "DoSomething")
		log.Println("Yolo")
		span.End()
		c.JSON(200, gin.H{
			"message": "pong222",
		})
	})
	r.Run("0.0.0.0:5000") // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
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
