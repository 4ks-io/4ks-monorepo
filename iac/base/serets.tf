resource "google_secret_manager_secret" "api_fetcher_psk" {
  secret_id = "api-fetcher-psk"

  labels = {
    label = "4ks"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
      # replicas {
      #   location = "us-east1"
      # }
    }
  }
}