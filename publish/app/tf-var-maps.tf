variable "app_env_map" {
  type = map(string)
  default = {
    "app-dev-us-east" = "dev"
    "app-tst-us-east" = "tst"
    "app-prd-us-east" = "prd"
  }
}

variable "web_subdomain_env_map" {
  type = map(string)
  default = {
    "app-dev-us-east" = "dev.",
    "app-tst-us-east" = "tst."
    "app-prd-us-east" = ""
  }
}

variable "feat_api_jaeger_enabled_map" {
  type = map(string)
  default = {
    "app-dev-us-east" = false
    "app-prd-us-east" = false
  }
}

variable "feat_api_swagger_enabled_map" {
  type = map(string)
  default = {
    "app-dev-us-east" = true
    "app-prd-us-east" = false
  }
}

