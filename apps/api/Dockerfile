FROM golang:1.18-alpine as builder
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN go install github.com/mitranim/gow@latest
WORKDIR /app

COPY ./go.mod ./
COPY ./go.sum ./
RUN go mod download

COPY ./apps/api ./apps/api
COPY ./libs/go ./libs/go
RUN CGO_ENABLED=0 GIN_MODE=release go build -o 4ksapi ./apps/api/main.go

FROM scratch
COPY --from=builder /app/4ksapi /4ksapi
COPY --from=builder /etc/passwd /etc/passwd
USER appuser
CMD ["/4ksapi"]