# Environments, explained

How one repository runs as production, as a preview anyone can start on their machine, and as a development setup with
hot reload — and why each piece of the setup exists.

The checklist version is the Environments section of [infrastructure.md](../specs/infrastructure.md).

---

## Part 1 — Three situations, one command

The project needs to run in three different situations:

* **Production** — the real thing. Every service's data is isolated on its own database server.
* **Preview** — someone clones the repository and wants to see the whole platform working. They should not need nine
  database servers for that. Shared infrastructure is fine.
* **Development** — you are writing code. The infrastructure should run in Docker, but the APIs, workers and UI should
  run straight on your machine with hot reload, because rebuilding an image after every change is far too slow.

The goal is that each of them starts with a single `docker compose up`.

## Part 2 — What changes between them, and what must not

It is tempting to make the code aware of the environment: "if production, connect to this database; otherwise, that
one". Avoid it.

**What changes between environments is only where things run.** How services are configured does not change at all.
Every service always receives the same settings — a database URL, a Kafka address, a Redis address — and only the values
differ. A service never asks "which environment am I in?"; it simply connects to whatever it was given.

This keeps the code identical everywhere. A bug that only shows up in production because of an `if (NODE_ENV === ...)`
branch cannot happen, because there is no such branch.

## Part 3 — A database per service, even on a shared server

This is the most important idea in the whole setup.

Postgres has three levels that are easy to mix up:

* a **server** — one running Postgres process;
* a **database** — a separate set of tables inside a server;
* a **user** — credentials that are allowed into certain databases.

In **production**, each service gets its own server. In **preview and development**, all services share one server —
but each still gets **its own database and its own user**, and each user is only allowed into its own database.

Walk through what that means for `video-api`:

1. On start-up of the shared server, an init script creates a database `video` and a user `video_api`.
2. The user `video_api` is granted access to `video` and nothing else.
3. `video-api` receives `DATABASE_URL=postgres://video_api:...@postgres:5432/video`.
4. If someone writes a query in `video-api` that reaches into the `comments` database, it fails — in preview, in
   development, and in production alike.

Step 2 is the one that does not happen by itself. **Postgres grants `CONNECT` on every new database to `PUBLIC`**, so
by default every user can open a connection to every database on the server, and the isolation above does not exist.
It has to be revoked explicitly:

```sql
CREATE DATABASE video;
CREATE USER video_api WITH PASSWORD '...';

-- without this, any user on the server can connect to this database
REVOKE CONNECT ON DATABASE video FROM PUBLIC;
GRANT CONNECT ON DATABASE video TO video_api;

-- from Postgres 15, PUBLIC can no longer create in the public schema,
-- so the owning user needs it granted
\connect video
GRANT ALL ON SCHEMA public TO video_api;
```

Run one of those blocks per service from an init container, which is what
[infrastructure.md](../specs/infrastructure.md) means by a database, user and credentials per service. The `REVOKE` line
is
easy to leave out and impossible to notice: everything works, and nothing is isolated.

That last point is why this matters for an architecture built around separate services. If preview simply let every
service use one shared database, nothing would stop a quick cross-service join from sneaking in. It would work perfectly
on every developer's machine and break only in production, where the databases really are separate. With a database and
user per service, the boundaries are enforced everywhere, and **production is not the first place they are tested.**

The same idea applies to the rest of the infrastructure: Kafka topics are owned by one service, Redis keys carry a
per-service prefix, and each kind of file has its own MinIO bucket.

## Part 4 — How the Compose files fit together

Docker Compose can build one configuration out of several files. Instead of one huge file with conditions, the setup is
split into pieces, and each environment is a small file that lists which pieces it uses.

```text
docker/compose/infra.yaml               Kafka, Redis, MinIO, Keycloak, tusd, Gorse, nginx, s3-gateways
docker/compose/postgres.shared.yaml     one Postgres server, a database and user per service
docker/compose/postgres.isolated.yaml   one Postgres server per service
docker/compose/apps.yaml                the APIs, workers and UI as built images, plus migrations
docker/compose/observability.yaml       Grafana, Alloy, Loki, Prometheus, Tempo
```

The top-level files pull these in with Compose's `include:`:

| File                     | Pieces it includes                          |
|--------------------------|---------------------------------------------|
| `compose.yaml` (preview) | infra, postgres.shared, apps                |
| `compose.prod.yaml`      | infra, postgres.isolated, apps              |
| `compose.dev.yaml`       | infra, postgres.shared — and no apps at all |

