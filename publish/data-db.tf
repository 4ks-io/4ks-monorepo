

# data "google_iam_policy" "firestore_runner" {
#   binding {
#     role = "roles/iam.serviceAccountUser"

#     members = [
#       "user:jane@example.com",
#     ]
#   }
# }
# resource "google_service_account" "firestore_runner" {
#   account_id   = "firestore-runner"
#   display_name = "firestore-runner"
# }

# data "google_iam_policy" "admin" {
#   binding {
#     role = "roles/compute.instanceAdmin"

#     members = [
#       "serviceAccount:${google_service_account.firestore_runner.account_id}@${local.project}.iam.gserviceaccount.com",
#     ]
#   }

#   depends_on = [
#     google_service_account.firestore_runner
#   ]
# }

# resource "google_service_account_iam_policy" "firestore_runner-account-iam" {
#   service_account_id = google_service_account.firestore_runner.name
#   policy_data        = data.google_iam_policy.firestore_runner.policy_data
# }

# resource "google_app_engine_application" "firestore" {
#   project       = local.project
#   location_id   = var.region
#   database_type = "CLOUD_FIRESTORE"
# }