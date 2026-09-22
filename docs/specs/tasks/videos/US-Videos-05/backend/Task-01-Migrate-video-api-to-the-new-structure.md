## Migrate video-api to the new structure

Move `video-api` to the new module layout — `domain`, `application`, `infrastructure` and `presentation` per bounded
context — and wire it into Compose, the database init, the migration container, its Kafka topics and the gateway route.

* Its events go through the outbox in `lib`, and its consumers through the inbox.
* It keeps the videos and their visibility; the renditions, the thumbnails and the publishing state arrive with the
  rest of this story.

Why: this is the service the whole upload pipeline writes into, so it moves first and everything else in the epic is
built on the new structure.
