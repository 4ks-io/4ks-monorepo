FROM nginx:mainline-alpine

RUN chmod -R a+w /var/cache/nginx/ \
        && cat > /var/run/nginx.pid \
        && chmod a+w /var/run/nginx.pid \
        && rm /etc/nginx/conf.d/*

COPY info.html /usr/share/nginx/html/
COPY 502.html /usr/share/nginx/html/

EXPOSE 8080
EXPOSE 4433
USER nginx