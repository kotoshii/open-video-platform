## Run otel-lgtm and send a first log and span

Needs: [infrastructure Task-01 — Split the Compose setup into per-environment files](../infrastructure/Task-01-Split-the-Compose-setup-into-per-environment-files.md)

Add `grafana/otel-lgtm` to `docker/compose/observability.yaml`, behind the `observability` profile, with its data under
`docker_data/`. Point one service at its OTLP endpoint and send a test log line and a test span. The phase is done when
the log shows up in Grafana's log search and the span in its trace search
([observability-plan.md](../../../observability-plan.md), Phase 1).

Why: the all-in-one image shows the whole picture working before each piece has to be understood; it is split into
separate containers in Phase 7. The profile keeps this heavy stack out of a plain `docker compose up`.
