# 4ks Data Model

Live Data Model Diagram

https://app.diagrams.net/?src=about#G1FwQB7uxcTfF5QOdGvn2zeyCqIfE6vPUK

![Data Model](/docs/4ksDataModel.png)

# 4ks Architecture Diagram

There are two proposals for an architecture in the diagram below

![Arch Diagram](/docs/arch-diagram.svg)

# Getting started

```
docker-compose up -d
minikube start || k3d cluster create 4ks --registry-create 4ks-registry
pnpm install
go install github.com/swaggo/swag/cmd/swag@latest
pnpm run swag
tilt up
https://local.4ks.io/ (must be added to host file)
```

# Production build / publish

## api build/publish steps

```
# auth
gcloud auth configure-docker us-east4-docker.pkg.dev

# build
export VERSION=0.0.1-next
docker build . --build-arg VERSION=$VERSION -f ./apps/api/Dockerfile -t 4ks/api:next

# publish
NEXT=$(docker images | grep 4ks/api | grep next | head -n1  | awk '{print $3}')
docker tag $NEXT us-east4-docker.pkg.dev/dev-4ks/api/app:next
docker tag $NEXT us-east4-docker.pkg.dev/dev-4ks/api/app:$VERSION
docker push us-east4-docker.pkg.dev/dev-4ks/api/app:next
docker push us-east4-docker.pkg.dev/dev-4ks/api/app:$NEXT
docker push us-east4-docker.pkg.dev/dev-4ks/api/app:$VERSION

// this requires a slight tilt mod to disable web/api
docker run --rm \
    -e FIRESTORE_EMULATOR_HOST=127.0.0.1:8200 \
    -e FIRESTORE_PROJECT_ID=4ks-dev \
    -e AUTH0_DOMAIN=4ks-dev.us.auth0.com \
    -e AUTH0_AUDIENCE='https://local.4ks.io/api' \
    -e EXPORTER_TYPE=JAEGER \
    -p 5000:5000 \
    4ks/api:latest
```

## web build/publish steps

```
./tools/package_json.sh
LATEST="4ks/web:latest"
export DEV="$LATEST-dev-deps"
export PRD="$LATEST-prd-deps"
export BUILD="$LATEST-build"
export APP="$LATEST"
docker build --target prd -f apps/web/Dockerfile . -t $PRD
docker build \
    --cache-from $PRD \
    --target dev -f apps/web/Dockerfile . -t $DEV
docker build \
    --cache-from $PRD \
    --cache-from $DEV \
    --build-arg VERSION=$VERSION --target build -f apps/web/Dockerfile . -t $BUILD
docker build \
    --cache-from $PRD \
    --cache-from $DEV \
    --cache-from $BUILD \
    --target app -f apps/web/Dockerfile . -t $APP

VERSION=0.0.7
LATEST=$(docker images | grep 4ks/web | grep latest | head -n1 | awk '{print $3}')
docker tag $LATEST us-east4-docker.pkg.dev/dev-4ks/web/app:latest
docker tag $LATEST us-east4-docker.pkg.dev/dev-4ks/web/app:$VERSION
docker push us-east4-docker.pkg.dev/dev-4ks/web/app:latest
docker push us-east4-docker.pkg.dev/dev-4ks/web/app:$VERSION

docker run --rm -p 5005:5000 4ks/web:latest
```

# Run Terraform locally

Note: TF Cloud's default Execution Mode is Remote which runs TF code on their VMs. When this
is true, creds such as GCP must be set as ENV VARs in TF CLOUD.
https://app.terraform.io/app/4ks/workspaces/core-dev-us-east/ is currently set to run
locally.

```
export GOOGLE_CREDENTIALS=$(cat /home/<user>/.dev-4ks-<hash>.json | tr -s '\n' ' ')
export TF_TOKEN_app_terraform_io=*****
export TF_WORKSPACE="app-dev-us-east"
```

# 4ks Api

See Swagger def

# Easy API Testing

1. Install the VSCode Extension: "Rest Client" by Huachao Mao
2. Open `api.http` in the root of the repo and add/run api calls from there

```http
POST https://local.4ks.io/api/recipes HTTP/1.1
content-type: application/json

{
    "name": "Hammad's Recipe"
}
```

# Swagger Gen

1. Make sure you have `swag` installed

```
go install github.com/swaggo/swag/cmd/swag@latest
```

2. Run `pnpm swagger:gen` when you update any doc comments
3. Tilt will sync the files
4. Access Swagger at: https://local.4ks.io/swagger/index.html
5. Run `pnpm swag` to refresh the swagger specs, build @4ks/swag, and update the web app using tilt.

# GCP Terraform Service Account Setup

1. Create Service Account

```
   gcloud iam service-accounts create terraform-sa \
   --description "Terraform service account" \
   --display-name "terraform-sa"
```

2. List the service accounts and copy email address

```
gcloud iam service-accounts list
```

3. Download key

```
gcloud iam service-accounts keys create tf-sa.json \
  --iam-account=terraform-sa@development-999999.iam.gserviceaccount.com
```

4. Grant following IAM roles:

- Owner
- BucketRole

gcloud projects add-iam-policy-binding dev-4ks \
 --member=serviceAccount:cloud-run-api-runner@dev-4ks.iam.gserviceaccount.com \
 --role=projects/dev-4ks/roles/editor

# Upload File with SignedUrl

```
curl -v -H "Content-Type: image/jpeg" --upload-file spaghetti.jpg \
 "https://storage.googleapis.com/media-write.dev.4ks.io/e1e478ea-ebc2-4b18-b6c2-dd3dce14194f.jpeg?...=host"
```
