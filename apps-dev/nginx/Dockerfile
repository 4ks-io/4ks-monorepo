FROM nginx:mainline-alpine

RUN chmod -R a+w /var/cache/nginx/ \
        && cat > /var/run/nginx.pid \
        && chmod a+w /var/run/nginx.pid \
        && rm /etc/nginx/conf.d/*

COPY local.conf /etc/nginx/conf.d/local.conf
COPY info.html /usr/share/nginx/html/
COPY 502.html /usr/share/nginx/html/
COPY local.4ks.io* /etc/nginx/conf.d/

EXPOSE 8080
EXPOSE 4433
USER nginx