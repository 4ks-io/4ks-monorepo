#!/bin/bash

# https://cloud.google.com/functions/docs/local-development

LOCAL_PUBSUB_EMULATOR_HOST=localhost:8085

maxRetry=10
ok=""
# while value not 'Ok' slee 2
while [[ $ok != "Ok" ]]; do
  echo "Waiting for PubSub emulator to be ready..."
  sleep 5
  maxRetry=$((maxRetry-1))
  if [[ $maxRetry -eq 0 ]]; then
    echo "PubSub emulator not ready after ${maxRetry} retries"
    exit 1
  fi
  ok=$(curl -s $LOCAL_PUBSUB_EMULATOR_HOST)
done


PROJECT_ID=local-4ks
URL="http://${LOCAL_PUBSUB_EMULATOR_HOST}/v1/projects/${PROJECT_ID}"
TOPIC=fetcher
TOPIC_NAME="projects/${PROJECT_ID}/topics/${TOPIC}"
SUB=fetcher-sub
SUB_NAME="projects/${PROJECT_ID}/subscriptions/${SUB}"
K8S_RECIPE_FETCHER_ENDPOINT="http://fetcher.default.svc.cluster.local/${TOPIC_NAME}"


# TOPIC
read -r -d '' VAR << EOM
curl -X PUT "${URL}/topics/${TOPIC}" \
    --silent --output /dev/null --write-out '%{http_code}'
EOM
status_code=$(eval $VAR)
echo "Create topic ${TOPIC}: ${status_code}"
# echo "$VAR"

read -r -d '' VAR << EOM
curl -X GET "${URL}/topics" --silent | jq -c '.topics[] | select(.name=="$TOPIC_NAME")'
EOM
eval $VAR
# echo "$VAR"

# SUBSCRIPTION
read -r -d '' VAR << EOM
curl -s -X PUT "${URL}/subscriptions/${SUB}" \
    --silent --output /dev/null --write-out '%{http_code}' \
    -H 'Content-Type: application/json' \
    --data '{
        "topic":"'"${TOPIC_NAME}"'",
        "pushConfig":{
          "pushEndpoint":"'"${K8S_RECIPE_FETCHER_ENDPOINT}"'"
        }
      }'
EOM
status_code=$(eval $VAR)
echo "Create subscription ${SUB}: ${status_code}"
# echo "$VAR"

read -r -d '' VAR << EOM
curl -X GET "${URL}/subscriptions" --silent | jq -c '.subscriptions[] | select(.name=="$SUB_NAME")'
EOM
eval $VAR
# echo "$VAR"
