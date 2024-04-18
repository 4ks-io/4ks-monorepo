
start: 
	docker start kind-registry
	docker start kind-control-plane
	tilt up --stream=true

stop: 
	tilt down
	kubectl delete pvc/typesense-pvc

	docker stop kind-control-plane
	docker stop kind-registry

logs:
	tilt -s

swagger:
	python3 -m webbrowser http://localhost:5174/swagger/index.html#/

swag:
	pnpm run swag

saga:
	python3 -m webbrowser https://local.getsaga.ai/

# function to tidy go modules
define go_mod_tidy
		# success \xE2\x9C\x94 => https://www.compart.com/en/unicode/U+2714
		# fail \xE2\x9D\x8C => https://www.compart.com/en/unicode/U+274C
    $(eval $@_PATH = $(1))
		@cd "$($@_PATH)" && \
    if go mod tidy; then \
        echo -e "\033[0;32m \xE2\x9C\x94 \033[0m $($@_PATH)"; \
    else \
        echo -e "\033[0;31m \xE2\x9D\x8C \033[0m $($@_PATH) "; \
    fi
endef

tidy:
	@$(call go_mod_tidy,"apps/api")
	@$(call go_mod_tidy,"apps/fetcher")
	@$(call go_mod_tidy,"libs/go/utils")
