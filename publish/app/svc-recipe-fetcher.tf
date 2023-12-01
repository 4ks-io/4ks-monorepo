
resource "google_service_account" "fetcher" {
  account_id   = "cloud-run-fetcher-sa"
  display_name = "Cloud Run Recipe Fetcher"
  description  = "Identity used by the Cloud Run Recipe Fetcher service"
}

resource "google_project_iam_member" "service_agent" {
  project = local.project
  role    = "roles/appengine.serviceAgent"
  member  = "serviceAccount:${google_service_account.fetcher.email}"
}

# resource "google_project_iam_member" "datastore_user" {
#   project = local.project
#   role    = "roles/datastore.user"
#   member  = "serviceAccount:${google_service_account.fetcher.email}"
# }

# resource "google_project_iam_member" "firestore_service_agent" {
#   project = local.project
#   role    = "roles/firestore.serviceAgent"
#   member  = "serviceAccount:${google_service_account.fetcher.email}"
# }

resource "google_project_iam_member" "pubsub_service_agent" {
  project = local.project
  role    = "roles/pubsub.editor"
  member  = "serviceAccount:${google_service_account.fetcher.email}"
}

resource "google_cloud_run_v2_service" "fetcher" {
  name     = "fetcher"
  location = var.region

  template {
    metadata{
      annotations = {
        "autoscaling.knative.dev/minScale" = "1"
        "autoscaling.knative.dev/maxScale" = "10"
      }
    }
    spec {
      service_account_name = google_service_account.fetcher.email
      containers {
        image = "${local.container_registry}/recipe-fetcher/app:${var.api_build_number}"
        ports {
          container_port = 5000
        }
        env {
          name  = "PORT"
          value = "5000"
        }
        env {
          name  = "PUBSUB_PROJECT_ID"
          value = "${local.stage}-${local.org}"
        }

      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

