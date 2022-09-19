resource "google_artifact_registry_repository" "api" {
  repository_id = "api"
  location      = var.region
  description   = "docker/helm repo for api images"
  format        = "docker"
}

# resource "google_cloud_run_service" "api_service" {
#   name     = "api"
#   location = var.region

#   template {
#     spec {
#       containers {
#         image = "us-east4-docker.pkg.dev/dev-4ks/api/api:0.0.6"
#         ports {
#           container_port = 5000
#         }

#         env {
#           name  = "FIRESTORE_PROJECT_ID"
#           value = "4ks-dev"
#         }
#         env {
#           name  = "SWAGGER_ENABLED"
#           value = "true"
#         }
#         env {
#           name  = "AUTH0_DOMAIN"
#           value = "4ks-dev.us.auth0.com"
#         }
#         env {
#           name  = "AUTH0_AUDIENCE"
#           # value = "https://dev.4ks.io/api"
#           value = "https://api-wlg4huzsea-uk.a.run.app"
#         }
#         env {
#           name  = "EXPORTER_TYPE"
#           value = "JAEGER"
#         }
#         env {
#           name = "GIN_MODE"
#           value = "release"
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