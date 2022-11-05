resource "google_service_account" "media" {
  account_id   = "media-img-manager"
  display_name = "Media Manager"
}

resource "google_project_iam_custom_role" "media" {
  role_id     = "mediaManager"
  title       = "Media Manager SA Role"
  description = "Media Manager SA Role"
  permissions = [
    "storage.buckets.get",
    "storage.objects.create",
    "storage.objects.delete"
  ]
}

# resource "google_service_account_iam_binding" "media" {
#   service_account_id = google_service_account.media.id
#   role               = "roles/iam.serviceAccountTokenCreator"
#   members = [
#     google_service_account.media
#   ]
# }


# resource "google_storage_bucket" "media-static" {
#   name          = "static.dev.4ks.io"
#   location      = "us"
#   force_destroy = true

#   uniform_bucket_level_access = true

#   cors {
#     origin          = ["https://static.dev.4ks.io"]
#     method          = ["PUT"]
#     response_header = ["*"]
#     max_age_seconds = 3600
#   }
# }

resource "google_storage_bucket" "media-write" {
  name          = "min.dev.4ks.io"
  location      = "us"
  force_destroy = true

  uniform_bucket_level_access = false

  cors {
    origin          = ["https://min.dev.4ks.io"]
    method          = ["PUT"]
    response_header = ["*"]
    max_age_seconds = 3600
  }

  lifecycle_rule {
    condition {
      age = 3
    }
    action {
      type = "Delete"
    }
  }
}


resource "google_storage_bucket" "media-read" {
  name          = "media.dev.4ks.io"
  location      = "us"
  force_destroy = true

  uniform_bucket_level_access = false

  cors {
    origin          = ["https://media.dev.4ks.io"]
    method          = ["GET"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}
