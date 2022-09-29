
module "lb" {
  source                = "./modules/http-load-balancer"
  name                  = local.project
  project               = data.google_project.project.number
  url_map               = google_compute_url_map.urlmap.self_link
  dns_managed_zone_name = var.dns_managed_zone_name
  # custom_domain_names   = [var.custom_domain_name[terraform.workspace], "bugr.io"]
  custom_domain_names = [local.domain]
  create_dns_entries  = var.create_dns_entry
  dns_record_ttl      = var.dns_record_ttl
  enable_http         = true
  enable_ssl          = true
  ssl_certificates    = [google_compute_ssl_certificate.default.id]
  #   custom_labels = var.custom_labels
}


resource "google_compute_url_map" "urlmap" {
  project = data.google_project.project.number

  name        = "${local.project}-url-map"
  description = "URL map for ${local.project}"

  default_service = google_compute_backend_service.web.id

  host_rule {
    hosts        = ["*"]
    path_matcher = "all"
  }

  path_matcher {
    name            = "all"
    default_service = google_compute_backend_service.web.id

    path_rule {
      paths   = ["/api/*"]
      service = google_compute_backend_service.api.id
      route_action {
        url_rewrite {
          path_prefix_rewrite = "/"
        }
      }
    }

  }

  test {
    service = google_compute_backend_service.api.id
    host    = "dev.4ks.io"
    path    = "/api/ready"
  }
}

resource "google_compute_security_policy" "development" {
  name = "dev-policy"

  rule {
    action   = "allow"
    priority = "1000"
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["71.191.48.46/32"]
      }
    }
    description = "Allow access to IPs in 71.191.48.46"
  }

  rule {
    # action   = "deny(403)"
    action   = "allow"
    priority = "2147483647"
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }
    description = "default rule"
  }
}
