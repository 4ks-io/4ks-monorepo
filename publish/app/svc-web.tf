resource "google_artifact_registry_repository" "web" {
  repository_id = "web"
  location      = var.region
  description   = "docker/helm repo for web images"
  format        = "docker"
}

resource "google_cloud_run_service" "web" {
  name     = "web"
  location = var.region

  metadata {
    annotations = {
      "autoscaling.knative.dev/maxScale" = 2
    }
  }

  template {
    spec {
      containers {
        image = "us-east4-docker.pkg.dev/${var.stage}-${local.org}/web/app:${var.web_build_number}"
        ports {
          container_port = 5000
        }
        resources {
          requests = {
            # cpu    = "50m" # impacts no of reqs per instance
            memory = "128Mi"
          }
          limits = {
            memory = "128Mi"
          }
        }

        env {
          name  = "VITE_MEDIA_FALLBACK_URL"
          value = "https://storage.googleapis.com/${replace(google_storage_bucket.media_static.url, "gs://", "")}/fallback"
        }
        env {
          name  = "VITE_AUTH0_CLIENT_ID"
          value = "eM5Zyyfp6coLg3zORMFsZEnQmpqxBjHd"
        }
        env {
          name  = "VITE_AUTH0_AUDIENCE"
          value = local.web_api_url
        }
        env {
          name  = "VITE_AUTH0_DOMAIN"
          value = "${local.org}-${var.stage}.us.auth0.com"
        }
        env {
          name  = "APP_ENV"
          value = var.app_env_map[terraform.workspace]
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
  name        = "${local.project}-web-backend"
  protocol    = "HTTP"
  port_name   = "http"
  timeout_sec = 30

  security_policy = google_compute_security_policy.development.id

  backend {
    group = google_compute_region_network_endpoint_group.web_neg.id
  }
}