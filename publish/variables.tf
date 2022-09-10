
variable "region" {
  default = "us-east4"
}

variable "zone" {
  default = "us-east1-b"
}

variable "stage" {
  default = "dev"

}

locals {
  project = "${var.stage}-4ks"
}