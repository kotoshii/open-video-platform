## Replace otel-lgtm with Alloy and Grafana

Needs: [Task-24 — Run Loki, Tempo and Prometheus as separate containers](Task-24-Run-Loki-Tempo-and-Prometheus-as-separate-containers.md)

Remove `otel-lgtm`. Alloy receives OTLP from the services and forwards it to Loki, Tempo and Prometheus, and Grafana
runs on its own, with its data sources provisioned from files. The phase is done when the checks from Phases 2 to 4
pass without the all-in-one image.
