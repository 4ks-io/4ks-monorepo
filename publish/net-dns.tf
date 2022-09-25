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
  private_key = file("~/dev.4ks.io/private.key")
  certificate = file("~/dev.4ks.io/certificate.crt")

  lifecycle {
    create_before_destroy = true
  }
}

