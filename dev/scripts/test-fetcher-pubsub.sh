#!/bin/bash

# https://cloud.google.com/eventarc/docs/workflows/cloudevents#cloud-storage

# https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.topics/publish
curl -s -X POST 'http://localhost:8085/v1/projects/local-4ks/topics/fetcher:publish' \
  -H 'Content-Type: application/json' \
  --data '{"messages":[
    {
      "@type": "type.googleapis.com/google.pubusb.v1.PubsubMessage",
      "messageId": "5",
      "attributes": {
        "URL": "https://www.4ks.io/recipe/OQVsQx0jZ5Qmjl57FOIy-overnight-chocolate-oats",
        "UserEventID": "6af0e37c-848c-4aac-909e-eca71c67b88f",
        "UserID": "46a9ae64525d761613dd5cb865618526e5ee0c6c36cfd519716530e5f2694c75"
      },
      "data":"eyJ1cmwiOiJodHRwczovL3d3dy40a3MuaW8vcmVjaXBlL09RVnNReDBqWjVRbWpsNTdGT0l5LW92ZXJuaWdodC1jaG9jb2xhdGUtb2F0cyIsInVzZXJJZCI6IjQ2YTlhZTY0NTI1ZDc2MTYxM2RkNWNiODY1NjE4NTI2ZTVlZTBjNmMzNmNmZDUxOTcxNjUzMGU1ZjI2OTRjNzUiLCJ1c2VyRXZlbnRJZCI6Ijg2MmRiNWU1LTY5NWYtNDc5Ny05ZGJkLTBkNjE3M2ZjOWU1NiJ9"
    }
  }
  ]}'

echo ""