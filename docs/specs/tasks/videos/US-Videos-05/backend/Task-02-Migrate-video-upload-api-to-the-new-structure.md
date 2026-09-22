## Migrate video-upload-api to the new structure

Move `video-upload-api` to the new module layout and wire it into Compose, the database init, the migration container,
its Kafka topics and the gateway route, including the SSE route the gateway does not buffer.

* It owns the upload sessions and the status the uploading page reads; the tus hooks and the progress stream come with
  the rest of this story.
* Run two instances from the start, as the upload progress design only works when there are two
  ([sse-progress-and-redis-pubsub.md](../../../../../explainers/sse-progress-and-redis-pubsub.md), Part 9).

Why: with one instance the progress works even when the pub/sub step is missing entirely, so the bug only appears later,
when nobody remembers this part.
