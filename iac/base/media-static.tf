
resource "google_storage_bucket" "media_static" {
  name          = "static.${local.web_domain}"
  location      = "us"
  force_destroy = true

  uniform_bucket_level_access = true

  cors {
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

resource "google_compute_backend_bucket" "media_static" {
  name        = "${local.project}-static-backend"
  bucket_name = google_storage_bucket.media_static.name
  enable_cdn  = false // global: true if network_tier is PREMIUM
}

## logo

resource "google_storage_bucket_object" "logo_svg" {
  name   = "static/logo.svg"
  source = "./static/logo.svg"
  bucket = google_storage_bucket.media_static.name
}

resource "google_storage_bucket_object" "logo_png" {
  name   = "static/logo.png"
  source = "./static/logo.png"
  bucket = google_storage_bucket.media_static.name
}

resource "google_storage_bucket_object" "fallback_image" {
  count = 28
  name   = "static/fallback/f${count.index}.jpg"
  source = "./static/fallback/f${count.index}.jpg"
  bucket = google_storage_bucket.media_static.name
}