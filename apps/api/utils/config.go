// Package utils provides utility functions for the application
package utils

import (
	"fmt"
	"os"
	"strconv"
)

// SystemFlags is a struct for system flags
type SystemFlags struct {
	Debug         bool
	Development   bool
	JaegerEnabled bool
}

// GetStrEnvVar returns a string from an environment variable
func GetStrEnvVar(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

// GetBoolEnv returns a bool from an environment variable
func GetBoolEnv(key string, fallback bool) bool {
	val := GetStrEnvVar(key, strconv.FormatBool(fallback))
	ret, err := strconv.ParseBool(val)
	if err != nil {
		return fallback
	}
	return ret
}

// GetEnvVarOrPanic returns an environment variable value or exits
func GetEnvVarOrPanic(n string) string {
	v, ok := os.LookupEnv(n)
	if !ok || v == "" {
		panic(fmt.Sprintf("env var %s required", n))
	}
	return v
}
