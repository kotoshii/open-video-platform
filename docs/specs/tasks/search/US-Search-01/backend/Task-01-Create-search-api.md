## Create search-api

Needs: [_platform infrastructure Task-27 — Run Elasticsearch with the Ukrainian analysis plugin](../../../_platform/infrastructure/Task-27-Run-Elasticsearch-with-the-Ukrainian-analysis-plugin.md)

Create `search-api` in the new structure, with its Elasticsearch client and the code that creates its indices on start
if they are missing. Add it to Compose, the gateway route and its Kafka topics.

* It has no database of its own: Elasticsearch is what it owns.
* Its consumers still need an inbox, so give it a small database for that alone.

Why: the index is a copy of other services' data, built entirely from their events — which is why this service can be
rebuilt from scratch by replaying them, and why nothing else is allowed to write to it.
