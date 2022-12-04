package function

import "time"

// StorageObjectData contains metadata of the Cloud Storage object.
// https://stackoverflow.com/questions/65031928/how-to-upload-a-resized-image-in-google-cloud-storage
type StorageObjectData struct {
	Bucket         string    `json:"bucket,omitempty"`
	Name           string    `json:"name,omitempty"`
	Metageneration int64     `json:"metageneration,string,omitempty"`
	TimeCreated    time.Time `json:"timeCreated,omitempty"`
	Updated        time.Time `json:"updated,omitempty"`
}

type FileProps struct {
	Extension string
	Basename  string
}
