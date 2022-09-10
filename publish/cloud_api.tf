
# THIS MUST BE DONE BEFORE ANY `google_project_service`
# Cloud Resource Manager API must be enabled to read or edit Project Service
# visit https://console.developers.google.com/apis/api/cloudresourcemanager.googleapis.com/overview?project=442267162150


# Cloud Resource Manager API
resource "google_project_service" "gcp_crm_api" {
  service = "cloudresourcemanager.googleapis.com"
}

# Identity and Access Management API
resource "google_project_service" "gcp_iam_api" {
  service = "iam.googleapis.com"
}

# Artifact Registry API
resource "google_project_service" "gcp_reg_api" {
  service = "artifactregistry.googleapis.com"
}
