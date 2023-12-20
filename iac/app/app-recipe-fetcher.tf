# fetcher pubsub

resource "google_pubsub_topic" "fetcher" {
  name = "fetch-requests"
}

resource "google_pubsub_topic" "fetcher_dead_letter" {
  name = "fetcher-dl"
}

resource "google_pubsub_subscription" "fetcher" {
  name  = "fetcher-sub"
  topic = google_pubsub_topic.fetcher.name

  dead_letter_policy {
    dead_letter_topic     = google_pubsub_topic.fetcher_dead_letter.id
    max_delivery_attempts = 10
  }

  # ack_deadline_seconds = 10
}

resource "google_pubsub_subscription" "fetcher-dl" {
  name  = "fetcher-dl-sub"
  topic = google_pubsub_topic.fetcher_dead_letter.name
}

resource "google_service_account" "fetcher" {
  account_id   = "cloud-run-fetcher-sa"
  display_name = "Cloud Run Recipe Fetcher"
  description  = "Identity used by the Cloud Run Recipe Fetcher service"
}

# resource "google_project_iam_member" "fetcher_service_agent" {
#   project = local.project
#   role    = "roles/appengine.serviceAgent"
#   member  = "serviceAccount:${google_service_account.fetcher.email}"
# }

// allowed to consume messages
resource "google_project_iam_member" "fetcher_pubsub_subscriber" {
  project = local.project
  role    = "roles/pubsub.subscriber"
  member  = "serviceAccount:${google_service_account.fetcher.email}"
}

# allowed to list pubsub topics/subscriptions
resource "google_project_iam_member" "fetcher_pubsub_viewer" {
  project = local.project
  role    = "roles/pubsub.viewer"
  member  = "serviceAccount:${google_service_account.fetcher.email}"
}


resource "google_storage_bucket" "fetcher_deploy" {
  name                        = "func-deploy-fetcher"
  location                    = var.region
  force_destroy               = true
  uniform_bucket_level_access = true
}

data "archive_file" "fetcher" {
  type        = "zip"
  output_path = "/tmp/func-fetcher-source.zip"
  source_dir  = "../apps/fetcher"
  excludes    = ["local.env", "cmd", "cmd/"]
}

resource "google_storage_bucket_object" "fetcher_deploy" {
  name   = "fetcher-${data.archive_file.fetcher.output_sha256}.zip"
  bucket = google_storage_bucket.fetcher_deploy.name
  source = data.archive_file.fetcher.output_path
}

resource "google_cloudfunctions2_function" "fetcher" {
  name        = "fetcher"
  location    = local.region
  description = "fetcher is triggered by a pubsub event and fetches a recipe from a url"
  labels = {
    app = "fetcher"
  }

  build_config {
    runtime     = "go120"
    entry_point = "fetcher"
    source {
      storage_source {
        bucket = google_storage_bucket.fetcher_deploy.name
        object = google_storage_bucket_object.fetcher_deploy.name
      }
    }
  }

  service_config {
    available_memory = "256M"
    timeout_seconds  = 120
    environment_variables = {
      DEBUG             = var.fetcher_debug
      PUBSUB_PROJECT_ID = local.project
      PUBSUB_TOPIC_ID   = "fetcher"
      API_ENDPOINT_URL  = "${output.api_service_url}/api/_fetcher/recipes"
      API_SECRET        = google_secret_manager_secret_version.api_fetcher_psk.secret_data
    }

    # ingress_settings               = "ALLOW_ALL"
    ingress_settings               = "ALLOW_INTERNAL_ONLY"
    all_traffic_on_latest_revision = true
    service_account_email          = google_service_account.fetcher.email
  }

  event_trigger {
    trigger_region = var.region
    event_type     = "google.cloud.pubsub.topic.v1.messagePublished"
    pubsub_topic   = google_pubsub_topic.fetcher.id
    retry_policy   = "RETRY_POLICY_RETRY"
  }
}

output "function_uri" {
  value = google_cloudfunctions2_function.fetcher.service_config[0].uri
}
