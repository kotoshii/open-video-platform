## video-upload-api: Stream upload progress over SSE

Needs: [Task-07 — video-upload-api: Implement GET /video-uploads/{videoId}](Task-07-video-upload-api-Implement-GET-video-uploads-videoId.md),
[_platform foundation Task-06 — Add Redis and BullMQ builders to lib](../../../_platform/foundation/Task-06-Add-Redis-and-BullMQ-builders-to-lib.md)

`GET /video-uploads/{videoId}/events` — an SSE stream of that upload's status changes

Main flow:

1. Check the video belongs to the acting channel.
2. Subscribe to the Redis channel for this video.
3. Send the current status from the database.
4. Forward what arrives on the Redis channel, and unsubscribe when the last connection for that video closes.

The other half: whichever instance consumes a processing event updates the status in the database and publishes a small
message to that video's Redis channel.

Branch — the client reconnects:

1. The same order applies — subscribe, send the current status, then forward.

Why: the connection lives in one instance's memory while the Kafka event may be consumed by another, and pub/sub is how
the second tells the first. Subscribing before reading the status closes the gap where an update would be missed by
both; the cost is the client occasionally seeing the same update twice, which changes nothing on the page.
