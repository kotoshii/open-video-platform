## Collect Postgres and Redis metrics

Needs: [Task-03 — Ship container logs to Loki with Alloy](Task-03-Ship-container-logs-to-Loki-with-Alloy.md)

Collect Postgres connections, transaction rate and slow queries, and Redis memory, connected clients and evictions, with
Alloy's built-in exporters.

Why: the connection count shows pools adding up towards `max_connections` before connections start being refused.
Redis runs with `noeviction`, so a full Redis shows up as memory at its limit and failing writes rather than evictions.
