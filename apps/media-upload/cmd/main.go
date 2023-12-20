package main

import (
	"log"
	"os"

	// Blank-import the function package so the init() runs
	_ "4ks.io/media-upload"
	"github.com/GoogleCloudPlatform/functions-framework-go/funcframework"
)

// export FUNCTION_TARGET=UploadImage

func main() {
	port := "8080"
	if envPort := os.Getenv("PORT"); envPort != "" {
		port = envPort
	}
	if err := funcframework.Start(port); err != nil {
		log.Fatalf("funcframework.Start: %v\n", err)
	}
}
