
# trust self-signed cert
# certutil -addstore -enterprise -f "Root" ./local.4ks.io.pem


sudo cp ./local.4ks.io.pem /etc/pki/ca-trust/source/anchors/
ls -l /etc/pki/ca-trust/source/anchors/

sudo update-ca-trust