`compose.yaml` is the name Docker Compose looks for by default, which is why preview gets it: a stranger who clones the
repository types `docker compose up` and gets the preview. On a production machine, one line in its `.env` —
`COMPOSE_FILE=compose.prod.yaml` — makes that same bare command start production instead.

Compose also has **profiles**, which switch individual services on and off. They are perfect for optional extras:
observability is heavy and not always wanted, so it sits behind `--profile observability`. They are a poor fit for
switching between one shared Postgres and many isolated ones — that turns into a tangle of conditions quickly. Separate
files per environment keep each one readable on its own.

## Part 5 — Why a single `docker compose up` usually fails

The configuration is rarely the problem. **Start-up order** is.

Compose starts containers roughly at the same time. So `video-api` starts, tries to connect to Postgres, and Postgres is
still initialising. `video-api` crashes. Kafka takes even longer. Keycloak longer still.

`depends_on` alone does not fix it: by default it only waits for a container to *start*, not for the service inside to
be *ready*. Three tools do fix it:

1. **Healthchecks.** Postgres, Kafka, Keycloak, MinIO and Redis each get a small command that answers "am I ready yet?".
   Apps then use `depends_on` with `condition: service_healthy`, and wait for a real answer.
2. **One-off init containers.** Some things have to exist before any app runs: database migrations, Kafka topics, MinIO
   buckets and their lifecycle rules. Each of these is a container that does its job and exits. Apps depend on them with
   `condition: service_completed_successfully`, so they start only after the job has actually succeeded.
3. **Imported configuration.** Keycloak imports a realm file from the repository on start, so nobody has to click
   through
   its admin console on a fresh machine.

On a cold start, the order then falls out by itself: infrastructure → healthy → init jobs → finished → apps → gateway.

Kafka topics deserve a note of their own: do not rely on Kafka creating them automatically the first time something
writes to them. Topics created that way get default settings — partition count included — which then quietly decide how
far the consumers can scale.

## Part 6 — Development mode: the boundary goes both ways

In development, the infrastructure runs inside Docker and the apps run on your machine. Traffic crosses that boundary in
**both directions** — apps call Kafka and Postgres in Docker, and nginx and tusd in Docker call the apps on your
machine.
Four things break because of it.

### Kafka's advertised address

When a client connects to Kafka, Kafka replies with the address the client should use from then on. If Kafka answers
`kafka:9092`, apps on your machine cannot resolve that name. If it answers `localhost:9092`, containers cannot reach
it, because inside a container `localhost` is the container itself.

The fix is two **listeners**: an internal one that answers `kafka:9092` for containers, and an external one on another
port that answers `localhost` for your machine. Each client connects to the one that makes sense from where it runs.

### Keycloak's issuer

Every token Keycloak issues records the address it was issued from, in its `iss` field. A token issued through
`localhost:8080` and one issued through `keycloak:8080` therefore look different, and validation rejects a token whose
issuer does not match what it expects. Symptoms: logging in works, and every API call afterwards returns 401.

The fix is to pin one hostname for Keycloak (`KC_HOSTNAME`) that both containers and your machine use.

### Containers calling your machine

Nginx has to forward requests to the APIs, and tusd has to call video-upload-api's hooks — but those apps now run on
your
machine, not in Docker. Inside a container, the special name `host.docker.internal` means "the machine Docker runs on".
Docker Desktop provides it automatically; on Linux, add
`extra_hosts: ["host.docker.internal:host-gateway"]` to the container.

The nginx configuration is already a template filled from environment variables, so its upstream hosts become variables
too: `video-api:3000` in preview, `host.docker.internal:3004` in development. Still one configuration file.

### Presigned URLs

A presigned MinIO URL is only valid for the host it was signed for, and the host the browser uses differs between
environments. It has to be a setting per environment, like everything else.

### Starting the apps

Nine APIs, five workers and a UI is too much to start in separate terminals. A single root command — `yarn dev` —
should start them all in watch mode, with each app's output prefixed by its name. A monorepo task runner such as
Turborepo handles this well.

## Part 7 — What "production" on one machine is, and is not

Production with Compose on a single machine gives real isolation: separate database servers, separate credentials,
nothing shared by accident.

It does not give redundancy or scaling across machines — if that machine stops, everything stops. That is fine for what
this project is practising, and nothing in this layout has to be redesigned to move it to an orchestrator such as
Kubernetes later: the pieces, the per-service configuration and the start-up rules all carry over.
