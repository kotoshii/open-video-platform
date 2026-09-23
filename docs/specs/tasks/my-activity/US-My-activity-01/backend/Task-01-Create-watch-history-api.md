## Create watch-history-api

Create `watch-history-api` in the new structure and wire it into Compose, the database init, the migration container,
its Kafka topics and the gateway route.

* A history row per channel and video, with a unique constraint on the pair, the time it was last watched, and the
  video's title.
* Per channel: whether the history is paused, and when it was last cleared.

Why: the unique pair turns every watch into an upsert, so a repeat watch moves the existing row instead of adding a
second one, and two consumers racing on the same pair cannot create duplicates.
