## Provision dashboards and add the Services dashboard

Needs: [Task-12 — Add HTTP metrics per service and route](Task-12-Add-HTTP-metrics-per-service-and-route.md)

Provision dashboards from JSON files under `docker/observability/`, and add the first one: request rate, errors and
latency per service.

Why: a dashboard made only in the UI is lost with the container.
