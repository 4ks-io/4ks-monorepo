# resource "google_service_account" "static" {
#   account_id   = "static-sa"
#   display_name = "Static SA"
# }

# resource "google_project_iam_custom_role" "static" {
#   role_id     = "staticConsumer"
#   title       = "Static Consumer SA Role"
#   description = "Static Consumer SA Role"
#   permissions = [  "storage.buckets.viewer" ]
# }

# resource "google_service_account_iam_binding" "static" {
#   service_account_id = google_service_account.static.id
#   role               = "roles/iam.serviceAccountTokenCreator"
#   members            = ["allUsers"]
# }


# resource "google_storage_bucket" "media-static" {
#   name          = "static.dev.4ks.io"
#   location      = "us"
#   force_destroy = true

#   uniform_bucket_level_access = true

#   cors {
#     origin          = ["https://static.dev.4ks.io"]
#     method          = ["GET"]
#     response_header = ["*"]
#     max_age_seconds = 3600
#   }
# }
