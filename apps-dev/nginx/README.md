# nginx for local development

### Build Container

```
docker build -f Dockerfile -t local.bugr.io/nginx:latest .
```

### Run the Container

Linux
```
docker run -d --restart always --add-host=host.docker.internal:host-gateway --name bugr --publish 443:4433 local.bugr.io/nginx:latest
```
MacOS
```
docker run -d --restart always --name bugr --publish 443:4433 local.bugr.io/nginx:latest
```