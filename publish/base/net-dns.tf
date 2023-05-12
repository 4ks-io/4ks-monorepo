resource "google_dns_managed_zone" "default" {
  name        = local.project
  dns_name    = "${local.www_domain}."
  description = local.project
}

resource "google_compute_managed_ssl_certificate" "default" {
  project = data.google_project.project.number
  name    = local.google_compute_managed_ssl_certificate_name

  managed {
    domains = [
      "${local.www_domain}.",
    ]
  }
}
