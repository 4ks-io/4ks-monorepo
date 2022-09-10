terraform {
  required_version = ">= 1.2.6"
  cloud {
    organization = "4ks"

    workspaces {
      name = "core-dev-us-east"
    }
  }
}

provider "google" {
  project = local.project
  region  = var.region
  zone    = var.zone
}

# resource "google_project" "my_project" {
#   name        = "dev-4ks"
#   project_id  = "dev-4ks"
#   org_id      = "1234567"
#   skip_delete = true
# }

