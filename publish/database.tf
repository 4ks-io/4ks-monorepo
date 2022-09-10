resource "google_project_service" "firestore_api" {

  project = local.project
  service = "firestore.googleapis.com"

  disable_dependent_services = true
  disable_on_destroy         = true

  depends_on = [
    google_project_service.gcp_crm_api
  ]
}

# resource "google_app_engine_application" "firestore" {
#   project       = local.project
#   location_id   = var.region
#   database_type = "CLOUD_FIRESTORE"
#   depends_on    = [google_project_service.firestore]
# }