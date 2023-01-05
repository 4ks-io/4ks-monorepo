data "google_project" "project" {
}

// us-east1 : Moncks Corner, South Carolina
variable "region" {
  default = "us-east4"
}

variable "zone" {
  default = "us-east4-b"
}

variable "stage" {
  default = "sbx"
}

variable "app_env_map" {
  type = map(string)
  default = {
    "media-sbx-us-east" = "sbx"
  }
}

variable "web_subdomain_env_map" {
  type = map(string)
  default = {
    "media-sbx-us-east" = "sbx."
  }
}

locals {
  org        = "4ks"
  domain     = "4ks.io"
  project    = "${var.stage}-4ks"
  web_domain = "${var.web_subdomain_env_map[terraform.workspace]}${local.org}.io"
}

data "google_storage_project_service_account" "gcs_account" {
}