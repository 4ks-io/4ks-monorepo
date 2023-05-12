
// us-east1 : Moncks Corner, South Carolina
variable "region" {
  default = "us-east4"
}

variable "zone" {
  default = "us-east4-b"
}

variable "web_subdomain_env_map" {
  type = map(string)
  default = {
    "base-dev-us-east" = "dev.",
    "base-tst-us-east" = "tst."
    "base-prd-us-east" = ""
  }
}

variable "www_subdomain_env_map" {
  type = map(string)
  default = {
    "base-dev-us-east" = "dev.",
    "base-tst-us-east" = "tst."
    "base-prd-us-east" = "www."
  }
}

locals {
  org                   = "4ks"
  domain                = "4ks.io"
  stage                 = substr(terraform.workspace, 5, 3)
  dns_managed_zone_name = "4ks-${local.stage}-app-zone"
  project               = "${local.stage}-4ks"
  www_domain            = "${var.www_subdomain_env_map[terraform.workspace]}${local.org}.io"
  web_domain            = "${var.web_subdomain_env_map[terraform.workspace]}${local.org}.io"
  web_api_url           = "https://${local.www_domain}/api"

  google_compute_managed_ssl_certificate_name = "managed-certificate"
}