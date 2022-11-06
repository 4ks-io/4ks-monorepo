terraform {
  required_version = ">= 1.3.3"
  required_providers {
    google = {
      source  = "google"
      version = "4.41.0"
    }
  }

  cloud {
    organization = "4ks"
    workspaces {
      # https://www.terraform.io/cli/cloud/settings
      tags = ["app"]
    }
  }
}

provider "google" {
  project = local.project
  region  = var.region
  zone    = var.zone
}
