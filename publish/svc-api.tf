resource "google_artifact_registry_repository" "api" {
  repository_id = "api"
  location      = var.region
  description   = "docker/helm repo for api images"
  format        = "docker"
}

resource "google_cloud_run_service" "api" {
  name     = "api"
  location = var.region

  template {
    spec {
      service_account_name = google_service_account.api.email
      containers {
        image = "us-east4-docker.pkg.dev/${var.stage}-${local.org}/api/app:${var.api_build_number}"
        ports {
          container_port = 5000
        }

        env {
          name  = "FIRESTORE_PROJECT_ID"
          value = "${var.stage}-${local.org}"
        }
        env {
          name  = "AUTH0_DOMAIN"
          value = "${local.org}-${var.stage}.us.auth0.com"
        }
        env {
          name  = "AUTH0_AUDIENCE"
          value = local.web_api_url
        }
        env {
          name  = "EXPORTER_TYPE"
          value = "JAEGER"
        }
        env {
          name  = "GIN_MODE"
          value = "release"
        }
        env {
          name  = "JAEGER_ENABLED"
          value = var.feat_api_jaeger_enabled_map[terraform.workspace]
        }
        env {
          name  = "SWAGGER_ENABLED"
          value = var.feat_api_swagger_enabled_map[terraform.workspace]
        }
        env {
          name  = "SWAGGER_URL_PREFIX"
          value = "/api"
        }

      }

    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

resource "google_service_account" "api" {
  account_id   = "cloud-run-api-sa"
  display_name = "Cloud Run API"
  description  = "Identity used by the Cloud Run API service"
}

resource "google_project_iam_custom_role" "api" {
  role_id     = "cloudRunAPI"
  title       = "Cloud Run API"
  description = "Cloud Run API"
  permissions = [
    "iam.serviceAccounts.signBlob",
  ]
}

data "google_iam_policy" "api_invoker" {
  binding {
    role = google_project_iam_custom_role.api.id
    members = [
      "serviceAccount:${google_service_account.api.email}",
    ]
  }
}


resource "google_cloud_run_service_iam_member" "api_anonymous_access" {
  service  = google_cloud_run_service.api.name
  location = google_cloud_run_service.api.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}



resource "google_compute_region_network_endpoint_group" "api_neg" {
  name                  = "${local.project}-api-neg"
  network_endpoint_type = "SERVERLESS"
  region                = var.region
  cloud_run {
    service = google_cloud_run_service.api.name
  }
}

resource "google_compute_backend_service" "api" {
  name = "${local.project}-api-backend"

  protocol    = "HTTP"
  port_name   = "http"
  timeout_sec = 30

  backend {
    group = google_compute_region_network_endpoint_group.api_neg.id
  }
}

output "api_service_url" {
  value = google_cloud_run_service.api.status[0].url
}
