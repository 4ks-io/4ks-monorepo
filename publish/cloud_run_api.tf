resource "google_artifact_registry_repository" "api" {
  repository_id = "api"
  location      = var.region
  description   = "docker/helm repo for api images"
  format        = "docker"
}


 resource "google_cloud_run_service" "run_service" {
  name = "app"
  location = "us-east4"

  template {
    spec {
      containers {
        image = "gcr.io/google-samples/hello-app:1.0"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  # Waits for the Cloud Run API to be enabled
  #depends_on = [google_project_service.run_api]
}  


# Allow unauthenticated users to invoke the service
 resource "google_cloud_run_service_iam_member" "run_all_users" {
  service  = google_cloud_run_service.run_service.name
  location = google_cloud_run_service.run_service.location
  role     = "roles/run.invoker"
  member   = "allUsers"
} 

output "service_url" {
  value = google_cloud_run_service.run_service.status
}