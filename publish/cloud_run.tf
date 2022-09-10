resource "google_artifact_registry_repository" "api_v1" {
  repository_id = "api-v1"
  location      = var.region
  description   = "docker/helm repo for api v1 images"
  format        = "docker"

  depends_on = [
    google_project_service.gcp_reg_api
  ]
}

# resource "google_project_service" "run_api" {
#   service = "run.googleapis.com"

#   disable_on_destroy = true
#     depends_on = [
#     google_project_service.gcp_crm_api
#   ]
# }

# resource "google_cloud_run_service" "run_service" {
#   name = "app"
#   location = var.region

#   template {
#     spec {
#       containers {
#         image = "gcr.io/google-samples/hello-app:1.0"
#       }
#     }
#   }

#   traffic {
#     percent         = 100
#     latest_revision = true
#   }

#   depends_on = [google_project_service.run_api]
# }

# # Allow unauthenticated users to invoke the service
# resource "google_cloud_run_service_iam_member" "run_all_users" {
#   service  = google_cloud_run_service.run_service.name
#   location = google_cloud_run_service.run_service.location
#   role     = "roles/run.invoker"
#   member   = "allUsers"
# }

# output "service_url" {
#   value = google_cloud_run_service.run_service.status[0].url
# }