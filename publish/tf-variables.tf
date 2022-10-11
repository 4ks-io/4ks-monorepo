

variable "region" {
  default = "us-east4"
}

variable "zone" {
  default = "us-east1-b"
}

variable "stage" {
  default = "dev"
}

variable "app_env_mapping" {
  type = map(string)
  default = {
    "app-dev-us-east" = "dev"
    "app-prd-us-east" = "prd"
  }
}

variable "api_swagger_enabled" {
  type = map(string)
  default = {
    "app-dev-us-east" = true
    "app-prd-us-east" = false
  }
}

variable "dns_managed_zone_name" {
  description = "The name of the Cloud DNS Managed Zone in which to create the DNS A Record specified in var.custom_domain_name. Only used if var.create_dns_entry is true."
  type        = string
  default     = "4ks-dev-app-zone"
}

variable "create_dns_entry" {
  description = "If set to true, create a DNS A Record in Cloud DNS for the domain specified in 'custom_domain_name'."
  type        = bool
  default     = false
}

variable "dns_record_ttl" {
  description = "The time-to-live for the load balancer A record (seconds)"
  type        = string
  default     = 60
}

variable "api_build_number" {
  type = string
}

variable "web_build_number" {
  type = string
}

# variable "tls_key" {
#   type        = string
#   description = "TLS Key"
# }

# variable "tls_crt" {
#   type        = string
#   description = "TLS Cert"
# }

locals {
  organization = "4ks"
  project      = "${var.stage}-${local.organization}"
  domain       = "${var.stage}.${local.organization}.io"
}