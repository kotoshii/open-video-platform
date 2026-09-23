# Open Video Platform

A video hosting platform: upload, watch, comment, rate, subscribe, search and recommendations. It was first built a
year ago as a set of microservices, and is now being reworked from scratch — the services move to a DDD architecture,
and the features postponed the first time round get built.

It is a side project, and its purpose is **learning backend architecture**: microservices, DDD, event-driven
communication, and the scaling problems that come with them. The architectural ambition is the point rather than an
accident, so designs here are chosen to practise a pattern, not to serve production traffic that does not exist.

[Figma](https://www.figma.com/design/VGVNL768fIPaiAKDH5bYNU/Open-Video-Platform-Mockups) \
[Specs Draft](https://docs.google.com/document/d/1w3OGQFO0zOfoknIgTX-Ki5ODx26wtgLixMBieLUYlbw/edit) (Google docs)

---

## Where everything is

| Document                                             | What it holds                                                    |
|------------------------------------------------------|------------------------------------------------------------------|
| [User stories](specs/user-stories)                   | 48 stories across 12 epics — the specification the build follows |
| [development-plan.md](development-plan.md)           | The order the stories are built in, stage by stage               |
| [open-decisions.md](open-decisions.md)               | Everything the stories deliberately left unanswered              |
| [known-issues.md](known-issues.md)                   | Problems found in the existing implementation                    |
| [service-map.md](specs/service-map.md)               | Which service owns which stories, data and workers — and why     |
| [architecture.md](specs/architecture.md)             | Every service, store, event and call, and the flows between them |
| [infrastructure.md](specs/infrastructure.md)         | Setup requirements that belong to no story                       |
| [observability-plan.md](specs/observability-plan.md) | Logs, metrics and traces, in the order they get built            |
| [explainers/](explainers)                            | Why a given design was chosen, at length — see below             |

### Epics

| Epic     | Stories | Epic            | Stories |
|----------|---------|-----------------|---------|
| Auth     | 6       | Search          | 3       |
| Channels | 7       | Subscriptions   | 3       |
| Comments | 6       | My activity     | 3       |
| Videos   | 5       | Notifications   | 3       |
| Account  | 4       | I18n            | 3       |
| UI/UX    | 3       | Recommendations | 2       |

### Explainers

* [Kafka deduplication and the inbox pattern](explainers/kafka-dedup-and-inbox-pattern.md) — why events are
  deduplicated, what is broken today, and the outbox on the publishing side
* [Protecting HLS segments without a database lookup](explainers/hls-segment-protection.md)
* [Keeping notifications from turning into a stream](explainers/notification-aggregation.md)
* [Upload progress across several instances: SSE and Redis pub/sub](explainers/sse-progress-and-redis-pubsub.md)
* [FFmpeg parameters for video processing](explainers/ffmpeg-processing-parameters.md) — the encoding ladder and every
  parameter behind it
* [Running more than one instance of everything](explainers/scaling-to-multiple-instances.md)
* [Continuous integration with GitHub Actions](explainers/ci-with-github-actions.md) — the two jobs, what the repo
  needs first, and running the whole stack on a free runner
* [Environments, explained](explainers/environments-explained.md) — how the Compose setups fit together
* [Observability, explained](explainers/observability-explained.md)
* [Kubernetes, explained](explainers/kubernetes-explained.md)

---

## Tech stack

**Language and apps**

* TypeScript
* Next.js + shadcn/ui (FE)
* Nest.js (BE)

**Data**

* PostgreSQL (primary DB)
* Kysely (DB query builder)
* Dbmate (DB migration tool)
* Redis (BullMQ queues, view deduplication, short-lived tokens and cooldowns, pub/sub for upload progress)
* Elasticsearch (video and channel search, similar videos)

**Communication**

* Kafka (events between services)
* gRPC (synchronous calls between services)

**Media**

* MinIO (S3 file storage)
* FFmpeg (video processing, thumbnail generation)
* Tus (resumable file uploading)
* Plyr + hls.js (player)
* Gorse (the recommended feed)

**Platform**

* Nginx (API gateway), with nginx-s3-gateway in front of the buckets
* Keycloak (identity provider)
* BullMQ (scheduled and background jobs)
* nodemailer + Handlebars (the platform's own email module)
* Docker, Docker Compose

Setup requirements for the local stack: [infrastructure.md](specs/infrastructure.md) — how environments are organised:
[environments-explained.md](explainers/environments-explained.md)

## Monitoring stack

* Grafana (dashboards, log and trace search, alerts)
* Alloy (collector: receives, collects and forwards all telemetry)
* Loki (logs)
* Prometheus (metrics)
* Tempo (traces)
* OpenTelemetry (instrumentation library inside the services, not a separate service)

See [observability-explained.md](explainers/observability-explained.md)
and [observability-plan.md](specs/observability-plan.md).

---

## Development plan

The order the stories are built in — Preparation, MVP and V1 — with the platform work placed around them:
[development-plan.md](development-plan.md).

## Ideas for later

* Playlists
* Save videos (like "Watch later")
* Ability to post pics/gifs in comments
* Ability to use the app anonymously (i.e. without logging in into account)
* Notifications about new videos from subscriptions
* List of your subscribers:
    * opens by clicking the subscriber amount on channel page
    * visible only to you
    * paginated
    * ability to search by channel name
    * ability to sort by subscription date ("recently subscribed" - default) or their own sub amount ("most popular")
