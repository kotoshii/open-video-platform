## Ship container logs to Loki with Alloy

Needs: [Task-01 — Run otel-lgtm and send a first log and span](Task-01-Run-otel-lgtm-and-send-a-first-log-and-span.md),
[Task-02 — Add a JSON logger to lib](Task-02-Add-a-JSON-logger-to-lib.md)

Add Alloy to the observability profile. It discovers the Docker containers and ships their standard output to Loki,
with `service`, `level` and `environment` as the only labels. Check that the gateway's JSON access logs arrive with their
fields too. The phase is done when searching `service="video-api"` shows structured lines
([observability-plan.md](../../../observability-plan.md), Phase 2).

Why: collecting standard output also covers containers with no SDK at all — nginx, Keycloak, Kafka, MinIO — and a
service that crashes before its SDK starts. Ids never become labels: every label value creates a stream of its own.
