build:
	go build -o ./bin/fetcher *.go

run:
	go run .

debug:
	go run . -debug=true

# curl --header "Content-Type: application/json" \
#   --request POST \
#   --data '{"userId":"foo","url":"https://www.4ks.io/recipe/OQVsQx0jZ5Qmjl57FOIy-overnight-chocolate-oats"}' \
#   http://localhost:5858/test

test:
	go test -v ./...

cover:
	go test -coverprofile=coverage.out && go tool cover -html=coverage.out