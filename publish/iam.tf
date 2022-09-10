

resource "google_project_iam_custom_role" "some_custom_sa" {
  role_id     = "testSvcAcc"
  title       = "Test Service Account"
  description = "Test Service Account Role"
  permissions = [
    "resourcemanager.projects.get"
  ]

  depends_on = [
    google_project_service.gcp_iam_api
  ]
}