package models

// FetcherRequest is a struct to hold the fetcher request data
type FetcherRequest struct {
	URL    string `json:"url"`
	UserID string `json:"userId"`
}

type FetcherResponse struct {
	Name         string   `json:"name"`
	Link         string   `json:"link"`
	Instructions []string `json:"instructions"`
	Ingredients  []string `json:"ingredients"`
}
