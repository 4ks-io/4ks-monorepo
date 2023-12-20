# Cloud Pub/Sub

User submits URL: The user enters a recipe URL into the web front-end (Next.js application), triggering a request to the API (Go Gin API).

API generates event: The API generates an event containing the recipe URL and publishes it to a Cloud Pub/Sub topic.

Recipe-fetcher subscribes and processes event: The recipe-fetcher is subscribed to the same Cloud Pub/Sub topic and receives the event notification. It extracts the recipe URL from the event and initiates the recipe fetching process.

Recipe-fetcher fetches recipe: The recipe-fetcher fetches the recipe data from the provided URL using a web scraper or API call.

Recipe-fetcher processes recipe: The recipe-fetcher extracts the relevant recipe information from the JSON-LD data, including title, ingredients, instructions, and image URLs.

Recipe-fetcher publishes recipe event: The recipe-fetcher generates an event containing the extracted recipe data and publishes it to another Cloud Pub/Sub topic.

API subscribes and processes recipe event: The API is subscribed to the recipe event topic and receives the notification. It extracts the recipe data from the event and updates the recipe database in Cloud Firestore.

API notifies user: The API updates the user interface in the web front-end to indicate that the recipe has been processed and is ready to view.

# Cloud Tasks

User submits URL: The user enters a recipe URL into the web front-end (Next.js application), triggering a request to the API (Go Gin API).

API creates task: The API creates a Cloud Tasks task containing the recipe URL and enqueues it in a Cloud Tasks queue.

Cloud Tasks schedules task: Cloud Tasks schedules the task for execution based on the specified retry and dispatch configurations.

Worker fetches recipe: When the task is dispatched, a worker process retrieves the recipe URL from the task payload and initiates the recipe fetching process.

Worker fetches and processes recipe: The worker fetches the recipe data from the provided URL and extracts the relevant recipe information, including title, ingredients, instructions, and image URLs.

Worker updates recipe database: The worker updates the recipe database in Cloud Firestore with the extracted recipe data.

Worker notifies API: The worker sends a notification to the API indicating that the task has been completed and the recipe has been processed.

API notifies user: The API updates the user interface in the web front-end to indicate that the recipe has been processed and is ready to view.

# Eventarc

User submits URL: The user enters a recipe URL into the web front-end (Next.js application), triggering a request to the API (Go Gin API).

API generates event: The API generates an event containing the recipe URL and triggers an Eventarc trigger.

Eventarc invokes function: Eventarc invokes a Cloud Function in response to the triggered event.

Function fetches recipe: The Cloud Function receives the recipe URL from the event payload and initiates the recipe fetching process.

Function fetches and processes recipe: The Cloud Function fetches the recipe data from the provided URL and extracts the relevant recipe information, including title, ingredients, instructions, and image URLs.

Function updates recipe database: The Cloud Function updates the recipe database in Cloud Firestore with the extracted recipe data.

Function notifies API: The Cloud Function sends a notification to the API indicating that the task has been completed and the recipe has been processed.

API notifies user: The API updates the user interface in the web front-end to indicate that the recipe has been processed and is ready to view.

# Create and subscribe to pubsub topic

This code will create a Pub/Sub topic named my-topic if it does not exist, and then it will create a subscription to the topic named my-subscription. The subscription will receive messages from the topic and print them to the console.

```
package fetcher

import (
    "context"
    "fmt"

    "cloud.google.com/go/pubsub"
)

func main() {
    ctx := context.Background()

    // Create a Pub/Sub client.
    client, err := pubsub.NewClient(ctx)
    if err != nil {
        panic(err)
    }

    // Create a topic if it does not exist.
    topic := client.Topic("my-topic")
    err = topic.Create(ctx)
    if err != nil && err != pubsub.ErrTopicExists {
        panic(err)
    }

    // Subscribe to the topic.
    sub, err := client.CreateSubscription(ctx, "my-subscription", pubsub.SubscriptionConfig{Topic: topic})
    if err != nil {
        panic(err)
    }

    // Receive messages from the subscription.
    err = sub.Receive(ctx, func(ctx context.Context, msg *pubsub.Message) {
        fmt.Printf("Received message: %s\n", msg.Data)
        msg.Ack()
    })
    if err != nil {
        panic(err)
    }
}
```

## Publish

```
Publisher:

Go
package fetcher

import (
    "context"
    "fmt"

    "cloud.google.com/go/pubsub"
)

func main() {
    ctx := context.Background()

    // Create a Pub/Sub client.
    client, err := pubsub.NewClient(ctx)
    if err != nil {
        panic(err)
    }

    // Create a topic.
    topic := client.Topic("recipe-fetcher-topic")

    // Create a message with the recipe URL, user ID, and another ID.
    data := fmt.Sprintf(`{"recipeURL": "https://www.example.com/recipe/12345", "userID": "user123", "otherID": "otherid456"}`)
    msg := &pubsub.Message{Data: []byte(data)}

    // Publish the message.
    result := topic.Publish(ctx, msg)

    // Wait for the message to be published and get the message ID.
    messageID, err := result.Get()
    if err != nil {
        panic(err)
    }

    fmt.Printf("Published message with ID: %s\n", messageID)
}
```

