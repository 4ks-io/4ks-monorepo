# resource "google_service_account" "media" {
#   account_id   = "media-img-manager"
#   display_name = "Media Manager"
# }

# resource "google_project_iam_custom_role" "media" {
#   role_id     = "mediaManager"
#   title       = "Media Manager SA Role"
#   description = "Media Manager SA Role"
#   permissions = [
#     "storage.buckets.get",
#     "storage.objects.create",
#     "storage.objects.delete"
#   ]
# }

# resource "google_service_account_iam_binding" "media" {
#   service_account_id = google_service_account.media.id
#   role               = "roles/iam.serviceAccountTokenCreator"
#   members = [
#     google_service_account.media
#   ]
# }

