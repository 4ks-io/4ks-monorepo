# resource "google_artifact_registry_repository" "api" {
#   repository_id = "api"
#   location      = var.region
#   description   = "docker/helm repo for api images"
#   format        = "docker"
# }

# resource "google_cloud_run_service" "run_service" {
#   name     = "api"
#   location = var.region

#   template {
#     spec {
#       containers {
#         image = "us-east4-docker.pkg.dev/dev-4ks/api/api:0.0.1"
#         ports {
#            container_port = 5000
#         }

#         env {
#           name = ""
#           value = ""
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
#   service  = google_cloud_run_service.run_service.name
#   location = google_cloud_run_service.run_service.location
#   role     = "roles/run.invoker"
#   member   = "allUsers"
# }

# output "service_url" {
#   value = google_cloud_run_service.run_service.status
# }