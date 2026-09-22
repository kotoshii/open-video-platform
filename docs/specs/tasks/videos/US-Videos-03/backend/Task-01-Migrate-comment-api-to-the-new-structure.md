## Migrate comment-api to the new structure

Move `comment-api` to the new module layout and wire it into Compose, the database init, the migration container, its
Kafka topics and the gateway route.

* Its events go through the outbox in `lib`, and its consumers through the inbox.
* It keeps the comments as they are; threads, pinning and the rest arrive with the Comments epic.

Why: deleting a video deletes its comments, so this service is needed here even though its own stories come later.
