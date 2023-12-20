resource "google_artifact_registry_repository" "api" {
  repository_id = "api"
  location      = var.region
  description   = "docker/helm repo for api images"
  format        = "docker"
}

resource "google_artifact_registry_repository" "web" {
  repository_id = "web"
  location      = var.region
  description   = "docker/helm repo for web images"
  format        = "docker"
}

resource "google_artifact_registry_repository" "fetcher" {
  repository_id = "fetcher"
  location      = var.region
  description   = "docker/helm repo for web images"
  format        = "docker"
}