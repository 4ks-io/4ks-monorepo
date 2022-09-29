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
      containers {
        image = "us-east4-docker.pkg.dev/dev-4ks/api/app:0.0.3"
        ports {
          container_port = 5000
        }

        env {
          name  = "FIRESTORE_PROJECT_ID"
          value = "dev-4ks"
        }
        env {
          name  = "SWAGGER_ENABLED"
          value = "true"
        }
        env {
          name  = "AUTH0_DOMAIN"
          value = "4ks-dev.us.auth0.com"
        }
        env {
          name  = "AUTH0_AUDIENCE"
          value = "https://dev.4ks.io/api"
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
          name  = "SWAGGER_ENABLED"
          value = var.api_swagger_enabled[terraform.workspace]
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

resource "google_cloud_run_service_iam_member" "api_anonymous_access" {
  service  = google_cloud_run_service.api.name
  location = google_cloud_run_service.api.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

output "api_service_url" {
  value = google_cloud_run_service.api.status[0].url
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