# Subscriber

```
package fetcher

import (
    "context"
    "fmt"

    "cloud.google.com/go/pubsub"
)

func main() {
    ctx := context.Background()

    // Create a Pub/Sub client.
    client, err := pubsub.NewClient(ctx)
    if err != nil {
        panic(err)
    }

    // Create a subscription.
    sub, err := client.CreateSubscription(ctx, "recipe-fetcher-subscription", pubsub.SubscriptionConfig{Topic: client.Topic("recipe-fetcher-topic")})
    if err != nil {
        panic(err)
    }

    // Receive messages from the subscription.
    err = sub.Receive(ctx, func(ctx context.Context, msg *pubsub.Message) {
        fmt.Printf("Received message: %s\n", msg.Data)

        // Process the message data (recipe URL, user ID, and other ID).

        // Post an acknowledgment on a separate topic.
        ackTopic := client.Topic("recipe-fetcher-ack-topic")
        ackMessage := &pubsub.Message{Data: []byte(`{"messageID": "` + msg.ID + `"}`)}
        ackTopic.Publish(ctx, ackMessage)

        msg.Ack()
    })
    if err != nil {
        panic(err)
    }

    // Delete the subscription once done.
    defer sub.Delete(ctx)
}
```

## Client-Side notifications

Considering the restrictions on direct client-side access to Cloud Firestore, here are some alternative approaches to achieve real-time user notifications without sacrificing performance or introducing excessive complexity:

# Server-Sent Events (SSE)

SSEs provide a one-way communication channel from the server to the client, enabling the server to push updates to the client without the need for continuous polling. The API can act as the server, sending SSE notifications to the client upon recipe completion. The client can listen to the SSE stream and display notifications accordingly.

# WebSockets

WebSockets establish a persistent bi-directional communication channel between the server and the client. The API can maintain WebSocket connections with connected users and send notifications when recipes are ready. The client can receive notifications through the WebSocket connection and display them to the user.

# Long Polling

Long polling is a technique where the client sends an HTTP request to the server and keeps the connection open until the server has an update to send. The API can implement long polling, periodically checking for recipe completion and sending notifications to the client when available.

# Polling with Exponential Backoff

Polling with exponential backoff is a refined approach to polling, where the polling interval increases exponentially after each failed request, reducing the frequency of requests when notifications are infrequent. The API can implement this approach, sending periodic requests to check for recipe completion and gradually increasing the interval between requests until a notification is received.

These alternatives offer varying levels of real-time capabilities and trade-offs between performance, complexity, and cost. SSEs and WebSockets provide the most responsive notifications but require more server-side management. Long polling and polling with exponential backoff are simpler to implement but may introduce some latency.

The choice of approach depends on the specific requirements of your application, balancing performance, cost, and complexity. If real-time responsiveness is crucial, SSEs or WebSockets are suitable options. If simplicity is a priority, long polling or polling with exponential backoff may be preferred.

### Server-Side Implementation (Go Gin backend)

Establish SSE Endpoint: Create an endpoint in your Go Gin backend that handles SSE requests. This endpoint will be responsible for sending notifications to connected clients.

Manage Client Connections: Use a library like gorilla/websocket to manage client connections. Upon receiving an SSE request, create a new connection for the client and add it to a connection pool.

Handle Recipe Completion Events: Subscribe to the Cloud Pub/Sub topic where the recipe-fetcher publishes completion events. When a completion event is received, extract the user ID and recipe ID.

Send Notifications: Iterate through the connection pool and find the connections associated with the user ID from the completion event. For each matching connection, send an SSE notification containing the recipe ID.

Handle Connection Events: Monitor connection events (open, close, error) and remove disconnected clients from the connection pool.

### Client-Side Implementation (Next.js frontend)

Create EventSource: Create an EventSource object in your Next.js frontend code, specifying the URL of the SSE endpoint.

Handle SSE Events: Implement an event listener for the EventSource's message event. When an SSE message is received, extract the recipe ID from the message data and display a notification to the user.

### Client-Server Connection

Yes, the client-server connection needs to stay alive for SSE to function effectively. The client maintains an open connection with the server, allowing the server to push notifications directly to the client without the need for polling or intermediaries. This ensures real-time delivery of notifications.

### Additional Considerations

Error Handling: Implement error handling mechanisms to gracefully handle connection errors and network issues.

Content Negotiation: Use content negotiation techniques to determine the appropriate streaming format (JSON, plain text) for the client.

Backpressure: Implement backpressure mechanisms to control the flow of notifications and prevent overwhelming clients with too many messages.

Heartbeat Messages: Send periodic heartbeat messages to keep the connection alive and detect inactive clients.

Client-Side Cleanup: Upon closing the SSE connection, ensure that the client-side event listener is properly cleaned up.
