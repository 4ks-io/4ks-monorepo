resource "google_storage_bucket" "test_bucket" {
  # name          = "${local.domain}"
  name          = "${local.organization}-test-bucket"
  location      = var.region
  force_destroy = true

  uniform_bucket_level_access = true
}