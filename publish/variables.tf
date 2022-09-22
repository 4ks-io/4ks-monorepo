

variable "region" {
  default = "us-east4"
}

variable "project-id" {
  default = "dev-4ks"
}

variable "zone" {
  default = "us-east1-b"
}

variable "stage" {
  default = "dev"
}


locals {
  organization = "4ks"
  project      = "${var.stage}-${local.organization}"
  domain       = "${var.stage}.${local.organization}.io"
}