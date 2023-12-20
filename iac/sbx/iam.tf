resource "google_project_iam_custom_role" "bucket" {
  role_id     = "BucketRole"
  title       = "Bucket Access"
  description = "Bucket Access"
  permissions = [
    "storage.buckets.create",
    "storage.buckets.createTagBinding",
    "storage.buckets.delete",
    "storage.buckets.deleteTagBinding",
    "storage.buckets.get",
    "storage.buckets.getIamPolicy",
    "storage.buckets.list",
    "storage.buckets.listEffectiveTags",
    "storage.buckets.listTagBindings",
    "storage.buckets.setIamPolicy",
    "storage.buckets.update",
    "storage.multipartUploads.abort",
    "storage.multipartUploads.create",
    "storage.multipartUploads.list",
    "storage.multipartUploads.listParts",
    "storage.objects.create",
    "storage.objects.delete",
    "storage.objects.get",
    "storage.objects.getIamPolicy",
    "storage.objects.list",
    "storage.objects.setIamPolicy",
    "storage.objects.update",
  ]
}
