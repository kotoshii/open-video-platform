## video-rate-api: Implement POST /video-rates/{videoId}

Needs: [Task-02 — video-api: Expose a video's rate permission over gRPC](Task-02-video-api-Expose-a-videos-rate-permission-over-gRPC.md),
[US-Videos-03 Task-02 — Migrate video-rate-api to the new structure](../../US-Videos-03/backend/Task-02-Migrate-video-rate-api-to-the-new-structure.md)

`POST /video-rates/{videoId}` — body `{ "type": "like" | "dislike" }`

Main flow:

1. Take the acting channel from the `Channel-ID` header the gateway set.
2. Ask `video-api` over gRPC whether the video exists and allows rates.
3. In one transaction, upsert the rate — a unique constraint on the channel and the video — and write the rate event to
   the outbox.
4. Return the stored rate.

Branch — the video does not exist:

1. 404 with its code.

Branch — the author turned rates off:

1. Reject with its code; the client puts the button back.

Why: the event goes through the outbox rather than straight to Kafka, so a Kafka outage never loses a rate or fails the
request — the count simply catches up later.
