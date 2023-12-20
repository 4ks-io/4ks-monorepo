# nginx for local development

WARNING!!
You should probably be using the root docker-compose.yml instead of these instructions

### Build Container

```
docker build -f Dockerfile -t local.4ks.io/alb:latest .
```

### Run the Container

Linux

```
docker run -d --restart always \
  --add-host=host.docker.internal:host-gateway \
  -p 443:4433 \
  -p 80:8080 \
  --name 4ks-alb \
  local.4ks.io/alb:latest
```

MacOS

```
docker run -d --restart always \
  -p 443:4433 \
  -p 80:8080 \
  --name 4ks-alb \
  local.4ks.io/alb:latest
```
