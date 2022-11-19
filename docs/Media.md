# Upload File with SignedUrl

```
curl -v -H "Content-Type: image/jpeg" --upload-file spaghetti.jpg \
 "https://storage.googleapis.com/media-write.dev.4ks.io/e1e478ea-ebc2-4b18-b6c2-dd3dce14194f.jpeg?...=host"
```

# minio

export MINIO_DOCKER_NAME=minio
export MINIO_ACCESS_KEY=foobar
export MINIO_SECRET_KEY=barfoobarfoo
export MINIO_BUCKET=barfoobarfoo

docker run --name $MINIO_DOCKER_NAME -d -p 9000:9000 -e MINIO_ACCESS_KEY=$MINIO_ACCESS_KEY -e MINIO_SECRET_KEY=$MINIO_SECRET_KEY quay.io/minio/minio:latest server /data
docker run --rm --link $MINIO_DOCKER_NAME:minio -e MINIO_BUCKET=$MINIO_BUCKET --entrypoint sh minio/mc -c "\
 while ! nc -z minio 9000; do echo 'Wait minio to startup...' && sleep 0.1; done; \
 sleep 5 && \
 mc config host add myminio https://local.4ks.io/s3 \$MINIO_ENV_MINIO_ACCESS_KEY \$MINIO_ENV_MINIO_SECRET_KEY && \
 mc rm -r --force myminio/\$MINIO_BUCKET || true && \
 mc mb myminio/\$MINIO_BUCKET && \
 mc policy download myminio/\$MINIO_BUCKET \
"
