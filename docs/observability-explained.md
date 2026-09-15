# Observability, explained

What logs, metrics and traces are, what Grafana, Alloy, Loki, Prometheus, Tempo and OpenTelemetry each do, how they
connect, and the mistakes that are easy to make when setting them up for the first time.

The concrete steps for this project are in [observability-plan.md](./observability-plan.md).

---

## Part 1 — The three kinds of data

"Observability" means being able to tell what the system is doing without attaching a debugger to it. It rests on
three kinds of data, and each answers a different question.

### Logs — what happened, in words

```text
Failed to update comment rate counts: connection refused
```

One line per event. They are the easiest to understand and the hardest to use at scale, because they are text: to find
something you have to search through them.

### Metrics — how much, how often, how fast

```text
http_requests_total{service="video-api", status="500"}     = 17
kafka_consumer_lag{group="comment-rate-count-worker"}      = 12 408
```

Numbers measured over time. Nobody reads metrics one by one: they are drawn as graphs, and alerts fire when a number
crosses a line. They are cheap to store and fast to query, but they cannot tell you *why* something happened — only
that it did.

### Traces — where one request went, and where the time went

```text
POST /videos/42/rates                                  total 9.2s
├── nginx gateway                                      3ms
├── video-rate-api: save rate                          40ms
│   └── postgres INSERT                                12ms
└── kafka: VideoRateCreated
    └── video-rate-count-worker: apply batch           9.1s   ← here
        └── postgres UPDATE                            9.0s
```

A trace follows a single request through every service it touches and shows how long each step took. In a single
application you rarely need this. In a system split into services connected by Kafka it is the only practical way to
answer "why was this slow" or "where did this fail" — otherwise the answer is scattered across the logs of five
different containers with nothing linking them.

## Part 2 — What each tool actually does

| Tool | Its job | Stores data? |
|---|---|---|
| **OpenTelemetry** | The standard way code *produces* logs, metrics and traces, plus the protocol (OTLP) used to send them. It is a set of libraries, not a server. | No |
| **Alloy** | The collector. It receives data from services, collects logs from containers, scrapes metrics from infrastructure, and forwards each kind to the right store. Grafana's distribution of the OpenTelemetry Collector. | No |
| **Loki** | Stores logs. | Yes |
| **Prometheus** | Stores metrics. | Yes |
| **Tempo** | Stores traces. | Yes |
| **Grafana** | The screen: dashboards, log search, trace views, alerts. It reads from the three stores. | No |

Three stores, one for each kind of data. One collector in front of them. One screen on top.

### What "Grafana.log()" really was

At work it looks as though code sends logs to Grafana. It does not. Grafana never receives a single log line.

What happens is:

1. The code writes a log line — to standard output, or through a logging library.
2. A collector picks it up and sends it to Loki.
3. Grafana, when someone opens it, asks Loki for logs and shows them.

Everything between step 1 and step 3 was set up by somebody else, which is why it felt like one call. Setting it up
yourself means building exactly that middle part.

## Part 3 — How it all connects

```text
 NestJS services and workers ──(OpenTelemetry SDK: traces, metrics)──┐
 every container's stdout ───────────(logs)──────────────────────────┤
 Postgres, Redis, Kafka, Nginx, MinIO ──(metrics, scraped)────────────┤
                                                                      ▼
                                                                    Alloy
                                                     ┌────────────────┼────────────────┐
                                                     ▼                ▼                ▼
                                                   Loki           Prometheus         Tempo
                                                  (logs)          (metrics)        (traces)
                                                     └────────────────┼────────────────┘
                                                                      ▼
                                                                   Grafana
```

The important property: **services only ever talk to the collector.** Which store receives what, and whether that store
is replaced one day, is decided in one configuration file — not in every service.

## Part 4 — The thread that ties them together: the trace id

On their own, the three kinds of data are three separate piles. What makes them one picture is a **trace id** — a
random identifier created when a request enters the system and carried along everywhere it goes.

* Every span of the trace carries it.
* Every log line written while handling that request carries it too.

Then, in Grafana:

* From a slow trace, one click shows every log line written during that request, across all services.
* From an error log line, one click opens the full trace it belongs to.

That jump between logs and traces is most of the value of the whole setup. It only works if the trace id is actually
in the logs, which is why it is the very first thing to get right.

## Part 5 — Traces across Kafka

In a normal HTTP call, the trace id travels in a request header (`traceparent`) and the next service continues the same
trace automatically.

Kafka is where this silently breaks. A message is not a request: if nothing puts the trace id into the message, the
worker that consumes it has no idea which trace it belongs to and starts a brand-new one. The trace ends at the
producer, and the most interesting part — what the worker did — becomes disconnected.

The fix is to carry the trace context in the **Kafka message headers**. OpenTelemetry's `kafkajs` instrumentation is
meant to do this; it is still worth checking that producer and consumer really do end up in the same trace.

Batch consumers add a twist. A worker that processes a batch of 200 messages is doing work for 200 different traces at
once. One span cannot have 200 parents, so the batch span uses **span links** instead: it points to each message's
trace rather than belonging to one of them. This is exactly the situation of every count worker in this project.

## Part 6 — Labels, and why they are dangerous

Both Loki and Prometheus organise data by **labels** — small key-value pairs such as `service="video-api"` or
`level="error"`. Every distinct combination of label values becomes its own separate stream (Loki) or series
(Prometheus).

That is harmless while the values are few. It is a disaster when they are not:

* `service="video-api"` — maybe 15 possible values across the project. Fine.
* `video_id="8f3a…"` — one value per video, forever. Every video creates a new stream or series.

This is called **high cardinality**, and it is the single most common way to make these tools slow, expensive, and
eventually unusable.

The rules that follow from it:

* **Loki:** labels only for things with a small, fixed set of values — service, level, environment. Ids, user input and
  URLs go *inside* the log line, where they can still be searched.
* **Prometheus:** never put ids or raw URLs into labels. Use the route template, `/videos/:id`, not `/videos/8f3a…`.

Loki in particular is not Elasticsearch. It indexes labels only, not the text of the logs, and searches the text by
scanning. That is what makes it cheap — and it is why labels have to stay small.

## Part 7 — Metrics are pulled, not pushed

Most people expect services to send metrics to Prometheus. Classic Prometheus works the other way round: every service
exposes a page of current numbers, and Prometheus **scrapes** those pages every few seconds.

With OpenTelemetry in the middle, services can instead push metrics to the collector, and the collector hands them on to
Prometheus. Both approaches work. Knowing that pulling is the default explains a lot of Prometheus documentation that
otherwise looks backwards.

## Part 8 — Mistakes worth avoiding from day one

* **Logging secrets.** Authentication in this project lives in cookies. A careless "log the incoming request" line
  stores access tokens in Loki, where anyone with Grafana access can read them.
* **Free-text logs.** A line like `"user 42 failed to upload"` can only be searched as text. Structured JSON —
  `{"msg":"upload failed","channelId":"42"}` — can be filtered by field.
* **Logs without a trace id.** Everything in Part 4 depends on it.
* **High-cardinality labels.** Part 6.
* **Starting OpenTelemetry too late.** The SDK has to be initialised before the application's own modules are loaded,
  otherwise libraries like `pg` or `kafkajs` are already imported and never get instrumented. The symptom is traces
  that contain the HTTP layer but nothing below it.
* **Dashboards built by clicking.** A dashboard made in the Grafana UI disappears when the container is recreated,
  unless it is exported and provisioned from a file in the repository.
