# Open Video Platform

A video hosting platform — upload, watch, comment, rate, subscribe, search and recommendations — built as a set of
microservices in TypeScript.

It is a side project with a deliberate purpose: **learning backend architecture**. Microservices, DDD, event-driven
communication between them, and the scaling problems that follow. The architecture is the point, so designs here are
chosen to practise a pattern rather than to serve production traffic.

Inspired by [Open Streaming Platform](https://github.com/Open-Streaming-Platform/open-streaming-platform).

> [!WARNING]
> **Early development.** The codebase is a demo of what is planned rather than a working platform. It is currently
> being reworked from the ground up: the services are migrating to a DDD architecture and the features postponed the
> first time round are being built.
>
> Not yet present or not yet safe:
> * No frontend — `apps/ui` is empty.
> * Kafka brokers have no authentication.
> * gRPC requests have no authorization.
> * Video uploading and processing is in progress.
> * Search, recommendations and notifications do not exist yet.

## Documentation

The specification lives in [`docs/`](docs) and is the source of truth for everything below.

**Start at [docs/project-overview.md](docs/project-overview.md)** — the tech stack, the epic list and the build order.

| Where                                                       | What                                                               |
|-------------------------------------------------------------|---------------------------------------------------------------------|
| [docs/user-stories/](docs/user-stories)                     | 48 stories across 12 epics, one file each                            |
| [docs/open-decisions.md](docs/open-decisions.md)            | What the stories deliberately left unanswered                        |
| [docs/known-issues.md](docs/known-issues.md)                | Problems found in the existing implementation                        |
| [docs/infrastructure.md](docs/infrastructure.md)            | Setup requirements belonging to no single story                      |
| [docs/explainers/](docs/explainers)                         | Long-form reasoning behind the harder design decisions               |

The explainers are where the interesting parts are: HLS segment protection without a database lookup, the Kafka inbox
and outbox patterns, notification aggregation, SSE progress across several instances, the FFmpeg encoding ladder.

**On AI use:** the written material — the user stories, the explainers and this README — was produced with the help of
AI. The technical work is not: the architecture, the decisions behind it and the code are done by hand.

## Architecture

Each service owns its data and its database. They talk to each other in two ways: **Kafka** for events that others
react to (a rate was given, a channel was renamed, a video was published), and **gRPC** for synchronous questions that
need an answer inside a request. An **Nginx** gateway is the only entry point from outside — it validates the access
token, injects the user and channel ids, and routes to the service named in the path.

**APIs** — `auth`, `user`, `channel`, `video`, `video-upload`, `video-rate`, `comment`, `comment-rate`, `subscription`

**Workers** — `video-view-count`, `video-rate-count`, `video-comment-count`, `comment-rate-count`, `subscriber-count`

The workers exist because counters are not written on every click: rating a video emits an event, and a worker applies
whole Kafka batches to the database at once. Counts are eventually consistent by design, which several user stories
depend on.

**Specified but not built yet:** search, recommendations, notifications, the email module, `video-processing-worker`
and `comment-reply-count-worker`.

## Repository layout

```
apps/api/        one Nest application per API service
apps/workers/    one Nest application per Kafka consumer
apps/ui/         Next.js frontend (empty — not started)
lib/             shared code: Kafka, config, database, worker base classes
proto/           gRPC schema definitions and generated types
docker/          Compose setup and the Nginx gateway configuration
docs/            the specification — see above
infra/           superseded, pending deletion (see docs/known-issues.md)
```

A Yarn workspaces monorepo: `proto`, `lib/*` and `apps/**/*`.

## Running it

The local stack is mid-rework, so there is no single command that brings the whole platform up yet.

`docker/docker-compose.local.yml` starts the backing services — Postgres, Kafka with a UI, Redis, MinIO and tusd —
but predates the current design: it has no Keycloak, Elasticsearch or Gorse, and still defines the deprecated
file-server. The application services are run from the host.

The target setup — one `docker compose up` per environment, a database per service, healthchecks and init containers —
is specified in [docs/infrastructure.md](docs/infrastructure.md), with the reasoning in
[docs/explainers/environments-explained.md](docs/explainers/environments-explained.md).

Database migrations across every API, once the databases are up:

```bash
yarn api:migrate
```

## License

[MIT](LICENSE)
