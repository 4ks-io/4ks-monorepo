
// us-east1 : Moncks Corner, South Carolina
variable "region" {
  default = "us-east4"
}

variable "zone" {
  default = "us-east4-b"
}

locals {
  org     = "4ks"
  domain  = "4ks.io"
  project = "eng-4ks"
}