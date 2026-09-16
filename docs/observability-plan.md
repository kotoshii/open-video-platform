# Observability plan

How logs, metrics and traces get set up in this project, in the order they should be built. What the pieces are and
why they exist is explained in [observability-explained.md](explainers/observability-explained.md) — read that first.

This is an infrastructure plan rather than an epic: no user ever sees it. Each phase ends with a check that proves the
phase works before moving on.

---

## Components

| Component         | Role                                                                                             | Runs as                                          |
|-------------------|--------------------------------------------------------------------------------------------------|--------------------------------------------------|
| OpenTelemetry SDK | Produces traces and metrics inside every Nest service and worker                                 | Library, bootstrapped from shared code in `lib/` |
| Alloy             | Receives OTLP data, collects container logs, scrapes infrastructure metrics, forwards everything | Container                                        |
| Loki              | Log storage                                                                                      | Container                                        |
| Prometheus        | Metric storage                                                                                   | Container                                        |
| Tempo             | Trace storage                                                                                    | Container                                        |
| Grafana           | Dashboards, log and trace search, alerts                                                         | Container                                        |

Configuration lives under `docker/observability/`, and persistent data under `docker_data/`, next to the rest of the
Compose setup.

---

## Phase 0 — Conventions, before any code

These are cheap to decide now and expensive to change once data exists.

* [ ] **Service name.** Every service reports `service.name` equal to its container name — `video-api`,
  `comment-rate-count-worker`, and so on. This is the name everything is grouped by.
* [ ] **Environment.** Every service reports `deployment.environment` (`local` for now).
* [ ] **Log format.** JSON lines with at least `time`, `level`, `service`, `msg`, `trace_id` and `span_id`, plus any
  context as separate fields (`videoId`, `channelId`) rather than inside the message text.
* [ ] **Loki labels.** Only `service`, `level` and `environment`. Ids never become labels.
* [ ] **Prometheus labels.** Route templates (`/videos/:id`) instead of raw paths; no ids, no user input.
* [ ] **Never logged.** Cookies, `Authorization` headers, tokens, passwords, email confirmation and reset tokens. Put
  the redaction list in the shared logger configuration so no service can forget it.

## Phase 1 — Everything in one container

The fastest way to see the whole picture working, before understanding every part of it.

* [ ] Add `grafana/otel-lgtm` to the Compose file. It bundles a collector, Loki, Tempo, Prometheus and Grafana, already
  wired together, and is meant for local development.
* [ ] Point one service at its OTLP endpoint.
* [ ] Send a test log line and a test span.

**Done when:** the test log is visible in Grafana's log search, and the test span in its trace search.

## Phase 2 — Logs

* [ ] Add a JSON logger to every Nest service and worker, configured once in `lib/` — pino through `nestjs-pino` is the
  usual choice; confirm its current state first.
* [ ] Inject `trace_id` and `span_id` into every log line from the active OpenTelemetry context.
* [ ] Services log to **standard output**. Alloy discovers the Docker containers and ships their output to Loki.
* [ ] Switch Nginx access logs to JSON so they can be filtered by field as well.

Why standard output rather than sending logs through the SDK: Alloy then also collects logs from containers that have no
SDK at all — Nginx, Keycloak, Kafka, MinIO — and from a service that crashes before its SDK has started.

**Done when:** searching `service="video-api"` shows structured lines, and a line written during a request carries a
trace id.

## Phase 3 — Traces

The most valuable phase for this architecture.

* [ ] Create a shared tracing bootstrap in `lib/` using the OpenTelemetry Node SDK and its auto-instrumentations for
  HTTP, NestJS, `pg`, `ioredis` and `kafkajs`.
* [ ] Load it **before** the application code — for example through Node's `--require` or `--import` — so the libraries
  are instrumented as they are imported.
* [ ] Make sure Nginx passes the `traceparent` header through to services unchanged. For now traces start at the first
  Node service; the gateway gets spans of its own in the follow-up below.
* [ ] **Verify Kafka propagation**: a producer span and the consumer span that handles its message must end up in the
  same trace. This is the most common place for tracing to silently break.
* [ ] In batch workers, create one span per batch with **span links** to each message's trace context, since a batch
  serves many traces at once.
* [ ] Configure Grafana so that a trace links to its logs, and a log line with a trace id links to its trace.
* [ ] Keep sampling at 100% while running locally.

**Done when:** liking a video produces one trace running from the rate API into Kafka and on into
`video-rate-count-worker` — and a log line from that worker opens that same trace.

### Follow-up — the gateway in traces

Once traces through the Node services and Kafka work:

* [ ] Check that `ngx_otel_module`, the official NGINX OpenTelemetry module, can be added to the gateway image — the
  `nginx-s3-gateway` image is already a customised NGINX.
