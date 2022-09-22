resource "google_storage_bucket" "test_bucket" {
  name          = "${local.organization}-test-bucket-temp"
  location      = var.region
  force_destroy = true

  uniform_bucket_level_access = true
}