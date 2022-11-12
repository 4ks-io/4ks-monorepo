resource "google_storage_bucket" "media_validator" {
  name     = "${local.org}-${var.stage}-media-validator-deploy"
  location = var.region
}

data "archive_file" "media_validator" {
  type        = "zip"
  source_dir  = "${path.module}/../apps/media-validator"
  output_path = "/tmp/media-validator.zip"
}

resource "google_storage_bucket_object" "media_validator_zip" {
  source       = data.archive_file.media_validator.output_path
  content_type = "application/zip"
  name         = "src-${data.archive_file.media_validator.output_md5}.zip"
  bucket       = google_storage_bucket.media_validator.name
}

resource "google_cloudfunctions_function" "function" {
  name                = "media-validator"
  runtime             = "go116"
  available_memory_mb = 128


  source_archive_bucket = google_storage_bucket.media_validator.name
  source_archive_object = google_storage_bucket_object.media_validator_zip.name
  entry_point           = "UploadImage"

  environment_variables = {
    DISTRIBUTION_BUCKET = replace(google_storage_bucket.media_read.url, "gs://", "")
  }

  event_trigger {
    event_type = "google.storage.object.finalize"
    resource   = replace(google_storage_bucket.media_write.url, "gs://", "")
    failure_policy {
      retry = true
    }
  }
}