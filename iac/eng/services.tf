resource "google_project_service" "gcp_services" {
  service                    = "artifactregistry.googleapis.com"
  disable_dependent_services = false
  disable_on_destroy         = false
}

# dev-4ks
resource "google_project_iam_member" "service_agent_dev" {
  project = local.project
  role    = "roles/artifactregistry.reader"
  member  = "serviceAccount:service-442267162150@serverless-robot-prod.iam.gserviceaccount.com"
}

# prd-4ks
resource "google_project_iam_member" "service_agent_prd" {
  project = local.project
  role    = "roles/artifactregistry.reader"
  member  = "serviceAccount:service-37853409258@serverless-robot-prod.iam.gserviceaccount.com"
}