* [ ] Add the module so Nginx creates its own span and traces start at the edge.
* [ ] Add the module's trace id variable to the JSON access logs, so Nginx log lines link to traces like every other
  service's.

**Done when:** a trace starts at Nginx and shows the time spent validating tokens, and HLS segment requests — which
never reach a Node service — appear as traces of their own.

## Phase 4 — Metrics

Application metrics:

* [ ] Request rate, error rate and duration per service and route, from the HTTP instrumentation.
* [ ] Count workers: batch size, batch processing duration, failed batches, and events skipped as duplicates.
* [ ] Video processing: BullMQ queue depth, job duration and failed jobs.
* [ ] Uploads: open SSE connections.

Infrastructure metrics, scraped by Alloy — several of these have exporters built into Alloy, which avoids a separate
container for each:

* [ ] **Kafka consumer lag per consumer group.** The single most important metric in the project.
* [ ] Postgres: connections, transaction rate, slow queries.
* [ ] Redis: memory, connected clients, evictions.
* [ ] Nginx: requests and connections.
* [ ] MinIO: its own built-in Prometheus metrics endpoint.
* [ ] Keycloak: its metrics endpoint.

**Done when:** Prometheus shows consumer lag for every worker, and request metrics for every service.

## Phase 5 — Dashboards

Provision every dashboard from a JSON file under `docker/observability/`, so it survives the container being recreated.
A dashboard made only in the UI is lost with the container.

* [ ] **Services** — request rate, errors and latency per service.
* [ ] **Kafka workers** — lag, batch duration and failures per worker.
* [ ] **Video pipeline** — queue depth, job durations and failures, uploads in progress.
* [ ] **Infrastructure** — Postgres, Redis, MinIO, Nginx.

## Phase 6 — Alerts

Add these only once there is a sense of what normal looks like, or every alert fires constantly.

Delivery:

* [ ] While the stack only runs on the development machine, alerts show in the Grafana UI only.
* [ ] Once it runs unattended anywhere, add one push contact point in Grafana itself — a Telegram or Discord webhook —
  provisioned from a file like the dashboards.
* [ ] Never deliver alerts through the platform's own email module or Kafka. An alert saying Kafka is down cannot travel
  through Kafka; Grafana has to reach the outside world on its own. A local mail catcher that Grafana reaches over
  plain SMTP is fine, since it bypasses the app entirely.

Alerts:

* [ ] **Consumer lag growing for several minutes in a row.** This catches the stuck-partition problem described in
  [known-issues.md](./known-issues.md) — the kind of failure that produces no error log at all.
* [ ] Error rate above a threshold for a service.
* [ ] Failed batches in any count worker.
* [ ] Failed BullMQ jobs.
* [ ] Disk usage of the MinIO and Postgres volumes.

## Phase 7 — Split into separate containers

Once everything works in the single container, replace it with Alloy, Loki, Prometheus, Tempo and Grafana as separate
services. This is where the configuration of each piece becomes something understood rather than something inherited.

* [ ] One container per component, each with its configuration file under `docker/observability/`.
* [ ] Persistent volumes under `docker_data/`.
* [ ] Retention: traces 3 days, logs 7 days, metrics 15 days with a size cap of a few GB — roughly 10–20 GB for all
  observability data together.
* [ ] Enable retention in Loki's compactor. Loki deletes nothing unless the compactor runs with retention enabled; a
  retention period on its own does nothing.
* [ ] Give Prometheus both a time limit and a size limit, so a sudden burst of series cannot fill the disk before the
  time limit applies. Tempo's retention is a compactor setting as well.

* [ ] Grafana data sources and dashboards provisioned from files.

**Done when:** the same checks as in Phases 2 to 4 pass without the all-in-one image.

---

## Later

* Tracing the Next.js server side, and browser monitoring with Grafana Faro.
* Exemplars — jumping from a spike on a metrics graph straight to a trace that caused it.

## Decisions

* **Alert delivery** — the Grafana UI while everything runs locally, and one push contact point (Telegram or Discord)
  once it runs unattended. Alerts never travel through the platform itself. See Phase 6.
* **Retention** — traces 3 days, logs 7 days, metrics 15 days plus a size cap, within roughly 10–20 GB in total. Traces
  are the heaviest at full sampling and only matter for problems being debugged now; metrics are small, and comparing
  before and after a change needs a couple of weeks. See Phase 7.
* **Nginx** — pass `traceparent` through first, then add `ngx_otel_module`. The gateway validates tokens, checks channel
  ids and guards HLS segments, and segment requests never reach a Node service, so without spans of its own that work
  stays invisible in traces. See Phase 3.

