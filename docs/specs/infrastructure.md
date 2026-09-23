# Infrastructure

Setup requirements for the local stack that do not belong to any user story. Observability has its own plan in
[observability-plan.md](observability-plan.md).

---

## Gateway prerequisites

What the gateway configuration (`../../docker/nginx/templates/default.conf.template`) needs from the rest of the stack
before
it can run.

* [ ] **tusd runs with `-behind-proxy`**, so it builds upload URLs from the `X-Forwarded-Host` and `X-Forwarded-Proto`
  headers the gateway sets. Without it, tusd hands the browser upload URLs that point at its own internal address.
* [ ] **MinIO presigns for `storage.localhost`** (`MINIO_SERVER_URL`). A presigned signature covers the host, so a URL
  signed for `minio:9000` fails when the browser requests it through the gateway.
* [ ] **auth-api exposes `/auth/verify`** for the gateway's subrequest: 200 with `User-ID` and `Channel-ID` response
  headers when the access token in the cookie is valid and `X-Channel-Id` is one of its channels; 401 for a missing
  or invalid token; 403 for a channel that does not belong to the account.
* [ ] **One nginx-s3-gateway instance per bucket** — `s3-gateway-videos` and `s3-gateway-avatars`. Check whether a
  single instance can serve several buckets before running two.
* [ ] **Shared secrets are set in the environment**: `HLS_SECURE_LINK_SECRET` for the gateway and video-api, and
  `TUS_WEBHOOK_SECRET` for the gateway and video-upload-api.

## Email module

Keycloak's built-in verification and reset emails are deliberately not used
([US-Auth-02](user-stories/auth/US-Auth-02-Account-confirmation.md)), so the platform sends its own. Seven stories
depend on this module — account confirmation, password reset, email change, channel and account deletion, notification
emails and localized emails — but none of them owns it, which is why it is described here.

What is decided:

* [ ] A dedicated **`email-worker`** using **nodemailer**, consuming "send this email" events from the services that
  need one, rather than sending inline in the request that triggered it. No user-facing request ever waits on mail
  delivery, and a failed send never fails the action that caused it ([service-map.md](service-map.md)).
* [ ] The worker looks up the recipient's address from `auth-api` and the email language from `account-api` at send
  time; the events carry the account id, not the address. The one exception is changing the address
  ([US-Account-02](user-stories/account/US-Account-02-Change-email.md)): the confirmation goes to an address the account
  does not have yet, and the notice to the one it no longer has, so those two events carry the address explicitly.
* [ ] **Handlebars** templates, living inside the worker. User-supplied content is rendered with the escaping `{{ }}`
  and never with `{{{ }}}` ([US-Notifications-03](user-stories/notifications/US-Notifications-03-Email-channel.md)).
* [ ] Every email is written in the account's email language, read together with the recipient's address
  ([US-I18n-03](user-stories/i18n/US-I18n-03-Localized-emails.md)), with English as the fallback for a template that
  has no translation.
* [ ] A local mail catcher in the Compose stack, so development mail is visible rather than sent or silently dropped.
  This is separate from the mail catcher the observability stack may use for alerts, which deliberately bypasses the
  platform ([observability-plan.md](observability-plan.md)).

Transport configuration, retry behaviour and template layout are settled while the module is built — they need no
decision in advance.

## Environments

One `docker compose up` per environment. The reasoning behind every item is explained in
[environments-explained.md](../explainers/environments-explained.md).

| Environment | Compose file                 | Postgres                                           | Apps                         |
|-------------|------------------------------|----------------------------------------------------|------------------------------|
| Preview     | `compose.yaml` (the default) | one shared server, a database and user per service | built images, in Docker      |
| Production  | `compose.prod.yaml`          | one server per service that needs one              | built images, in Docker      |
| Development | `compose.dev.yaml`           | one shared server, a database and user per service | on the host, with hot reload |

Structure:

* [ ] Compose pieces under `docker/compose/` — `infra.yaml`, `postgres.shared.yaml`, `postgres.isolated.yaml`,
  `apps.yaml`, `observability.yaml` — assembled by the top-level files with `include:`.
* [ ] Observability behind a Compose profile (`--profile observability`).
* [ ] One `docker/Dockerfile.nest` for every Nest app, selected with `ARG APP`, and a `docker/Dockerfile.ui` using the
  Next.js standalone output.
* [ ] `COMPOSE_FILE` in a machine's `.env` selects the environment, so a bare `docker compose up` works everywhere.

Rules:

* [ ] Every service has its own database, user and credentials in every environment, and a user can access only its own
  database — even on a shared server.
* [ ] The same environment variable names everywhere, with different values. No service decides where its database is
  from `NODE_ENV`.
* [ ] **Every connection pool has an explicit `max`.** `node-postgres` defaults to 10 per pool and each process has its
  own, so the total is services × instances × 10 — which passes Postgres's default `max_connections` of 100 well before
  the instance count looks interesting. Size it per service, raise `max_connections` deliberately rather than by
  accident, and add pgBouncer in transaction mode if instances ever grow past a handful
  ([scaling-to-multiple-instances.md](../explainers/scaling-to-multiple-instances.md)).
* [ ] Kafka topics owned per service, Redis keys prefixed per service, a MinIO bucket per purpose.

Startup order:

* [ ] Healthchecks on Postgres, Kafka, Keycloak, MinIO and Redis; apps depend on them with `service_healthy`.
* [ ] Every API and worker exposes a health endpoint and has a Compose healthcheck that uses it, so anything waiting
  on an app — the gateway, `docker compose up --wait`, the CI smoke test — waits until it can actually answer, not
  just until its process has started ([ci-with-github-actions.md](../explainers/ci-with-github-actions.md), Part 8).
* [ ] One-off init containers for dbmate migrations per database, Kafka topic creation, and MinIO buckets with their
  lifecycle rules; apps depend on them with `service_completed_successfully`.
* [ ] Keycloak imports `docker/keycloak/realm.json` on start.
* [ ] Elasticsearch runs from an image with the `analysis-ukrainian` plugin installed. Plugins are installed into the
  image before the node starts, not into a running container — a node without it refuses any index that uses the
  `ukrainian` analyzer ([US-Search-01](user-stories/search/US-Search-01-Search-videos.md)).

Development mode:

* [ ] Kafka has two listeners: an internal one for containers and an external one, on another port, for host apps.
* [ ] Keycloak has one pinned hostname (`KC_HOSTNAME`) that containers and host apps both use, so token issuers match.
* [ ] Containers reach host apps through `host.docker.internal` — on Linux also
  `extra_hosts: ["host.docker.internal:host-gateway"]` — and the nginx upstream hosts come from environment
  variables.
* [ ] MinIO's presign host is an environment variable per environment.
* [ ] One root command, such as `yarn dev`, starts every API, worker and the UI in watch mode.
