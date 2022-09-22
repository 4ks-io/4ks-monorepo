resource "google_api_gateway_api" "api_gw" {
  provider = google-beta
  api_id = "api-gw"
  project = var.project-id
}

resource "google_api_gateway_api_config" "api_gw" {
  provider = google-beta
  api = google_api_gateway_api.api_gw.api_id
  api_config_id = "config"
  project = var.project-id

  openapi_documents {
    document {
      path = "spec.yaml"
      contents = filebase64("openapi2-functions.yaml")
    }
  }
  lifecycle {
    create_before_destroy = true
  }
}


resource "google_api_gateway_gateway" "api_gw" {
  provider = google-beta
  api_config = google_api_gateway_api_config.api_gw.id
  gateway_id = "dev-4ks"
  project = var.project-id
  region = var.region
}


output "name" {
    value = google_api_gateway_gateway.api_gw.default_hostname
}