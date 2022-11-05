resource "google_storage_bucket" "media_read" {
  name          = "media-read.${local.domain}"
  location      = "us"
  force_destroy = true

  uniform_bucket_level_access = false

  cors {
    # origin          = ["https://media-read.${local.domain}", "https:/${local.domain}"]
    origin          = ["*"]
    method          = ["PUT"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}
