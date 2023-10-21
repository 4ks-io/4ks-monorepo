// package main is the entrypoint for the api
package main

import (
	"context"
	"os"
	"strings"

	controllers "4ks/apps/api/controllers"
	middleware "4ks/apps/api/middleware"
	utils "4ks/apps/api/utils"
	tracing "4ks/libs/go/tracer"

	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
	ginprometheus "github.com/zsais/go-gin-prometheus"
)

// Controllers contains the controllers
type Controllers struct {
	User   controllers.UserController
	Recipe controllers.RecipeController
	Search controllers.SearchController
	System controllers.SystemController
}

// @title 4ks API
// @version 1.0
// @description This is the 4ks api

// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name Authorization

// @BasePath /api
func main() {
	isDebug := utils.GetStrEnvVar("GIN_MODE", "release") == "debug"

	// jaeger
	if value := utils.GetBoolEnv("JAEGER_ENABLED", false); value {
		log.Info().Caller().Bool("enabled", value).Msg("Jaeger")
		tp := tracing.InitTracerProvider()
		defer func() {
			if err := tp.Shutdown(context.Background()); err != nil {
				log.Error().Caller().Err(err).Msg("Error shutting down tracer provider")
			}
		}()
	}

	// controllers
	c := &Controllers{
		System: controllers.NewSystemController(),
		Recipe: controllers.NewRecipeController(),
		User:   controllers.NewUserController(),
		Search: controllers.NewSearchController(),
	}

	// gin and middleware
	r := gin.New()
	r.Use(gin.Recovery())
	r.SetTrustedProxies(nil)
	r.Use(middleware.ErrorHandler)
	r.Use(middleware.CorsMiddleware())
	if isDebug {
		r.Use(middleware.DefaultStructuredLogger())
	}

	// metrics
	prom := ginprometheus.NewPrometheus("gin")
	prom.Use(r)

	o := &RouteOpts{
		SwaggerEnabled: utils.GetBoolEnv("SWAGGER_ENABLED", false),
		SwaggerPrefix:  utils.GetStrEnvVar("SWAGGER_URL_PREFIX", ""),
		Debug:          utils.GetBoolEnv("IO_4KS_DEVING", false),
		Version:        getAPIVersion(),
	}

	AppendRoutes(r, c, o)

	addr := "0.0.0.0:" + utils.GetStrEnvVar("PORT", "5000")
	if err := r.Run(addr); err != nil {
		log.Error().Caller().Err(err).Msg("Error starting http server")
		panic(err)
	}
}

// getAPIVersion returns the api version stored in the VERSION file
func getAPIVersion() string {
	version := "0.0.0"
	if os.Getenv("VERSION_FILE_PATH") != "" {
		path := utils.GetStrEnvVar("VERSION_FILE_PATH", "/VERSION")
		v, err := os.ReadFile(path)
		if err != nil {
			panic(err)
		}
		version = strings.TrimSuffix(string(v), "\n")
	}
	return version
}
