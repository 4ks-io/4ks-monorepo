
variable "gcp_service_list" {
  description = "List of GCP service to be enabled for a project."
  type        = list(any)
  default = [
    "artifactregistry.googleapis.com",
    "cloudapis.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "iam.googleapis.com",
    "firestore.googleapis.com",
    "run.googleapis.com",
    "domains.googleapis.com",
    "compute.googleapis.com",
    "dns.googleapis.com",
    "serviceusage.googleapis.com",
    "storage-component.googleapis.com",
    "logging.googleapis.com",
    "monitoring.googleapis.com",        # Stackdriver Monitoring API
    # "servicemanagement.googleapis.com", # Service Management API
    # "sourcerepo.googleapis.com",        # Cloud Source Repositories API
    "sql-component.googleapis.com", # Cloud SQL
    "storage-api.googleapis.com",   # Google Cloud Storage JSON API
    "cloudfunctions.googleapis.com",
    "vision.googleapis.com",
    "certificatemanager.googleapis.com",
    "cloudbuild.googleapis.com",
    "eventarc.googleapis.com"
  ]
}

resource "google_project_service" "gcp_services" {
  count   = length(var.gcp_service_list)
  service = var.gcp_service_list[count.index]

  disable_dependent_services = false
  disable_on_destroy         = false
}
