## Run Gorse in Compose

Needs: [_platform infrastructure Task-03 — Create a database and user per service](../../../_platform/infrastructure/Task-03-Create-a-database-and-user-per-service.md),
[_platform infrastructure Task-04 — Add healthchecks to the infrastructure containers](../../../_platform/infrastructure/Task-04-Add-healthchecks-to-the-infrastructure-containers.md)

Add Gorse to `infra.yaml` as a single all-in-one container with a healthcheck, and keep its config file in the repo.
Its data goes into a database and user of its own on the Postgres server, created by the same init as the services'
databases, and its cache into the shared Redis — it does not rely on eviction, so `noeviction` does not hurt it.

Set in the config:

* Feedback types: `watch` and `like` are positive, `dislike` is negative, and there is no read type.
* `enable_replacement` off, so a video the channel has watched is not recommended to it again. Check this against the
  running version, as the story asks
  ([US-Recommendations-01](../../../../user-stories/recommendations/US-Recommendations-01-Feed.md)).
* Gorse's own fallback (`latest` by default) off — the popularity fallback belongs to `recommendation-api`.
* `auto_insert_item` off, or a watch of an accessible-by-link video would create a recommendable item for it.
* `cache_size` at least the size of a feed snapshot; the default is 100.

Why: Gorse treats an item a user has only read as a negative example. With watches as reads, every video watched but
not liked — most of them, since few people press like — would teach the model that the channel is not interested in
it.
