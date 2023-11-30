package models

// FetcherRequest is a struct to hold the fetcher request data
type FetcherRequest struct {
	URL    string `json:"url"`
	UserID string `json:"userId"`
}
