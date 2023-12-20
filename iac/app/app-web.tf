resource "google_cloud_run_v2_service" "web" {
  name     = "web"
  location = var.region
  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }

  template {
    scaling {
      min_instance_count = 1
      max_instance_count = 2
    }

    containers {
      image = "${local.container_registry}/web/app:${var.web_build_number}"

      resources {
        cpu_idle = true
        limits = {
          cpu    = "1000m"
          memory = "128Mi"
        }
      }

      ports {
        container_port = 5000
      }
      env {
        name  = "APP_ENV"
        value = var.app_env_map[terraform.workspace]
      }
      env {
        name  = "IO_4KS_API_URL"
        value = var.api_cloudrun_url_env_map[terraform.workspace]
      }
      env {
        name  = "LOG_DEBUG"
        value = "false"
      }
      # auth0
      env {
        name  = "AUTH0_BASE_URL"
        value = local.web_url
      }
      env {
        name  = "AUTH0_CLIENT_ID"
        value = var.auth0_client_id_env_map[terraform.workspace]
      }
      env {
        name  = "AUTH0_CLIENT_SECRET"
        value = var.auth0_client_secret
      }
      env {
        name  = "AUTH0_SECRET"
        value = var.auth0_secret
      }
      env {
        name  = "AUTH0_ISSUER_BASE_URL"
        value = "https://${var.auth0_domain[terraform.workspace]}"
      }
      env {
        name  = "AUTH0_BASE_URL"
        value = local.web_url
      }
      env {
        name  = "AUTH0_AUDIENCE"
        value = local.api_url
      }
      # todo: validate and fix auto session refresh
      # https://stackoverflow.com/questions/76813923/how-to-avoid-warning-message-when-getting-user-information-on-next-js-13-server
      #env {
      #  name  = "AUTH0_SESSION_AUTO_SAVE"
      #  value = "false"
      #}
      env {
        name  = "AUTH0_CALLBACK"
        value = "/app/auth/callback"
      }
      # env {
      #   name  = "NEXT_PUBLIC_AUTH0_LOGIN"
      #   value = "/app/auth/login"
      # }
      env {
        name  = "NEXT_PUBLIC_AUTH0_PROFILE"
        value = "/app/auth/me"
      }
      # typesense
      env {
        name  = "TYPESENSE_URL"
        value = var.typesense_url_env_map[terraform.workspace]
      }
      env {
        name  = "TYPESENSE_PROTOCOL"
        value = "https"
      }
      env {
        name  = "TYPESENSE_PORT"
        value = "443"
      }
      env {
        name  = "TYPESENSE_URL_CLIENT"
        value = var.typesense_url_env_map[terraform.workspace]
      }
      env {
        name  = "TYPESENSE_API_KEY"
        value = var.typesense_client_api_key_env_map[terraform.workspace]
      }
      env {
        name  = "MEDIA_FALLBACK_URL"
        value = "${local.web_url}/fallback"
      }

    }
  }

}

resource "google_cloud_run_service_iam_member" "web_anonymous_access" {
  service  = google_cloud_run_v2_service.web.name
  location = google_cloud_run_v2_service.web.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_compute_region_network_endpoint_group" "web_neg" {
  name                  = "${local.project}-web-neg"
  network_endpoint_type = "SERVERLESS"
  region                = var.region
  cloud_run {
    service = google_cloud_run_v2_service.web.name
  }
}

# resource "google_compute_backend_service" "web" {
#   name        = "${local.project}-web-backend"
#   protocol    = "HTTP"
#   port_name   = "http"
#   timeout_sec = 30

#   security_policy = google_compute_security_policy.development.id

#   backend {
#     group = google_compute_region_network_endpoint_group.web_neg.id
#   }
# }

output "web_service_url" {
  value = google_cloud_run_v2_service.web.uri
}
