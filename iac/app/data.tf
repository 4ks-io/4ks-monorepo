data "google_storage_bucket" "media_upload" {
  name = "${local.org}-${local.stage}-media-upload-deploy"
}

data "google_storage_bucket" "media_static" {
  name = "static.${local.web_domain}"
}

data "google_storage_bucket" "media_write" {
  name = "media-write.${local.web_domain}"
}

data "google_storage_bucket" "media_read" {
  name = "media-read.${local.web_domain}"
}

data "google_service_account" "media_upload" {
  account_id = "media-upload-sa"
}

data "google_compute_backend_bucket" "media_static" {
  name = "${local.project}-static-backend"
}

# secrets

data "google_secret_manager_secret_version" "api_fetcher_psk" {
  secret = "api-fetcher-psk"
}