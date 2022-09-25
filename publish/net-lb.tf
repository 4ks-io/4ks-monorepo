
module "lb" {
  source  = "./modules/http-load-balancer"
  name    = local.project
  project = data.google_project.project.number
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


    route_rules {
      priority = 1
      service  = google_compute_backend_service.api.id
      match_rules {
        prefix_match = "/api"
        ignore_case  = false
      }
    }
    # route_rules {
    #   priority = 2
    #   service  = google_compute_backend_service.api.id
    #   match_rules {
    #     ignore_case  = false
    #     prefix_match = "/api"
    #   }
    #   route_action {
    #     url_rewrite {
    #       path_prefix_rewrite = "/"
    #     }
    #   }
    # }

    # path_rule {
    #   paths   = ["/api/auth/*"]
    #   service = google_compute_backend_service.dashboard.id
    # }

    # path_rule {
    #   paths   = ["/api/*"]
    #   service = google_compute_backend_service.api.id

    #   url_rewrite {
    #       path_prefix_rewrite = "A replacement path"
    #   }
    # }
  }
}