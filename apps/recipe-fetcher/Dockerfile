FROM golang:1.20-alpine as build
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /code
COPY ./go.mod .
COPY ./go.sum .
RUN go mod download

COPY ./apps/recipe-fetcher ./apps/recipe-fetcher
COPY ./libs/go ./libs/go
RUN CGO_ENABLED=0 go build -o fetcher ./apps/recipe-fetcher

FROM scratch
COPY --from=build /etc/passwd /etc/passwd
COPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=build /code/fetcher /fetcher
USER appuser
CMD ["/fetcher"]