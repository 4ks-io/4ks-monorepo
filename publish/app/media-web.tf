
resource "google_storage_bucket" "web" {
  name          = "web.${local.web_domain}"
  location      = "us"
  force_destroy = true

  uniform_bucket_level_access = true

  website {
    main_page_suffix = "index.html"
    not_found_page   = "index.html"
  }

  cors {
    origin          = ["*"]
    method          = ["GET"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}

resource "google_storage_bucket_iam_member" "web_viewer" {
  bucket = google_storage_bucket.web.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

resource "google_compute_backend_bucket" "web" {
  name        = "web-backend"
  description = "web deploy"
  bucket_name = google_storage_bucket.web.name
  enable_cdn  = true
}
