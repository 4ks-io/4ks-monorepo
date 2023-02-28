
// us-east1 : Moncks Corner, South Carolina
variable "region" {
  default = "us-east4"
}

variable "zone" {
  default = "us-east4-b"
}

variable "stage" {
  default = "dev"
}

variable "api_build_number" {
  type = string
}

variable "web_build_number" {
  type = string
}

variable "typesense_api_key" {
  type = string
}

locals {
  org                   = "4ks"
  domain                = "4ks.io"
  dns_managed_zone_name = "4ks-${var.stage}-app-zone"
  project               = "${var.stage}-4ks"
  web_domain            = "${var.web_subdomain_env_map[terraform.workspace]}${local.org}.io"
  web_base_url          = "https://${local.web_domain}"
  web_api_url           = "https://${local.web_domain}/api"
}