variable "region" {
  default = "us-east4"
}

variable "zone" {
  default = "us-east4-b"
}

variable "stage" {
  default = "dev"
}

locals {
  org     = "4ks"
  project = "${var.stage}-${local.org}"
}