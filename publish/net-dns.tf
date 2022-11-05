resource "google_dns_managed_zone" "dev_4ks_io" {
  name        = local.project
  dns_name    = "${local.domain}."
  description = local.project
  # labels = {
  #   foo = "bar"
  # }
}


resource "google_compute_managed_ssl_certificate" "default" {
  project = data.google_project.project.number
  name    = "managed-certificate"

  managed {
    domains = [
      var.domain_env_mapping_main[terraform.workspace],
      # var.domain_env_mapping_static[terraform.workspace],
    ]
  }
}
