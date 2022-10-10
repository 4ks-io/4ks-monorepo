resource "google_dns_managed_zone" "dev_4ks_io" {
  name        = local.project
  dns_name    = "${local.domain}."
  description = local.project
  # labels = {
  #   foo = "bar"
  # }
}

resource "google_compute_ssl_certificate" "default" {
  name_prefix = "dev-4ks-"
  description = "development 90 day cert"
  private_key = var.tls_key
  certificate = var.tls_crt

  lifecycle {
    create_before_destroy = true
  }
}

