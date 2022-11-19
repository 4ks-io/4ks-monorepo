# resource "google_service_account" "media" {
#   account_id   = "media-dev-sa"
#   display_name = "Media SBX SA"
#   description  = "SA to read/write to sbx bucket for local dev"
# }

# resource "google_project_iam_custom_role" "api" {
#   role_id     = "mediaDevSA"
#   title       = "Media SBX SA"
#   description = "Media SBX SA"
#   permissions = [
#     "storage.buckets.get",
#     "storage.objects.create",
#     "storage.objects.delete"
#   ]
# }

resource "google_storage_bucket" "media" {
  name          = "media.${local.web_domain}"
  location      = "US-EAST4"
  force_destroy = true
  
  uniform_bucket_level_access = false

  cors {
    origin          = ["https://local.4ks.io"]
    method          = ["PUT","GET"]
    response_header = ["*"]
    max_age_seconds = 3600
  }

  lifecycle_rule {
    condition {
      age = 1
    }
    action {
      type = "Delete"
    }
  }
}
