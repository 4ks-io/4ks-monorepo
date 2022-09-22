resource "google_api_gateway_api" "api_gw" {
  provider = google-beta
  api_id = "api-gw"
  project = "dev-4ks"
}

resource "google_api_gateway_api_config" "api_gw" {
  provider = google-beta
  api = google_api_gateway_api.api_gw.api_id
  api_config_id = "config"
  project = "dev-4ks"

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
  project = "dev-4ks"
  region = "us-east4"
}


output "name" {
    value = google_api_gateway_gateway.api_gw.default_hostname
}