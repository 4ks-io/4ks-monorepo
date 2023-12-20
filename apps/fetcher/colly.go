package fetcher

import (
	"crypto/tls"
	"fmt"
	"net/http"
	"time"

	"github.com/gocolly/colly/v2"
	// "github.com/gocolly/colly/v2/debug"
)

func initCollector(domain string, verbose bool) *colly.Collector {
	// Instantiate default collector
	var c *colly.Collector

	if verbose {
		c = colly.NewCollector(
			colly.AllowedDomains(domain),
			// colly.Debugger(&debug.LogDebugger{}),
		)
	} else {
		c = colly.NewCollector(
			colly.AllowedDomains(domain),
		)
	}

	c.Limit(&colly.LimitRule{
		// DomainGlob:  "*httpbin.*",
		Parallelism: 2,
		Delay:       5 * time.Second,
		// RandomDelay: 5 * time.Second,
	})

	// InsecureSkipVerify to ignore self-signed or expired SSL certificates
	c.WithTransport(&http.Transport{
		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	})

	// Set error handler
	c.OnError(func(r *colly.Response, err error) {
		fmt.Println("Request URL:", r.Request.URL, "failed with response:", r, "\nError:", err)
	})

	return c
}
