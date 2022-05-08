package main

import (
	"context"
	"log"

	"github.com/gin-gonic/gin"
	ginprometheus "github.com/zsais/go-gin-prometheus"

	// texporter "github.com/GoogleCloudPlatform/opentelemetry-operations-go/exporter/trace"
	"go.opentelemetry.io/contrib/instrumentation/github.com/gin-gonic/gin/otelgin"

	tracing "4ks/libs/go/tracer"

	controllers "4ks/apps/api/controllers"
)

var tracer = tracing.NewTracer("gin-server")

func main() {
	tp := tracing.InitTracerProvider()
	defer func() {
		if err := tp.Shutdown(context.Background()); err != nil {
			log.Printf("Error shutting down tracer provider: %v", err)
		}
	}()

	uc := controllers.NewUserController()
	rc := controllers.NewRecipeController()

	r := gin.Default()
	p := ginprometheus.NewPrometheus("gin")
	p.Use(r)

	// Configure Open Telemetry Middleware for Gin
	r.Use(otelgin.Middleware("4ks-api"))

	r.GET("/version", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"version": "0.0.1",
		})
	})

	v1 := r.Group("/api/v1")
	{
		users := v1.Group("/users")
		{
			users.POST("", uc.CreateUser)
			users.GET(":id", uc.GetUser)
			users.PATCH(":id", uc.UpdateUser)
		}

		recipes := v1.Group("/recipes")
		{
			recipes.POST("", rc.CreateRecipe)
			recipes.GET(":id", rc.GetRecipe)
			recipes.PATCH(":id", rc.UpdateRecipe)
			recipes.POST(":id/star", rc.StarRecipe)
			recipes.POST(":id/fork", rc.ForkRecipe)
			recipes.GET(":id/revisions", rc.GetRecipeRevisions)
			recipes.GET(":id/revisions/:revisionId", rc.GetRecipeRevision)
		}
	}

	r.GET("/ready", func(c *gin.Context) {
		_, span := tracer.Start(c.Request.Context(), "DoSomething")
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
