
# trust self-signed cert
# certutil -addstore -enterprise -f "Root" ./local.4ks.io.pem


cp ./local.4ks.io.pem /etc/pki/ca-trust/source/anchors/
ls -l /etc/pki/ca-trust/source/anchors/

update-ca-trust
