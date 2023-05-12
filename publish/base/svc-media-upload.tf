resource "google_storage_bucket" "media_upload" {
  name     = "${local.org}-${local.stage}-media-upload-deploy"
  location = var.region
}

# To use GCS CloudEvent triggers, the GCS service account requires the Pub/Sub Publisher(roles/pubsub.publisher) IAM role in the specified project.
# (See https://cloud.google.com/eventarc/docs/run/quickstart-storage#before-you-begin)
resource "google_project_iam_member" "gcs_pubsub_publishing" {
  project = local.project
  role    = "roles/pubsub.publisher"
  member  = "serviceAccount:${data.google_storage_project_service_account.gcs_account.email_address}"
}

resource "google_service_account" "media_upload" {
  account_id   = "media-upload-sa"
  display_name = "Service Account to Create Media upload"
}

# Permissions on the service account used by the function and Eventarc trigger
resource "google_project_iam_member" "invoking" {
  project    = local.project
  role       = "roles/run.invoker"
  member     = "serviceAccount:${google_service_account.media_upload.email}"
  depends_on = [google_project_iam_member.gcs_pubsub_publishing]
}

resource "google_project_iam_member" "event_receiving" {
  project    = local.project
  role       = "roles/eventarc.eventReceiver"
  member     = "serviceAccount:${google_service_account.media_upload.email}"
  depends_on = [google_project_iam_member.invoking]
}

resource "google_project_iam_member" "artifactregistry_reader" {
  project    = local.project
  role       = "roles/artifactregistry.reader"
  member     = "serviceAccount:${google_service_account.media_upload.email}"
  depends_on = [google_project_iam_member.event_receiving]
}

resource "google_project_iam_member" "datastore_reader" {
  project    = local.project
  role       = "roles/datastore.user"
  member     = "serviceAccount:${google_service_account.media_upload.email}"
  depends_on = [google_project_iam_member.artifactregistry_reader]
}

resource "google_project_iam_member" "bucket" {
  project    = local.project
  role       = google_project_iam_custom_role.bucket.name
  member     = "serviceAccount:${google_service_account.media_upload.email}"
  depends_on = [google_project_iam_member.datastore_reader]
}