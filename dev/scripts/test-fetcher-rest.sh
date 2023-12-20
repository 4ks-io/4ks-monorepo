#!/bin/bash

# https://cloud.google.com/eventarc/docs/workflows/cloudevents#cloud-storage

curl localhost:5889/projects/local-4ks/topics/fetcher \
  -X POST \
  -H "Content-Type: application/json" \
  -H "ce-id: 123451234512345" \
  -H "ce-specversion: 1.0" \
  -H "ce-time: 2020-01-02T12:34:56.789Z" \
  -H "ce-type: google.cloud.pubsub.topic.v1.messagePublished" \
  -H "ce-source: //pubsub.googleapis.com/projects/local-4ks/topics/fetcher" \
  -d '{
    "message":{
      "@type": "type.googleapis.com/google.pubusb.v1.PubsubMessage",
      "messageId": "5",
      "attributes": {
        "URL": "https://www.4ks.io/recipe/OQVsQx0jZ5Qmjl57FOIy-overnight-chocolate-oats",
        "UserEventID": "6af0e37c-848c-4aac-909e-eca71c67b88f",
        "UserID": "46a9ae64525d761613dd5cb865618526e5ee0c6c36cfd519716530e5f2694c75"
      },
      "data":"eyJ1cmwiOiJodHRwczovL3d3dy40a3MuaW8vcmVjaXBlL09RVnNReDBqWjVRbWpsNTdGT0l5LW92ZXJuaWdodC1jaG9jb2xhdGUtb2F0cyIsInVzZXJJZCI6IjQ2YTlhZTY0NTI1ZDc2MTYxM2RkNWNiODY1NjE4NTI2ZTVlZTBjNmMzNmNmZDUxOTcxNjUzMGU1ZjI2OTRjNzUiLCJ1c2VyRXZlbnRJZCI6Ijg2MmRiNWU1LTY5NWYtNDc5Ny05ZGJkLTBkNjE3M2ZjOWU1NiJ9"
    }
  }'
