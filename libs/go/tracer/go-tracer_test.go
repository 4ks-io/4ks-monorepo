package tracing

import (
	"testing"
)

func TestInitTracerProvider(t *testing.T) {
	result := InitTracerProvider()
	if result == nil {
		t.Error("Expected a tracer provider instance")
	}
}

func TestNewTracer(t *testing.T) {
	result := NewTracer("my-tracer")
	if result == nil {
		t.Error("Expected a new tracer instance")
	}
}
