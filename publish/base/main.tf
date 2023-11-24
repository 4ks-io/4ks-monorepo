terraform {
  required_version = ">= 1.3.3"
  required_providers {
    google = {
      source  = "google"
      version = "4.84.0"
    }
  }

  cloud {
    organization = "4ks"
    workspaces {
      # https://www.terraform.io/cli/cloud/settings
      tags = ["base","us-east"]
    }
  }
}

provider "google" {
  project = local.project
  region  = var.region
  zone    = var.zone
}

data "google_project" "project" {}
data "google_storage_project_service_account" "gcs_account" {}