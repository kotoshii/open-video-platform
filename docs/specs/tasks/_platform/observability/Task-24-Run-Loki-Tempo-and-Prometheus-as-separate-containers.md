## Run Loki, Tempo and Prometheus as separate containers

Needs: [Task-09 — Link traces and logs in Grafana](Task-09-Link-traces-and-logs-in-Grafana.md),
[Task-14 — Collect Kafka consumer lag with Alloy](Task-14-Collect-Kafka-consumer-lag-with-Alloy.md)

Replace the storage parts of `otel-lgtm` with Loki, Tempo and Prometheus containers, each with its config file under
`docker/observability/` and its data under `docker_data/`.

Why: this is where each piece's configuration becomes something understood rather than inherited
([observability-plan.md](../../../observability-plan.md), Phase 7).
