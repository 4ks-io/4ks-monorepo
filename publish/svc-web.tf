resource "google_artifact_registry_repository" "web" {
  repository_id = "web"
  location      = var.region
  description   = "docker/helm repo for web images"
  format        = "docker"
}

# resource "google_cloud_run_service" "web_service" {
#   name     = "web"
#   location = var.region

#   template {
#     spec {
#       containers {
#         image = "us-east4-docker.pkg.dev/dev-4ks/web/app:latest"
#         ports {
#           container_port = 5000
#         }
#         env {
#           name  = "VITE_AUTH0_CLIENT_ID"
#           value = "eM5Zyyfp6coLg3zORMFsZEnQmpqxBjHd"
#         }
#         env {
#           name  = "VITE_AUTH0_AUDIENCE"
#           value = "https://dev.4ks.io/api"
#         }
#         env {
#           name  = "VITE_AUTH0_DOMAIN"
#           value = "4ks-dev.us.auth0.com"
#         }

#       }

#     }
#   }

#   traffic {
#     percent         = 100
#     latest_revision = true
#   }

# }

# # Allow unauthenticated users to invoke the service
# resource "google_cloud_run_service_iam_member" "run_all_users" {
#   service  = google_cloud_run_service.api_service.name
#   location = google_cloud_run_service.api_service.location
#   role     = "roles/run.invoker"
#   member   = "allUsers"
# }

# output "service_url" {
#   value = google_cloud_run_service.api_service.status[0].url
# }