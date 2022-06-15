package main

import (
	"context"
	"log"

	ginprometheus "github.com/zsais/go-gin-prometheus"

	router "4ks/apps/api/router"
	utils "4ks/apps/api/utils"
	tracing "4ks/libs/go/tracer"
)

// @title 4ks API
// @version 1.0
// @description This is the 4ks api

// @host local.4ks.io
// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name Authorization

// @BasePath /api
func main() {
	tp := tracing.InitTracerProvider()
	defer func() {
		if err := tp.Shutdown(context.Background()); err != nil {
			log.Printf("Error shutting down tracer provider: %v", err)
		}
	}()

	router := router.New()

	prom := ginprometheus.NewPrometheus("gin")
	prom.Use(router)

	addr := "0.0.0.0:" + utils.GetEnvVar("PORT", "5000")
	if err := router.Run(addr); err != nil {
		log.Fatalf("http server error: %v", err)
	}
}
