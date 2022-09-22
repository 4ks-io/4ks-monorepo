
variable "gcp_service_list" {
  description = "List of GCP service to be enabled for a project."
  type        = list(any)
  default = [
    "artifactregistry.googleapis.com",
    "cloudapis.googleapis.com", # Google Cloud APIs
    "cloudresourcemanager.googleapis.com",
    "iam.googleapis.com", # Identity and Access Management (IAM) API
    "firestore.googleapis.com",
    "run.googleapis.com",
     "iamcredentials.googleapis.com",    # IAM Service Account Credentials API
     "logging.googleapis.com",           # Stackdriver Logging API
     "monitoring.googleapis.com",        # Stackdriver Monitoring API
     "servicemanagement.googleapis.com", # Service Management API
     "serviceusage.googleapis.com",      # Service Usage API
     "sourcerepo.googleapis.com",        # Cloud Source Repositories API
     "sql-component.googleapis.com",     # Cloud SQL
     "storage-api.googleapis.com",       # Google Cloud Storage JSON API
     "storage-component.googleapis.com", # Cloud Storage
     "cloudfunctions.googleapis.com",
     "cloudbuild.googleapis.com",
     "compute.googleapis.com"           
  ]
}

resource "google_project_service" "gcp_services" {
  count   = length(var.gcp_service_list)
  service = var.gcp_service_list[count.index]

  disable_dependent_services = true
}
