## Create the tracing bootstrap in lib

Needs: [Task-01 — Run otel-lgtm and send a first log and span](Task-01-Run-otel-lgtm-and-send-a-first-log-and-span.md)

Create a tracing bootstrap in `lib` with the OpenTelemetry Node SDK and its auto-instrumentations for HTTP, NestJS,
`pg`, `ioredis` and `kafkajs`, and load it in every service and worker before the app code, with Node's `--import`.

* `service.name` is the container name, and `deployment.environment` is `local` for now.
* Sample 100% while running locally.
* Export over OTLP to the endpoint from the environment.

Why: the instrumentations patch libraries as they are imported, so a bootstrap loaded after them instruments nothing —
and says nothing about it.
