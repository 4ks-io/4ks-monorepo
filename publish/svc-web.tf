resource "google_artifact_registry_repository" "web" {
  repository_id = "web"
  location      = var.region
  description   = "docker/helm repo for web images"
  format        = "docker"
}

resource "google_cloud_run_service" "web" {
  name     = "web"
  location = var.region

  template {
    spec {
      containers {
        image = "us-east4-docker.pkg.dev/dev-4ks/web/app:0.0.6"
        ports {
          container_port = 5000
        }
        env {
          name  = "VITE_AUTH0_CLIENT_ID"
          value = "eM5Zyyfp6coLg3zORMFsZEnQmpqxBjHd"
        }
        env {
          name  = "VITE_AUTH0_AUDIENCE"
          value = "https://dev.4ks.io/api"
        }
        env {
          name  = "VITE_AUTH0_DOMAIN"
          value = "4ks-dev.us.auth0.com"
        }

        env {
          name  = "APP_ENV"
          value = var.app_env_mapping[terraform.workspace]
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

}

resource "google_cloud_run_service_iam_member" "web_anonymous_access" {
  service  = google_cloud_run_service.web.name
  location = google_cloud_run_service.web.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

output "web_service_url" {
  value = google_cloud_run_service.web.status[0].url
}


resource "google_compute_region_network_endpoint_group" "web_neg" {
  name                  = "${local.project}-web-neg"
  network_endpoint_type = "SERVERLESS"
  region                = var.region
  cloud_run {
    service = google_cloud_run_service.web.name
  }
}

resource "google_compute_backend_service" "web" {
  name = "${local.project}-web-backend"

  protocol    = "HTTP"
  port_name   = "http"
  timeout_sec = 30

  backend {
    group = google_compute_region_network_endpoint_group.web_neg.id
  }
}