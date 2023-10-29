resource "google_cloud_run_service" "web" {
  name     = "web"
  location = var.region

  template {
    spec {
      containers {
        image = "${local.container_registry}/web/app:${var.web_build_number}"
        ports {
          container_port = 5000
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

# resource "google_compute_backend_service" "web" {
#   name        = "${local.project}-web-backend"
#   protocol    = "HTTP"
#   port_name   = "http"
#   timeout_sec = 30

#   security_policy = google_compute_security_policy.development.id

#   backend {
#     group = google_compute_region_network_endpoint_group.web_neg.id
#   }
# }