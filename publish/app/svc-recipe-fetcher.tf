
resource "google_service_account" "fetcher" {
  account_id   = "cloud-run-fetcher-sa"
  display_name = "Cloud Run Recipe Fetcher"
  description  = "Identity used by the Cloud Run Recipe Fetcher service"
}

resource "google_project_iam_member" "fetcher_service_agent" {
  project = local.project
  role    = "roles/appengine.serviceAgent"
  member  = "serviceAccount:${google_service_account.fetcher.email}"
}

# resource "google_project_iam_member" "fetcher_datastore_user" {
#   project = local.project
#   role    = "roles/datastore.user"
#   member  = "serviceAccount:${google_service_account.fetcher.email}"
# }

# resource "google_project_iam_member" "fetcher_firestore_service_agent" {
#   project = local.project
#   role    = "roles/firestore.serviceAgent"
#   member  = "serviceAccount:${google_service_account.fetcher.email}"
# }

resource "google_project_iam_member" "fetcher_pubsub_service_agent" {
  project = local.project
  role    = "roles/pubsub.editor"
  member  = "serviceAccount:${google_service_account.fetcher.email}"
}

resource "google_cloud_run_v2_service" "fetcher" {
  name     = "fetcher"
  location = var.region

  template {
    scaling {
      min_instance_count = 1
      max_instance_count = 2
    }

    service_account = google_service_account.fetcher.email
    containers {
      image = "${local.container_registry}/recipe-fetcher/app:${var.fetcher_build_number}"

      resources {
        cpu_idle = true
        limits = {
          cpu    = "1000m"
          memory = "128Mi"
        }
      }

      ports {
        container_port = 5000
      }
      env {
        name  = "PUBSUB_PROJECT_ID"
        value = "${local.stage}-${local.org}"
      }

    }
  }

  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }
}

