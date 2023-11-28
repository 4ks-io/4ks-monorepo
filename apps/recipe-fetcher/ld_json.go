package main

// this was created while experimenting with json-ld parsing. In the end it wasn't used. KEep it here for reference.

import (
	"net/http"

	"github.com/piprate/json-gold/ld"
)

// LdProcessor is a processor for json-ld
type LdProcessor interface {
	Parse(map[string]interface{}) (interface{}, error)
}

type ldProcessor struct {
	proc    *ld.JsonLdProcessor
	options *ld.JsonLdOptions
}

// NewLdProcessor returns a new LdProcessor
func NewLdProcessor(client http.Client) LdProcessor {
	proc := ld.NewJsonLdProcessor()
	options := ld.NewJsonLdOptions("")

	nl := ld.NewDefaultDocumentLoader(&client)
	cdl := ld.NewCachingDocumentLoader(nl)

	// todo: read from env var?
	const f = "./schemaorgcontext-v23.jsonld"
	m := map[string]string{
		"https://schema.org/": f,
		"http://schema.org/":  f,
		"https://schema.org":  f,
		"http://schema.org":   f,
	}

	if err := cdl.PreloadWithMapping(m); err != nil {
		panic(err)
	}

	options.DocumentLoader = cdl

	return &ldProcessor{
		proc:    proc,
		options: options,
	}
}

func (s *ldProcessor) Parse(i map[string]interface{}) (interface{}, error) {
	expanded, err := s.proc.Expand(i, s.options)
	if err != nil {
		return nil, err
	}

	if expanded == nil || len(expanded) != 1 {
		return nil, errNotRecipe
	}

	// ld.PrintDocument("JSON-LD expansion succeeded", expanded)
	return expanded[0], nil
}
