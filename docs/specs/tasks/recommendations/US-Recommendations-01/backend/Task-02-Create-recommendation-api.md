## Create recommendation-api

Needs: [Task-01 — Run Gorse in Compose](Task-01-Run-Gorse-in-Compose.md)

Create `recommendation-api` in the new structure, with its Gorse client. Add it to Compose, the gateway route and its
Kafka topics.

* Gorse holds the users, items and feedback; the service's own database is small and exists for the inbox of its
  consumers.
* The feed snapshots live in Redis.

Why: only this service talks to Gorse. The rest of the platform reaches the recommender through the events it already
publishes and through the feed endpoint, so replacing Gorse later means changing one service.
