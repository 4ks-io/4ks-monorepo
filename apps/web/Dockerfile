# stage: prd (base)
# this will only have value once SSR is enabled and prd node_mods are required on final image
FROM node:18-alpine as prd
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN npm install -g pnpm
WORKDIR /app
COPY ./pnpm-lock.yaml .
COPY ./pnpm-workspace.yaml .
COPY ./workspace.json .
COPY ./PACKAGE_JSON/ ./
RUN pnpm install --production && rm -rf /app
  # output -> /root/.local/share/pnpm/store/v3

# stage: dev (base)
FROM prd as dev
WORKDIR /app
COPY ./pnpm-lock.yaml .
COPY ./pnpm-workspace.yaml .
COPY ./workspace.json .
COPY ./PACKAGE_JSON/ ./
RUN pnpm install && rm -rf /app
  # output -> /root/.local/share/pnpm/store/v3

# stage: build
FROM dev as build
RUN apk --no-cache add bash jq
WORKDIR /app
COPY ./.npmrc .
COPY ./nx.json .
COPY ./pnpm-lock.yaml .
COPY ./pnpm-workspace.yaml .
COPY ./tsconfig.base.json .
COPY ./workspace.json .
COPY ./PACKAGE_JSON/ ./
RUN pnpm install

COPY ./libs/ts ./libs/ts
COPY ./apps/web/ ./apps/web

# libs (nx??)
WORKDIR /app/libs/ts/api-fetch
RUN pnpm run codegen && pnpm run build-fetch

# app
WORKDIR /app/apps/web
RUN npx vite build
  # output -> /app/apps/web/dist

# configs
ARG VERSION=0.0.0
ENV VERSION=$VERSION
RUN find /app/apps/web/configs -type f -exec sh -c 'V=$2; jq --arg variable "$V" ".VERSION = \"$V\"" $1 > $1.tmp && mv $1.tmp $1' -- {} $VERSION \;

FROM yobasystems/alpine:3.15.4-amd64 as app
COPY --from=amd64/caddy:2-alpine /usr/bin/caddy /app/caddy
COPY --from=build /etc/passwd /etc/passwd
COPY --from=build /app/apps/web/dist/ /app
COPY --from=build /app/apps/web/Caddyfile /app/Caddyfile
COPY --from=build /app/apps/web/configs /app/configs
RUN mkdir /home/appuser && chmod 777 /home/appuser

USER appuser
EXPOSE 5000
WORKDIR /app
CMD ./caddy run


