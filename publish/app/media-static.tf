
resource "google_storage_bucket" "media_static" {
  name          = "static.${local.web_domain}"
  location      = "us"
  force_destroy = true

  uniform_bucket_level_access = true

  cors {
    # origin          = ["https://static.${local.web_domain}"]
    # origin          = ["https:/${local.web_domain}/"]
    origin          = ["*"]
    method          = ["GET"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}


resource "google_storage_bucket_iam_member" "media_static_viewer" {
  bucket = google_storage_bucket.media_static.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}


resource "google_storage_bucket_object" "logo" {
  name   = "logo.svg"
  source = "./static/logo.svg"
  bucket = google_storage_bucket.media_static.name
}