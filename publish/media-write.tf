resource "google_storage_bucket" "media_write" {
  name          = "media-write.${local.domain}"
  location      = "us"
  force_destroy = true

  uniform_bucket_level_access = false

  cors {
    # origin          = ["https://media-write.${local.domain}", "https:/${local.domain}"]
    origin          = ["*"]
    method          = ["PUT"]
    response_header = ["*"]
    max_age_seconds = 3600
  }

  lifecycle_rule {
    condition {
      age = 3
    }
    action {
      type = "Delete"
    }
  }
}
