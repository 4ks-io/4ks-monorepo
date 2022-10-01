resource "google_storage_bucket" "test_bucket" {
  name          = "${local.organization}-test-bucket-temp"
  location      = var.region
  force_destroy = true

  uniform_bucket_level_access = true
}

resource "google_storage_bucket_object" "default" {
  name         = "swagger"
# Uncomment and add valid path to an object.
  source       = "../apps/api/docs/swagger.json"
  #content      = "swagger.json"
  #content_type = "text/plain"
  bucket       = google_storage_bucket.test_bucket.name
}