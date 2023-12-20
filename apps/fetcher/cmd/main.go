// Package main is the main application for the nlp-worker local cmd
package main

import (
	"log"

	_ "4ks.io/fetcher"
	"github.com/GoogleCloudPlatform/functions-framework-go/funcframework"
)

func main() {
	// The server will run on port 5000
	port := "5000"
	if err := funcframework.Start(port); err != nil {
		log.Fatalf("funcframework.Start: %v\n", err)
	}
}
