# # stage: deps (base)
# FROM node:20-alpine3.17 as deps
# RUN addgroup -S appgroup && adduser -S appuser -G appgroup
# RUN npm install -g pnpm

# WORKDIR /code
# COPY /PACKAGE_JSON /code
# COPY /pnpm* .
# RUN pnpm install --frozen-lockfile && rm -rf /code
#   # output -> /root/.local/share/pnpm/store/v3

# stage: build
FROM node:20-alpine3.17 as build
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN npm install -g pnpm

WORKDIR /code
COPY /PACKAGE_JSON /code
COPY /pnpm* .
RUN pnpm install --frozen-lockfile

COPY ./libs/reserved-words ./apps/web/public
COPY ./libs/ts/api-fetch /code/libs/ts/api-fetch
RUN pnpm --filter @4ks/api-fetch build

WORKDIR /code/apps/web
COPY ./apps/web /code/apps/web

# NEXT_PUBLIC_AUTH0 build-time vars
ENV NEXT_PUBLIC_AUTH0_PROFILE=/app/auth/me
ENV NEXT_PUBLIC_AUTH0_LOGIN=/app/auth/login
RUN npx next build
  # output -> /app/apps/web/.next

# EXPOSE 3000
# WORKDIR /code/apps/web
# CMD [ "npm", "run", "start" ]

# runtime
FROM node:20-alpine3.17
RUN mkdir /home/appuser && chmod 777 /home/appuser
USER appuser

COPY --from=build /etc/passwd                      /etc/passwd
COPY --from=build /root/.local/share/pnpm          /root/.local/share/pnpm
COPY --from=build /code/package.json               /app/package.json
COPY --from=build /code/node_modules               /app/node_modules
COPY --from=build /code/apps/web/package.json /app/apps/web/package.json
COPY --from=build /code/apps/web/node_modules /app/apps/web/node_modules
COPY --from=build /code/apps/web/public       /app/apps/web/public
COPY --from=build /code/apps/web/.next        /app/apps/web/.next

EXPOSE 3000
WORKDIR /app/apps/web
CMD [ "npx", "next", "start" ]