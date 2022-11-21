These tutorial followed to implement the media upload feature (https://cloud.google.com/blog/products/storage-data-transfer/uploading-images-directly-to-cloud-storage-by-using-signed-url) points out that "there
are TWO ways to sign the generated bytes to create the Signed URL" and the code sample includes a SignBytes function on the SignedURLOptions.

https://cloud.google.com/blog/products/storage-data-transfer/uploading-images-directly-to-cloud-storage-by-using-signed-url/#:~:text=there%20are%20two%20ways%20to%20sign%20the%20generated%20bytes%20to%20create%20the%20Signed%20URL.

This is very different from the other code sample provided (https://cloud.google.com/storage/docs/samples/storage-generate-upload-signed-url-v4#storage_generate_upload_signed_url_v4-go) which says there are in fact
THREE ways to sign code.

Signing a URL requires credentials authorized to sign a URL. You can pass
these in through SignedURLOptions with one of the following options:
a. a Google service account private key, obtainable from the Google Developers Console
b. a Google Access ID with iam.serviceAccounts.signBlob permissions
c. a SignBytes function implementing custom signing.

In our code we opted for (b) of the three options. In this approach it isn't necessary define the
custom SignBytes function or provide a private key (the general concensus online seems to be to avoid this
solution). In this approach credentials are automatically detected since the code is on GCE.

https://pkg.go.dev/cloud.google.com/go/storage#hdr-Credential_requirements_for_signing

What I've discovered is that ...

url, err := client.Bucket(uploadableBucket).SignedURL(key, opts)
ERROR!! SignedURL: storage: exactly one of PrivateKey or SignedBytes must be set

url, err := storage.SignedURL(uploadableBucket, key, opts)
This works...