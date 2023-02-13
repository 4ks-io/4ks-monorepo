# Getting started

## Ingredients

- nodejs 18
- pnpm >= 6.9.0 (using 7.1.7)
- go >= 1.18
- Docker
- minikube or k3d (try minikube; fallback to k3d)
- tilt
- swaggo/swag/cmd/swag@v1.8.1 (bug in versions later than 1.8.1 as of writing this)

## Prep

1. Install and run `docker`
1. Install and run `minikube` or `k3d`
1. Install [tilt](https://docs.tilt.dev/install.html)
1. Install `nodejs`, `pnpm`, and `go`
1. Install swaggo/swag \
   `go install github.com/swaggo/swag/cmd/swag@v1.8.1`

## Instructions

1. Start kubernetes including a local container registry \
    `minikube start` \
    or \
   `k3d cluster create 4ks --registry-create 4ks-registry`
1. Nginx is used for local development only. Build and run using docker-compose. \
   `docker-compose up -d --build`
1. Install npm deps \
   `pnpm install`
1. swaggo/swag is used to regenerate the swagger definition in apps/api/docs and the contents of libs/ts/api-fetch \
   `pnpm run swag`
1. Run tilt \
   `tilt up`
1. Map `local.4ks.io` to 127.0.0.1 in your host file. Navigate to `https://local.4ks.io`

## Serving

1. Tilt syncs most code changes into the running containers on kubernmetes. libs/ts/api-fetch needs to be refreshed "manually".Simply run `pnpm swag` on your local and tilt will work its magic.

## System

[nic]
linux 6.1.10-200.fc37.x86_64
docker ce 23.0.1
k3d v5.4.7
tilt v0.31.2
