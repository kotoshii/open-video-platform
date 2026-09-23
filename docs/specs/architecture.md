# Architecture

The target architecture of Open Video Platform, gathered in one place from the user stories, the
[service map](service-map.md), [infrastructure.md](infrastructure.md), the
[observability plan](observability-plan.md), the explainers and the tasks. It is a reference for drawing the
architecture diagrams: every box, every arrow and every store is listed here, with the protocol on each arrow.

It describes the platform **as specified**, not the code as it is today. Where today's code differs in a way that
matters for a diagram, that is said in a short "Today" note.

Some names are left to implementation by the specs — Kafka topic names, event type names, gRPC method names, table
names, queue names. This document uses **working names** for them so the diagrams can be labelled consistently. They
are written in `code` and are suggestions, not decisions; everything else is taken from the specs.

---

## Contents

1. [How to draw it](#1-how-to-draw-it)
2. [System context](#2-system-context)
3. [Containers at a glance](#3-containers-at-a-glance)
4. [The edge: nginx gateway](#4-the-edge-nginx-gateway)
5. [Identity model](#5-identity-model)
6. [Services](#6-services)
7. [Workers](#7-workers)
8. [Infrastructure components](#8-infrastructure-components)
9. [Data stores](#9-data-stores)
10. [Event catalogue](#10-event-catalogue)
11. [gRPC catalogue](#11-grpc-catalogue)
12. [Patterns used everywhere](#12-patterns-used-everywhere)
13. [Flows](#13-flows)
14. [Front end](#14-front-end)
15. [Environments and deployment](#15-environments-and-deployment)
16. [Observability](#16-observability)
17. [Security](#17-security)
18. [CI](#18-ci)

---

## 1. How to draw it

One diagram cannot hold all of this legibly. A set of views that each answer one question works better:

| View | Shows | Built from |
|---|---|---|
| **Context** | The browser, the email inbox, the platform as one box, SMTP | §2 |
| **Containers** | Every service, worker and infrastructure container, grouped by owner, with the protocol on every arrow | §3, §6–§9 |
| **Edge** | The gateway's routes: what goes to which service, what goes to MinIO, what skips token verification | §4 |
| **Events** | Kafka producers on the left, topics in the middle, consumers on the right | §10 |
| **Synchronous calls** | The gRPC call graph | §11 |
| **Data ownership** | Each service with its own database, and the copies other services keep of its data | §9, §12.4 |
| **Video pipeline** | Upload → tusd → MinIO → processing → HLS → player | §13.6–§13.8 |
| **Deletion** | The channel purge saga and the account purge above it | §13.16–§13.17 |
| **Deployment** | The three Compose environments and what runs where | §15 |
| **Observability** | Services → Alloy → Loki / Prometheus / Tempo → Grafana | §16 |

A legend that keeps them consistent:

| Arrow | Meaning |
|---|---|
| solid, labelled `HTTP` | a request through the gateway, or tusd calling a hook |
| solid, labelled `gRPC` | a synchronous question between services, with an API key |
| dashed, labelled with an event name | a Kafka event, published through the outbox unless noted |
| dotted | a read from or write to a store the service owns (Postgres, Redis, MinIO, Elasticsearch, Gorse) |
| double | Redis pub/sub |

Colour by owner: each API and the workers that belong to it (§7) share a colour, since a worker writes its owner's
database with its owner's credentials.

---

## 2. System context

```text
                    ┌───────────────┐
   Viewer / author  │   Browser     │  Next.js UI, HLS player, tus client, EventSource
                    └──────┬────────┘
                           │ HTTPS (one origin: UI, /api, /tus, /hls, /thumbnails, /avatars)
                           │ HTTPS (storage.localhost: presigned downloads)
                    ┌──────▼────────────────────────────────────────────┐
                    │                 Open Video Platform               │
                    │  nginx gateway · 13 APIs · 9 workers · Keycloak   │
                    │  Kafka · Postgres · Redis · MinIO · Elasticsearch │
                    │  Gorse · tusd · observability stack               │
                    └──────┬────────────────────────────────────────────┘
                           │ SMTP (email-worker → mail catcher in preview/dev, a real server in production)
                    ┌──────▼────────┐
                    │  Email inbox  │  confirmation, reset, email change, deletion, notification emails
                    └───────────────┘
```

* **One kind of user**: a registered account that acts as one of its channels at a time
  ([US-Channels-02](user-stories/channels/US-Channels-02-freely-switch-between-channels.md)). There is no anonymous
  viewing.
* **External to the platform**: the user's browser and inbox, and an SMTP server in production. Everything else,
  Keycloak included, runs inside the stack.
* Alerts leave the platform on their own path — Grafana to a Telegram or Discord webhook — never through the
  platform's email or Kafka ([observability-plan.md](observability-plan.md), Phase 6).

---

## 3. Containers at a glance

### 3.1 APIs (Nest.js)

| Service | Status | Owns | Own stores | Stories |
|---|---|---|---|---|
| `auth-api` | exists, migrated | Identity: sign-up, login, tokens, sessions, passwords, the email address and its confirmation; every write to Keycloak | Postgres (session details, from US-Auth-05), Redis (tokens, cooldowns), Keycloak | Auth-01…06, Account-02, 03 |
| `account-api` | exists as `user-api`, renamed | The account record, the email language, account deletion, data export | Postgres, Redis, MinIO `exports` | Account-01, 04, I18n-03 |
| `channel-api` | exists, migrated | Channels, their settings, channel deletion and its purge saga | Postgres, Redis, MinIO `avatars` | Channels-01…07 |
| `video-upload-api` | exists, migrated | Upload sessions, tus hooks, upload and processing progress over SSE | Postgres, Redis (pub/sub, BullMQ) | Videos-05 (upload) |
| `video-api` | exists, migrated | Videos, visibility, publishing, watching, downloads, a channel's video list and its search | Postgres, Redis, MinIO `videos` | Videos-01, 02, 03, 05; Channels-04; Search-03; Subscriptions-03 |
| `video-rate-api` | exists, migrated | Video likes and dislikes | Postgres | Videos-04, My-activity-02 |
| `comment-api` | exists, migrated | Comments and replies, threads, pinning, `?comment=` links | Postgres | Comments-01…05, My-activity-03 |
| `comment-rate-api` | exists, migrated | Comment likes and dislikes | Postgres | Comments-06 |
| `subscription-api` | exists, migrated | Subscriptions | Postgres | Subscriptions-01…03 |
| `watch-history-api` | new | Watch history and its pause flag | Postgres | My-activity-01 |
| `notification-api` | new | Notification preferences, in-app notifications, email batching | Postgres | Notifications-01…03 |
| `search-api` | new | The Elasticsearch indices for videos and channels | Elasticsearch; Postgres for its inbox only | Search-01, 02, Recommendations-02 |
| `recommendation-api` | new | The feed, and the feedback sent to Gorse | Gorse; Redis (feed snapshots); Postgres for its inbox | Recommendations-01 |

### 3.2 Workers

| Worker | Belongs to (writes its database) | Status | Does |
|---|---|---|---|
| `video-view-count-worker` | `video-api` | exists | Counts views, one per viewer per video per 24 hours; publishes the new counts |
| `video-rate-count-worker` | `video-api` | exists | Applies video like and dislike counts |
| `video-comment-count-worker` | `video-api` | exists | Applies each video's comment total, replies included |
| `comment-rate-count-worker` | `comment-api` | exists | Applies comment like and dislike counts |
| `comment-reply-count-worker` | `comment-api` | new | Applies each comment's reply count |
| `subscriber-count-worker` | `channel-api` | exists | Applies each channel's subscriber count; publishes the new counts |
| `video-processing-worker` | the video pipeline (no database) | new | Probes, encodes, packages HLS, makes thumbnails and seek previews (BullMQ, FFmpeg) |
| `notification-worker` | `notification-api` | new | Creates, aggregates and counts down notifications; sends and gathers notification emails |
| `email-worker` | none (no database) | new | Sends every email: templates, nodemailer, address and language looked up at send time |

### 3.3 Infrastructure

| Container | Role |
|---|---|
| nginx gateway | The only entry point: routes, token verification, HLS secure links, tus proxying, presigned storage host |
| Keycloak | Identity provider: users, passwords, sessions, tokens; realm imported from `docker/keycloak/realm.json` |
| Kafka (+ Kafka UI) | Events between services; SASL/SCRAM, one user per service |
| PostgreSQL | One database and user per service (one shared server in preview/dev, one server per service in production) |
| Redis | BullMQ queues, tokens and cooldowns, view deduplication, upload-progress pub/sub, feed snapshots, Gorse cache; `noeviction` |
| MinIO | S3 storage; buckets `videos`, `avatars`, `exports` |
| `s3-gateway-videos`, `s3-gateway-avatars` | nginx-s3-gateway: serve private buckets to the gateway with SigV4 |
| tusd | Resumable uploads into the `videos` bucket; HTTP hooks into `video-upload-api` |
| Elasticsearch | Video and channel search, similar videos; image with the `analysis-ukrainian` plugin |
| Gorse | Recommender; its data in its own Postgres database, its cache in Redis |
| Mail catcher (Mailpit) | Receives all mail in preview and development |
| Init containers | dbmate migrations per database, Kafka topics and users, MinIO buckets and lifecycle rules |
| Observability | `grafana/otel-lgtm` first; later Alloy, Loki, Prometheus, Tempo, Grafana (§16) |
| `ui` | The Next.js app, standalone output |

---

## 4. The edge: nginx gateway

One nginx container is the only way in. Its configuration is one template,
`docker/nginx/templates/default.conf.template`, rendered by the official image's envsubst; the upstream hosts come
from environment variables, so the same template serves every environment
([infrastructure.md](infrastructure.md), environments).

### 4.1 Servers and routes

| Server | Path | Goes to | Checks |
|---|---|---|---|
| main origin | `/` | `ui` (Next.js; WebSocket upgrade for hot reload in development) | none |
| main origin | `/api/<prefix>/…` | the API that owns the prefix (§4.2) | token verification, except the public routes (§4.3) |
| main origin | `/api/…/events` on `video-upload-api` | SSE stream | token verification; `proxy_buffering off`, `proxy_cache off`, long `proxy_read_timeout` |
| main origin | `/tus/` | tusd | token verification; injects `User-ID`, `Channel-ID`, `Tus-Webhook-Secret`, `X-Forwarded-Host`, `X-Forwarded-Proto`; strips `Authorization`; request buffering off, no body size limit, long timeouts; a `POST` without `Upload-Metadata` gets 400 |
| main origin | `/hls/{expires}/{token}/{videoId}/…` | `s3-gateway-videos` → `{videoId}/hls/…` | `secure_link` (§4.5); playlists cached seconds, segments cached days; the cache key leaves the token out |
| main origin | `/thumbnails/{videoId}.jpg?v={version}` | `s3-gateway-videos` → `{videoId}/thumbnail.jpg` | none — public by design; the version is in the cache key |
| main origin | `/avatars/{name}` | `s3-gateway-avatars` | none — public |
| main origin | `/api/docs` | one Swagger UI with a dropdown per API | — |
| `storage.localhost` (the real host in production) | `/` | MinIO directly, Host passed unchanged, `GET`/`HEAD` only | the presigned signature (downloads, data export) |

Everything under `hls/` in a video's prefix is reachable only with a valid token, and only `hls/` and `thumbnail.jpg`
are exposed at all — an explicit allowlist, never a wildcard over the prefix, or the original upload leaks
([open-decisions.md](../open-decisions.md), traps). The seek preview sprites and their WEBVTT file live under
`hls/previews/`, so the same token covers them.

Upstreams are resolved on every request (`resolver 127.0.0.11 valid=10s` and a variable in `proxy_pass`), so a
service scaled to several instances gets traffic on all of them
([scaling-to-multiple-instances.md](../explainers/scaling-to-multiple-instances.md), Part 4).

### 4.2 API prefixes

Each API owns the prefixes of its endpoints. The gateway maps `/api/<prefix>` to the owner:

| Prefix | Service |
|---|---|
| `/api/auth` | `auth-api` |
| `/api/accounts` | `account-api` |
| `/api/channels` | `channel-api` |
| `/api/video-uploads` | `video-upload-api` |
| `/api/videos` | `video-api` |
| `/api/video-rates` | `video-rate-api` |
| `/api/comments` | `comment-api` |
| `/api/comment-rates` | `comment-rate-api` |
| `/api/subscriptions` | `subscription-api` |
| `/api/watch-history` | `watch-history-api` |
| `/api/notifications` | `notification-api` |
| `/api/search` | `search-api` |
| `/api/feed` | `recommendation-api` |

Today: the template routes `/api/auth/`, `/api/user/`, `/api/channel/`, `/api/video/`, `/api/video-rate/`,
`/api/video-upload/`, `/api/comment/`, `/api/comment-rate/` and `/api/subscription/`, and the whole of `/api/auth/`
is public.

### 4.3 Public routes

These skip token verification:

| Route | Why public |
|---|---|
| `POST /auth/sign-up`, `POST /auth/login`, `POST /auth/refresh` | no session yet, or the access token has expired |
| `POST /auth/password-reset/request`, `POST /auth/password-reset/confirm` | the user cannot sign in |
| `POST /auth/email-change/confirm` | the change ends every session, and the page then asks for the password anyway |

Every other API route requires a valid access token — the email confirmation link and the channel and account deletion
links included. A page that needs a session, opened without one, sends the user to log in (and to pick a channel if the
account has several) and then back to the page, whose flow continues (§14). A link opened while signed in to a
different account is refused.

### 4.4 Token verification

The gateway verifies the access token itself — no subrequest to `auth-api` — and passes the result on as headers.
Services never parse tokens ([infrastructure.md](infrastructure.md), gateway prerequisites).

1. On every route, clear `User-ID`, `Channel-ID`, `Session-ID`, `Birthdate` and `Email-Verified` from the incoming
   request, so a client cannot forge them.
2. Read the access token from its httpOnly cookie.
3. Verify the RS256 signature against Keycloak's JWKS (cached; fetched again once on an unknown key id), then the
   expiry and the issuer.
4. If the request carries `X-Channel-Id`, check that it is one of the token's `channelIds`.
5. Set `User-ID` (the account), `Channel-ID` (the acting channel), `Session-ID` (the token's `sid`), `Birthdate` and
   `Email-Verified`, and proxy.

Outcomes: `401` for a missing, malformed, expired or badly signed token; `403` for a channel id that is not the
account's. How nginx verifies — njs with WebCrypto, a third-party module or OpenResty — is the subject of a Spike
(`_platform/infrastructure` Task-16); the behaviour above is decided.

Today: the template sends every request to `auth-api /auth/verify` through `auth_request`.

### 4.5 HLS secure links

* The watch endpoint returns `/hls/{expires}/{token}/{videoId}/master.m3u8`, where
  `token = base64url(md5("{videoId}{expires} {secret}"))` — the space before the secret is part of the string, and
  `expires` is Unix seconds, generous (hours) so it does not lapse mid-playback.
* nginx recomputes the hash with `secure_link` / `secure_link_md5` and the shared `HLS_SECURE_LINK_SECRET`: a
  mismatch gets `403`, an expired link `410`. No database, no call to any service.
* The master playlist and the per-quality playlists use relative URLs, so every segment request carries the same
  prefix and is checked the same way — about 150 checks for a 10-minute video, all inside nginx.
* Every video is tokenized, public ones included, and the token is not bound to the IP.

Details: [hls-segment-protection.md](../explainers/hls-segment-protection.md).

### 4.6 Other rules

* `traceparent` passes through unchanged; the gateway gets spans of its own later with `ngx_otel_module` (§16).
* Access logs are JSON, with the HLS token masked and no cookies, `Authorization` header or query strings.

---

## 5. Identity model

```text
Keycloak user  ──(1:1)──  account (account-api)  ──(1:N, max 10)──  channels (channel-api)
     │                                                                   │
     │ access token claims: sub, sid, email_verified, birthdate,         │ the channel a request acts as:
     │ channelIds[]                                                      │ X-Channel-Id header, checked
     ▼                                                                   ▼ against channelIds by the gateway
  gateway → User-ID, Session-ID, Email-Verified, Birthdate, Channel-ID → services
```

* **Account.** The identity lives in Keycloak; `account-api` keeps the account record under the same id. The email
  address and the password exist only in Keycloak, so anything that needs the address asks `auth-api` over gRPC.
* **Channel.** An account has up to 10 channels and acts as one at a time. Everything a user does — uploading,
  commenting, rating, subscribing, watching, being notified — belongs to the acting channel, never to the account.
  Another channel of the same account is a separate identity.
* **Tokens.** Keycloak issues an access token (5 minutes) and a rotating refresh token; the session survives 30 days
  without activity. `auth-api` puts both into httpOnly, `Secure`, `SameSite` cookies from one place; the browser never
  reads them. The access token carries `channelIds` and `birthdate` as custom claims next to `email_verified`.
* **The acting channel is not in the token.** The UI keeps it in localStorage (mirrored into a cookie so the server
  can render the right shell) and sends it as `X-Channel-Id`. Switching channels needs no new token. Creating a
  channel does: `channel-api` asks `auth-api` to add the id to `channelIds` synchronously, and the UI refreshes its
  tokens before acting as the new channel.
* **Age** is computed from `Birthdate` wherever it is needed, with no call. The channel's own "Show age-restricted
  content" preference comes from `channel-api` over gRPC, cached for a few seconds by each caller.
* **Unconfirmed email** blocks only three things: deleting a channel, deleting the account, and turning on
  notification emails. Keycloak's "Verify Email" required action stays off, or it would refuse tokens to such users.
* **Brute force**: Keycloak's realm protection counts wrong passwords — from login, from changing the password and
  from the data export's password check — and a lockout blocks login too.

---

## 6. Services

Every API follows the same inner layout: `src/modules/<context>/` with `domain/` (entities, repository interfaces,
injection tokens), `application/` (one use case per operation, DTOs, mappers), `infrastructure/` (Kysely
repositories) and `presentation/` (HTTP controllers, gRPC handlers and Kafka consumers — every way in), plus
`db/migrations` (dbmate). Every service writes events through its outbox and consumes through its inbox (§12), reads
the gateway's identity headers through `lib` decorators, and rejects a request without `Channel-ID` unless the
endpoint is marked as working without a channel.

Endpoint paths below are relative to `/api`.

### 6.1 auth-api

The only service that talks to Keycloak.

* **Stores**
    * Keycloak (admin API): users with the email as login identifier, the password, `email_verified`, the `birthdate`
      and `channelIds` attributes, sessions.
    * Postgres: one row per Keycloak session with the user agent, the device and OS parsed from it, the IP, and the
      country and city from GeoIP (from US-Auth-05). No other tables.
    * Redis: confirmation token (24 h, one per account), confirmation resend cooldown (60 s), reset token (30 min),
      reset cooldown per email address (60 s, started for unregistered addresses too), email-change token (5 min,
      bound to the account and the new address), email-change cooldown (5 min).
* **HTTP**

    | Endpoint | Does |
    |---|---|
    | `POST /auth/sign-up` (public) | The sign-up saga (§13.1); `409` field error when the email is taken |
    | `POST /auth/login` (public) | Keycloak direct grant; `401` without saying which half was wrong; an unconfirmed email logs in normally |
    | `POST /auth/refresh` (public) | Keycloak token endpoint, rotating the refresh token; on rejection clears the cookies and answers `401`, with its own code when the user no longer exists |
    | `POST /auth/logout` | Ends the Keycloak session named by `Session-ID`; clears the cookies |
    | `GET /auth/current-user` | The email, whether it is confirmed, the birthdate and the channel ids, read from Keycloak |
    | `GET /auth/email-confirmation` | Whether the email is confirmed, and the seconds left on the resend cooldown |
    | `POST /auth/email-confirmation/resend` | New token in place of the old one, cooldown restarted, email sent |
    | `POST /auth/email-confirmation/confirm` | Checks the token is the signed-in account's, consumes it, sets `email_verified`, refreshes the current session |
    | `POST /auth/password-reset/request` (public) | Cooldown for the address; token and email only if the account exists; the same answer either way |
    | `POST /auth/password-reset/confirm` (public) | Checks the password rules, consumes the token, sets the password and `email_verified` together, ends every session |
    | `POST /auth/email-change` · `GET /auth/email-change` | Starts an email change (confirmation to the new address) · the cooldown left |
    | `POST /auth/email-change/confirm` (public) | Changes the email in Keycloak keeping it verified, ends every session, sends a notice to the old address |
    | `PUT /auth/password` | Checks the current password with a direct grant (ending that check's session at once), sets the new one, ends every other session, refreshes the current one |
    | `GET /auth/sessions` · `DELETE /auth/sessions/{id}` · `DELETE /auth/sessions/others` | Session management: the account's Keycloak sessions joined with the stored device rows, the current one first |

* **gRPC exposed** — `GetAccountEmail` (email-worker), `AddChannelId` and `RemoveChannelId` (channel-api),
  `DeleteIdentity` (account-api's purge), `VerifyPassword` (account-api's export).
* **gRPC calls** — `account-api.CreateAccount` / `DeleteAccount` and `channel-api.CreateChannel` / `DeleteChannel`
  during sign-up and its compensation.
* **Events** — publishes `SendEmail` (confirmation, reset, email change to the new address, notice to the old
  address). No domain events: nothing else stores the address or the password.

### 6.2 account-api (formerly user-api)

* **Stores** — Postgres: the account row (id, email language defaulting to English, `deletion_scheduled_at`, the
  deletion cancel token, the last export time) and the account purge record. Redis: the deletion confirmation token
  (5 min) and BullMQ queues. MinIO: the `exports` bucket, one archive object per account.
* **HTTP**

    | Endpoint | Does |
    |---|---|
    | `GET /accounts/current` | Email language, scheduled deletion time, last export time |
    | `PUT /accounts/current/email-language` | Validated against the supported languages in `lib`; an unsupported one is rejected |
    | `POST /accounts/current/deletion` | Requires `Email-Verified`; sends the confirmation email |
    | `POST /accounts/deletion/confirm` | Schedules the deletion a week ahead (§13.17); the token must be the signed-in account's |
    | `POST /accounts/deletion/cancel` | Cancels it — with the email's token, or from the settings with none |
    | `POST /accounts/current/export` | Data export (§13.18) |

* **gRPC exposed** — `CreateAccount`, `DeleteAccount` (auth-api's sign-up saga), `GetEmailLanguage` (email-worker).
* **gRPC calls** — `auth-api.VerifyPassword`, `auth-api.DeleteIdentity`; for the export, `channel-api.ExportChannels`
  then, in parallel, the export method of `video-api`, `comment-api`, `video-rate-api`, `comment-rate-api`,
  `subscription-api`, `watch-history-api` and `notification-api`.
* **Events** — publishes `AccountDeletionScheduled`, `AccountDeletionCancelled` (to video-api),
  `AccountPurgeRequested` (to channel-api) and `SendEmail`; consumes `AccountChannelsPurged` from channel-api.
* **Jobs** — delayed purge job (+7 days), a repeatable sweep for deletions whose job was lost, a delayed deletion of
  each export archive (+1 hour).

### 6.3 channel-api

* **Stores** — Postgres: the channel row (id, account id, name, description, avatar URL, "Show age-restricted
  content" off by default, subscriber count written by `subscriber-count-worker`, creation time,
  `deletion_scheduled_at`, the deletion cancel token), the purge records, the inbox (shared with
  `subscriber-count-worker`). Redis: the deletion confirmation token (5 min), BullMQ. MinIO: the `avatars` bucket, a
  new object name per upload, the old one deleted.
* **HTTP**

    | Endpoint | Does |
    |---|---|
    | `GET /channels/mine` (no channel needed) | Every channel of the account, oldest first |
    | `POST /channels` (no channel needed) | Creates a channel (max 10), then adds its id to the token claim through `auth-api`, synchronously |
    | `GET /channels/current` · `PUT /channels/current` | The acting channel's settings; the age toggle refused for an account too young |
    | `PUT /channels/current/avatar` | Multipart image ≤ 5 MB, resized to 160×160 with `sharp` (animated GIFs kept) |
    | `GET /channels/{channelId}` | Public channel data with the stored subscriber count |
    | `POST /channels/current/deletion` | Requires `Email-Verified` and another channel without a deletion scheduled; sends the confirmation email |
    | `POST /channels/deletion/confirm` | Schedules the deletion a week ahead (§13.16); the token's channel must be the signed-in account's |
    | `POST /channels/deletion/cancel` | Cancels it — with the email's token, or from the settings for the acting channel |

* **gRPC exposed** — `CreateChannel`, `DeleteChannel` (sign-up saga), `GetAgeRestrictedSetting` (every listing
  service, cached a few seconds), `LookupChannels` (ids → the ones that still exist, with name, avatar and account id),
  `ExportChannels` (account-api).
* **gRPC calls** — `auth-api.AddChannelId`, `auth-api.RemoveChannelId`.
* **Events** — publishes `ChannelCreated`, `ChannelUpdated` (name, description, avatar), `ChannelDeleted` (when a
  create is undone), `ChannelDeletionScheduled`, `ChannelDeletionCancelled`, `ChannelPurgeRequested`,
  `AccountChannelsPurged`, `SendEmail`. Consumes `ChannelPurged` from the nine purge participants and
  `AccountPurgeRequested`.
* **Jobs** — delayed purge job (+7 days), a repeatable sweep for deletions whose job was lost, re-publishing the purge
  to participants that have not reported.

### 6.4 video-upload-api

Runs two instances from the start, so the SSE fan-out is exercised.

* **Stores** — Postgres: the upload session (video id, file name, size, status `upload_pending` → `processing` →
  failed / expired, bytes received, qualities ready, thumbnails ready), with a unique constraint on the active
  session. Redis: one pub/sub channel per video (`upload-progress:{videoId}`), BullMQ for the expiry job.
* **HTTP**

    | Endpoint | Does |
    |---|---|
    | `POST /video-uploads/initialize` | Checks type and size (≤ 10 GB), asks `video-api` for a new video, opens the session; given an existing video whose upload expired or failed, opens a new session for it instead |
    | `GET /video-uploads/{videoId}` | The session state for the uploading page |
    | `GET /video-uploads/{videoId}/events` | SSE: subscribe to the video's channel first, then send the current state, then forward live updates |
    | tus hooks `pre-create`, `post-receive`, `post-finish` | Called by tusd, not by the browser; each checks `Tus-Webhook-Secret` |

* **gRPC calls** — `video-api.CreateVideo`, passing the account id from `User-ID`.
* **Events** — publishes `VideoUploadCompleted` (post-finish), `VideoUploadFailed` (a hook check failed) and
  `VideoUploadExpired`. Consumes the processing events (updates the session, then publishes a small message to the
  video's Redis channel), and `VideoPublished` and `VideoDeleted` (drops the session).
* **Jobs** — a repeatable job that expires sessions older than a day (the video stays; only the session goes).

### 6.5 video-api

* **Stores** — Postgres: the video row (channel id, account id, title, description, tags, allow comments, allow rates,
  visibility `public` / `accessible_by_link` / `private`, age restricted, published, processing state, selected
  thumbnail and its version, duration, view count, like and dislike counts, comment total), one rendition row per
  quality (label, byte size, resolution, bitrate, codec string), the stored previous visibility and the channel and
  account deletion marks, an index for the all-time view order, the inbox (shared with the three count workers that
  write this database). Redis: BullMQ (prefix deletion). MinIO: the `videos` bucket (§9.3).
* **HTTP**

    | Endpoint | Does |
    |---|---|
    | `GET /videos/{videoId}/watch` | The one permission check (§13.9); returns the tokenized playlist and previews URLs, details, counts, allow flags; writes `VideoViewed` |
    | `GET /videos/{videoId}/downloads` · `POST /videos/{videoId}/downloads/{quality}` | Finished qualities with their sizes · a short-lived presigned MP4 URL with `Content-Disposition` |
    | `GET /videos/{videoId}` | The author's editable view: details, the selected thumbnail, and short-lived presigned URLs for the private suggestions |
    | `PUT /videos/{videoId}` | Edit details (the visibility is locked while a channel or account deletion is scheduled) |
    | `PUT /videos/{videoId}/thumbnail` | Pick a suggestion or upload one; copied server-side over the public `thumbnail.jpg`, version raised |
    | `PUT /videos/{videoId}/visibility` | Change visibility (locked during a deletion window) |
    | `POST /videos/{videoId}/publish` | Needs the lowest quality ready; published as private during a deletion window |
    | `DELETE /videos/{videoId}` | Hard, immediate delete, at any stage; files removed by a background job |
    | `GET /videos/for-channel/{channelId}` | A channel's list: the owner sees everything, others published public videos; the total from the same query |
    | `GET /videos/for-channel/{channelId}/search` | Substring search on title and description, same filters and paging as the list |

* **gRPC exposed**

    | Method | Answers | Callers |
    |---|---|---|
    | `CreateVideo` | A new unpublished video for the acting channel and account | video-upload-api |
    | `GetVideoPermission` | Exists? may this viewer watch it? comments allowed? rates allowed? — plus the title and channel id | video-rate-api, comment-api |
    | `LookupVisibleVideos` | For listings: the ids a viewer may see (published, public, allowed by age and the channel setting), in order, with card fields | search-api, recommendation-api |
    | `ReportVideoAvailability` | For personal lists: each id available (with card fields), private, or deleted; no age check | watch-history-api, video-rate-api, comment-api |
    | `ListMostViewed` | Ids of the most viewed videos a viewer may see | recommendation-api |
    | `ExportVideos` | A set of channels' videos as metadata with page URLs | account-api |

* **gRPC calls** — `channel-api.GetAgeRestrictedSetting`.
* **Events** — consumes `VideoUploadCompleted`, `VideoUploadFailed` and `VideoUploadExpired` (the upload part of the
  video's state, which the author's channel list shows). Publishes `VideoViewed` (key: video id; the acting channel,
  user agent, IP and title),
  `VideoPublished`, `VideoUpdated` (every edit, thumbnail and visibility change, and every hide or restore during a
  deletion window), `VideoDeleted` (one per video, also during a purge), `ChannelPurged`. Consumes the processing
  events, `ChannelDeletionScheduled` / `Cancelled`, `AccountDeletionScheduled` / `Cancelled`, `ChannelPurgeRequested`.

### 6.6 video-rate-api

* **Stores** — Postgres: one rate per channel and video (unique pair), like or dislike, the time it was last set, the
  video's title (for the rated videos search).
* **HTTP** — `POST /video-rates/{videoId}` (like or dislike; asks `video-api.GetVideoPermission` first),
  `DELETE /video-rates/{videoId}`, `GET /video-rates/{videoId}` (the acting channel's own rate),
  `GET /video-rates?onlyLiked&query&page` (the rated videos page, with `ReportVideoAvailability` and `LookupChannels`).
* **gRPC exposed** — `ExportVideoRates` (account-api).
* **Events** — publishes `VideoRateSet` and `VideoRateRemoved` (key: video id). Consumes `VideoDeleted` (deletes the
  video's rates), `VideoUpdated` (refreshes titles), `ChannelPurgeRequested` (deletes the channel's rates, with a
  `VideoRateRemoved` for each so counts come down).

### 6.7 comment-api

* **Stores** — Postgres: comments and replies in one table — video, author channel with a copy of its name and
  avatar, text (≤ 5000 characters), parent (always a top-level comment; one level of nesting, enforced in the
  schema), the mentioned channel as structured data, edited flag and times, a copy of the video's title, like and
  dislike counts, reply count. The inbox is shared with `comment-rate-count-worker` and `comment-reply-count-worker`.
* **HTTP**

    | Endpoint | Does |
    |---|---|
    | `GET /comments?videoId&sort` | Top-level comments, 30 a page, keyset cursor; the acting channel's own pinned on page one and left out of the rest; the acting channel's rates included |
    | `GET /comments/{commentId}/thread` | The thread a `?comment=` link points at, a reply resolved to its top-level comment |
    | `GET /comments/{commentId}/replies` | Replies, oldest first, keyset cursor |
    | `POST /comments/{videoId}` · `POST /comments/{commentId}/replies` | Post; `GetVideoPermission` first; the mentioned channel worked out on the server |
    | `PUT /comments/{commentId}` · `DELETE /comments/{commentId}` | Edit (no event) · hard delete, a top-level comment with its replies |
    | `GET /comments/current?query&page` | The acting channel's comments and replies (My comments), with `ReportVideoAvailability` and `LookupChannels` |

* **gRPC exposed** — `CommentExists` (comment-rate-api), `ExportComments` (account-api).
* **gRPC calls** — `video-api.GetVideoPermission` (posting, and listing when comments may be off),
  `channel-api.LookupChannels` (the author's name and avatar on a new comment, and My comments),
  `video-api.ReportVideoAvailability`, `comment-rate-api.GetChannelRates`.
* **Events** — publishes `CommentCreated` (for comments and replies; carries the video's channel and title),
  `ReplyCreated` (carries the thread's top-level author, the mentioned channel, the replier's name and the text),
  `CommentDeleted` / `ReplyDeleted` (with the comment's creation time), `ChannelPurged`. Consumes `ChannelUpdated`
  (author copies), `VideoUpdated` (title copies), `VideoDeleted` (deletes the video's comments),
  `ChannelPurgeRequested` (deletes the channel's comments, in batches).

### 6.8 comment-rate-api

* **Stores** — Postgres: one rate per channel and comment (unique pair), like or dislike, when it was set.
* **HTTP** — `POST /comment-rates/{commentId}` (asks `comment-api.CommentExists`), `DELETE /comment-rates/{commentId}`.
* **gRPC exposed** — `GetChannelRates` (comment-api, per page of comments), `ExportCommentRates` (account-api).
* **Events** — publishes `CommentRateSet`, `CommentRateRemoved` (key: comment id). Consumes `CommentDeleted` (deletes
  the rates on it, with no decrement event — the comment is gone) and `ChannelPurgeRequested` (deletes the rates the
  channel gave, with a decrement for each).

### 6.9 subscription-api

* **Stores** — Postgres: one subscription per pair of channels (unique pair), when it was created, and a copy of the
  subscribed channel's name, avatar, description and subscriber count.
* **HTTP** — `POST /subscriptions` (a channel cannot subscribe to itself; a repeat is a success with no second event),
  `DELETE /subscriptions/{channelId}`, `GET /subscriptions/{channelId}` (the button state),
  `GET /subscriptions/current` (every subscription at once, newest first, no paging).
* **gRPC exposed** — `ExportSubscriptions` (account-api).
* **Events** — publishes `SubscriptionCreated`, `SubscriptionDeleted` (key: the subscriber; the delete carries when
  the subscription was created), `ChannelPurged`. Consumes `ChannelUpdated`, `ChannelSubscriberCountsUpdated`,
  `ChannelPurgeRequested` (deletes subscriptions in both directions, with a `SubscriptionDeleted` for each).

### 6.10 watch-history-api

* **Stores** — Postgres: one row per channel and video (unique pair) with the last watched time and the video's title;
  per channel, the paused flag and the last cleared time.
* **HTTP** — `GET /watch-history?query&page` (with the paused flag; unavailable videos as placeholders),
  `DELETE /watch-history/{videoId}`, `DELETE /watch-history`, `PUT /watch-history/paused`.
* **gRPC exposed** — `GetPausedChannels` (recommendation-api), `ExportWatchHistory` (account-api).
* **gRPC calls** — `video-api.ReportVideoAvailability`, `channel-api.LookupChannels`.
* **Events** — publishes `WatchHistoryEntryRemoved`, `WatchHistoryCleared`, `ChannelPurged`. Consumes `VideoViewed`
  (records every watch unless paused or older than the last clear), `VideoUpdated` (titles), `VideoDeleted` (clears
  the title, keeps the row as a "Deleted video" placeholder), `ChannelPurgeRequested`.

### 6.11 notification-api

* **Stores** — Postgres, shared with `notification-worker`: preferences (a row only once a user saves; defaults in
  code), notifications (recipient channel, type, subject, count, `first_event_at`, `activity_at`, `read_at`,
  `hidden_at`, the video title for new comments, and for replies and mentions the comment, video, replier's channel id
  and name and the text), the partial unique index for one open notification per key (`NULLS NOT DISTINCT`), the
  pending email items.
* **HTTP** — `GET` / `PUT /notifications/preferences` (an email toggle refused while `Email-Verified` is false),
  `GET /notifications?page`, `GET /notifications/unread-count`, `POST /notifications/{id}/read`,
  `POST /notifications/{id}/hide`, `POST /notifications/read-all`.
* **gRPC exposed** — `ExportNotificationPreferences` (account-api).
* **Events** — consumes `ChannelPurgeRequested` (deletes what the channel received, its preferences, and the reply and
  mention notifications it caused elsewhere), publishes `ChannelPurged`. The rest of the event work is
  `notification-worker`'s (§7).

### 6.12 search-api

* **Stores** — Elasticsearch: a video index (title and description as multi-fields — `standard`, `.en` with
  `english`, `.uk` with `ukrainian` — tags, channel id, name and avatar, duration in seconds, upload date, view count,
  age-restricted flag) and a channel index (name with the same three analyzers, description, avatar, subscriber
  count). Only public, published videos are ever indexed. Postgres only for the inbox.
* **HTTP** — `GET /search/videos` (query, upload-date and duration filters, order by relevance, date or views, pages
  capped below `index.max_result_window`), `GET /search/channels` (order by relevance or subscribers),
  `GET /search/videos/{videoId}/similar` (`more_like_this` by the stored document, `min_term_freq` and
  `min_doc_freq` 1, age filters inside the query, up to 20).
* **gRPC calls** — `video-api.LookupVisibleVideos` and `channel-api.LookupChannels` on every page served;
  `channel-api.LookupChannels` also when a new video is indexed, for its channel's name and avatar;
  `channel-api.GetAgeRestrictedSetting`.
* **Events** — consumes `VideoPublished`, `VideoUpdated`, `VideoDeleted`, `ChannelCreated`, `ChannelUpdated`,
  `VideoViewCountsUpdated`, `ChannelSubscriberCountsUpdated`, `ChannelPurgeRequested`; publishes `ChannelPurged`. The
  index can be rebuilt from scratch by replaying the events.

### 6.13 recommendation-api

The only service that talks to Gorse.

* **Stores** — Gorse: users are channels (created by their first feedback, labelled with the channels they subscribe
  to); items are videos (labelled with their tags and channel id, hidden unless public); feedback types `watch` and
  `like` positive, `dislike` negative, no read type. Redis: feed snapshots (an ordered list of about 200 video ids
  and the channel id, expiring an hour after the last read). Postgres: the inbox, and each channel's last history
  clear time.
* **HTTP** — `GET /feed?cursor=` (24 cards a page; no cursor starts a new snapshot).
* **gRPC calls** — `video-api.ListMostViewed`, `video-api.LookupVisibleVideos`, `channel-api.LookupChannels`,
  `channel-api.GetAgeRestrictedSetting`, `watch-history-api.GetPausedChannels`.
* **Events** — consumes `VideoPublished`, `VideoUpdated`, `VideoDeleted` (items), `VideoViewed` (`watch` feedback),
  `VideoRateSet` / `VideoRateRemoved` (`like` / `dislike`), `SubscriptionCreated` / `SubscriptionDeleted` (user
  labels), `WatchHistoryEntryRemoved` / `WatchHistoryCleared` (delete `watch` feedback), `ChannelPurgeRequested`;
  publishes `ChannelPurged`.

---

## 7. Workers

### 7.1 The six count workers

All six share one base in `lib/workers`, rebuilt on the inbox (§12.2): consume a Kafka batch, and in one transaction
record the batch's event ids in the inbox, keep only the new events, sum the deltas per key in memory and apply them
in one statement. After the commit, every offset is resolved — duplicates and malformed messages included. A failed
transaction resolves nothing, so Kafka delivers the batch again. Counts are therefore behind by up to one batch, by
design, and the UI never adjusts a stored count after a rate or subscription — it shows what the button says.

| Worker | Consumes | Writes | Then publishes |
|---|---|---|---|
| `video-view-count-worker` | `VideoViewed` | `view_count` on the video row | `VideoViewCountsUpdated` → search-api |
| `video-rate-count-worker` | `VideoRateSet`, `VideoRateRemoved` | likes and dislikes on the video row | — |
| `video-comment-count-worker` | `CommentCreated`, `CommentDeleted` | the video's comment total, replies included | — |
| `comment-rate-count-worker` | `CommentRateSet`, `CommentRateRemoved` | likes and dislikes on the comment row | — |
| `comment-reply-count-worker` | `ReplyCreated`, `ReplyDeleted` | the reply count on the parent comment | — |
| `subscriber-count-worker` | `SubscriptionCreated`, `SubscriptionDeleted` | `subscriber_count` on the channel row | `ChannelSubscriberCountsUpdated` → search-api, subscription-api |

* `video-view-count-worker` also applies the business rule "one view per viewer per video per 24 hours": before
  counting, it reserves the Redis key `video-view:{videoId}:{viewerChannelId}` with a 24-hour TTL and drops the
  events whose key was taken. The inbox and this key answer different questions — redelivery versus repeat views.
  Today the key leaves out the video id, which undercounts every view after the first
  ([known-issues.md](../known-issues.md)).
* The two workers that publish do so because they write straight into another service's database: that service never
  learns of the change and cannot announce it.
* Metrics per worker: batch size, batch duration, failed batches, duplicates skipped; consumer lag per group.

### 7.2 video-processing-worker

No database. Its per-video state is a BullMQ flow; its inputs and outputs are in MinIO; FFmpeg and ffprobe are in its
image. BullMQ concurrency of one or two per instance, generous timeouts, work in a temp directory, upload on success.

```text
VideoUploadCompleted ──► probe (ffprobe: size, duration, fps, audio?) ──► plan the rungs
                            │
                            ▼  BullMQ flow: one parent, children:
      thumbnails ──► VideoThumbnailsGenerated        (3 suggestions at 25/50/75 %, 1280 wide)
      previews                                      (sprites 5×5 of 160-wide frames + WEBVTT under hls/previews/)
      encode 240 ─► package 240 ─► VideoQualityReady (H.264 MP4 → HLS, rewrite master.m3u8)
      encode 360 ─► package 360 ─► VideoQualityReady
      …one per rung up to the source's size…
      parent ──► VideoProcessingCompleted (naming any failed rung) | VideoProcessingFailed (the lowest rung failed)
```

* Rungs: 240, 360, 480, 720, 1080 by the short side, never above the source; a source below 240p gets one rung at its
  own size. CRF 23 with a capped bitrate per rung, AAC stereo, keyframes every 4 seconds to match 4-second HLS segments.
* A quality counts as ready once its HLS playlist exists, not when its MP4 does. Rungs finish in any order, so all
  state is per rung, and the master playlist is rewritten, one rewrite at a time per video, with every rung that
  exists so far. A video can be published once one quality exists; the player works with whatever the master playlist
  offers.
* Consumers of its events: `video-api` (stores renditions, duration, thumbnails, state) and `video-upload-api`
  (updates the session and notifies the page).
* Details: [ffmpeg-processing-parameters.md](../explainers/ffmpeg-processing-parameters.md).

### 7.3 notification-worker

Belongs to `notification-api` and writes its database. Consumes in batches through the inbox and writes one
statement per group of events with the same key.

| Consumes | Does |
|---|---|
| `SubscriptionCreated` | Upserts the subscribed channel's open "New subscribers" notification (count up, earliest `first_event_at`, latest `activity_at`) unless the type is off in-app |
| `SubscriptionDeleted` | Counts that notification down, only for subscriptions created at or after its `first_event_at`; deletes it at zero |
| `CommentCreated` (top-level) | Upserts the video owner's open "New comments" notification for that video, unless the commenter is the owner or the type is off |
| `CommentDeleted` (top-level) | Counts it down by creation time; also removes the comment's pending email item |
| `ReplyCreated` | A Reply notification for the thread's top-level author and a Mention for the mentioned channel (unless it started the thread); never for the replier itself; then the email step |
| `VideoDeleted` | Deletes that video's "New comments" notifications |

* **Email step**: when a reply or mention reaches a channel with email on for that type, `SET NX` a Redis key for the
  recipient and thread with a 15-minute TTL. If it was set, ask `channel-api.LookupChannels` for the recipient's name
  and account, publish `SendEmail` now and schedule a BullMQ delayed flush for the end of the window. If it already
  existed, store a pending item in Postgres. The flush reads and deletes the pending items, re-reads preferences and
  sends one follow-up email, or nothing.
* **Cleanup**: a daily repeatable job deletes notifications read more than 90 days ago.
* Details: [notification-aggregation.md](../explainers/notification-aggregation.md).

### 7.4 email-worker

No database. Consumes `SendEmail` from its own topic — the one topic many services publish to. Each event names the
template, the recipient's account id and the template's values; only the two email-change emails carry an address.

1. Skip an event id already sent (a Redis key with a TTL, deleted again if the send fails).
2. Ask `auth-api.GetAccountEmail` for the address (unless the event carries one) and `account-api.GetEmailLanguage`
   for the language — at send time, so a delayed email still goes to the current address in the current language.
3. Render the Handlebars template, subject included, in that language, falling back to English; user content only
   through `{{ }}`.
4. Send with nodemailer over SMTP. A failed send is retried and logged and never reaches the service that asked.

| Producer | Emails |
|---|---|
| `auth-api` | account confirmation, password reset, email change (to the new address), email changed (to the old address) |
| `channel-api` | channel deletion confirmation link, deletion date with cancel link |
| `account-api` | account deletion confirmation link, deletion date with cancel link |
| `notification-worker` | first reply or mention in a thread, and the 15-minute follow-up |

---

## 8. Infrastructure components

### 8.1 Keycloak

* Realm imported from `docker/keycloak/realm.json` on start; one pinned `KC_HOSTNAME`, so tokens issued to the browser
  and to apps on the host carry the same issuer.
* A client allowed the direct access grant (the app's own login form; users never see Keycloak's pages); an admin
  client for `auth-api`.
* Access token claims: `sub`, `sid`, `email_verified`, and the user attributes `birthdate` and `channelIds` mapped in.
* Access token 5 minutes, SSO Session Idle 30 days, SSO Session Max raised past its 10-hour default, refresh tokens
  rotated.
* Brute force protection on; the built-in "Verify Email" required action off; the built-in emails and pages unused.

### 8.2 Kafka

* SASL/SCRAM-SHA-512 on both listeners — an internal one advertising `kafka` to containers, an external one advertising
  `localhost` to apps on the host in development. One Kafka user per service and worker, plus Kafka UI and Alloy.
* Automatic topic creation is off. An init container creates every topic with an explicit partition count, and the
  users. A topic belongs to the service that publishes to it; every event is keyed by the id of the entity it is about;
  the partition count caps how many instances of a consumer can work.

### 8.3 tusd

* Stores uploads in the MinIO `videos` bucket through its S3 backend; runs with `-behind-proxy`, so it builds upload
  URLs from the gateway's `X-Forwarded-*` headers.
* Calls `video-upload-api`'s `pre-create`, `post-receive` and `post-finish` hooks with the `User-ID`, `Channel-ID` and
  `Tus-Webhook-Secret` headers the gateway injected. `pre-create` binds the upload to its video and sets the object
  path `{videoId}/original.{ext}`.
* One instance until a Spike settles whether several can share uploads (its default locker is per process).
* Abandoned multipart uploads are cleaned up by a MinIO lifecycle rule after a day.

### 8.4 nginx-s3-gateway

Serves the private buckets to the gateway, signing its requests to MinIO with SigV4: `s3-gateway-videos` and
`s3-gateway-avatars`, unless one instance turns out to serve several buckets. The buckets stay private; nginx decides
access by route.

### 8.5 Elasticsearch and Gorse

* Elasticsearch: an image with the `analysis-ukrainian` plugin installed at build time, a healthcheck, the heap from
  `ES_JAVA_OPTS`. Written only by `search-api`.
* Gorse: one all-in-one container with its configuration in the repo; its data in its own Postgres database and
  user, its cache in the shared Redis. Configured with `watch` and `like` positive, `dislike` negative, no read type,
  `enable_replacement` off (watched videos are not recommended again), its own `latest` fallback off,
  `auto_insert_item` off, `cache_size` at least the snapshot size. Used only by `recommendation-api`.

---

## 9. Data stores

### 9.1 PostgreSQL

One database and one user per service, in every environment (the names below are working names); `CONNECT` is
revoked from `PUBLIC`, so a user reaches only its own database even on a shared server. Every connection pool has an
explicit size.

| Database | Written by | Holds |
|---|---|---|
| auth | `auth-api` | session details (device, location) |
| account | `account-api` | accounts, account purge records |
| channel | `channel-api`, `subscriber-count-worker` | channels, channel purge records |
| video_upload | `video-upload-api` | upload sessions |
| video | `video-api`, `video-view-count-worker`, `video-rate-count-worker`, `video-comment-count-worker` | videos, renditions, deletion marks |
| video_rate | `video-rate-api` | video rates |
| comment | `comment-api`, `comment-rate-count-worker`, `comment-reply-count-worker` | comments and replies |
| comment_rate | `comment-rate-api` | comment rates |
| subscription | `subscription-api` | subscriptions |
| watch_history | `watch-history-api` | history rows, paused flags, clear times |
| notification | `notification-api`, `notification-worker` | preferences, notifications, pending email items |
| search | `search-api` | the inbox only |
| recommendation | `recommendation-api` | the inbox, history clear times |
| gorse | Gorse | Gorse's own data |

Every database that publishes has an `outbox` table; every database that consumes has `processed_events` (§12).
`email-worker` and `video-processing-worker` have no database.

### 9.2 Redis

One instance with `maxmemory-policy noeviction` — BullMQ keeps its jobs there, and eviction would silently drop
them. Every key is prefixed with the owning service's name.

| Use | Owner | Keys and lifetime |
|---|---|---|
| Confirmation, reset and email-change tokens and cooldowns | `auth-api` | TTL 60 s to 24 h (§6.1) |
| Channel and account deletion confirmation tokens | `channel-api`, `account-api` | 5 min |
| View deduplication | `video-view-count-worker` | `video-view:{videoId}:{viewer}`, 24 h |
| Upload progress | `video-upload-api` | pub/sub channel `upload-progress:{videoId}`, no state, no TTL, its own connection |
| Feed snapshots | `recommendation-api` | about 200 ids + channel id, 1 h after the last read |
| Email window | `notification-worker` | per recipient and thread, 15 min |
| Sent emails | `email-worker` | per event id, with a TTL |
| Gorse's cache | Gorse | Gorse-managed |
| BullMQ queues | every service with jobs | delayed purges and sweeps, export cleanup, prefix deletion, upload expiry, processing flows, email flushes, notification cleanup, inbox cleanup |

A scheduled deletion is recorded in Postgres; the BullMQ job is only its trigger, and a repeatable sweep catches jobs
that were lost.

### 9.3 MinIO

| Bucket | Owner | Lifecycle | Served through |
|---|---|---|---|
| `videos` | `video-api` (tusd writes originals, the processing worker writes the rest) | abort incomplete multipart uploads after 1 day | `s3-gateway-videos` (HLS with a token, the public thumbnail); downloads by presigned URL |
| `avatars` | `channel-api` | — | `s3-gateway-avatars` (public) |
| `exports` | `account-api` | expire after 1 day, as a floor under the one-hour deletion job | presigned URL |

One video's objects:

```text
videos/{videoId}/
├── original.{ext}              private — the upload, never served
├── master/master_{rung}.mp4    private — downloads only, by a short-lived presigned URL
├── hls/                        token-gated — /hls/{expires}/{token}/{videoId}/…
│   ├── master.m3u8             rewritten as each rung finishes
│   ├── {rung}/index.m3u8, segment{n}.ts
│   └── previews/sprite{n}.jpg, previews.vtt
├── thumbnails/thumbnail{1..3}.jpg, custom.jpg   private — shown only to the author, by short-lived presigned URLs
└── thumbnail.jpg               public — a copy of the chosen image; its URL carries a version
```

Presigned URLs are signed for the browser-facing host — `storage.localhost` in preview and development, the real host
in production — since a signature covers the host.

### 9.4 Elasticsearch, Gorse, Keycloak

Stores owned by exactly one service each: Elasticsearch by `search-api` (§6.12), Gorse by `recommendation-api`
(§6.13), Keycloak by `auth-api` (§8.1).

---

## 10. Event catalogue

Kafka carries events — facts other services react to. Every event has `eventId` and `occurredAt` (the time of the
change, set by the producer, and the time consumers compare — never the time a batch was processed). Topic names
follow today's style, one topic per publishing service; the event names are working names.

| Topic | Event | Key | Carries (beyond ids) | Consumers |
|---|---|---|---|---|
| `account-events` | `AccountDeletionScheduled` | account | — | video-api |
| | `AccountDeletionCancelled` | account | — | video-api |
| | `AccountPurgeRequested` | account | — | channel-api |
| `channel-events` | `ChannelCreated` | channel | name, description, avatar | search-api |
| | `ChannelUpdated` | channel | name, description, avatar | comment-api, subscription-api, search-api |
| | `ChannelDeleted` (a create undone) | channel | — | search-api |
| | `ChannelDeletionScheduled` | channel | — | video-api |
| | `ChannelDeletionCancelled` | channel | — | video-api |
| | `ChannelPurgeRequested` | channel | — | video-api, comment-api, comment-rate-api, video-rate-api, subscription-api, watch-history-api, notification-api, search-api, recommendation-api |
| | `AccountChannelsPurged` | account | — | account-api |
| `subscriber-count-events` | `ChannelSubscriberCountsUpdated` | channel | new count | search-api, subscription-api |
| `video-upload-events` | `VideoUploadCompleted` | video | — | video-processing-worker, video-api |
| | `VideoUploadFailed` | video | — | video-api |
| | `VideoUploadExpired` | video | — | video-api |
| `video-processing-events` | `VideoThumbnailsGenerated` | video | which suggestions exist | video-api, video-upload-api |
| | `VideoQualityReady` | video | quality, byte size, resolution, bitrate, codec string, duration | video-api, video-upload-api |
| | `VideoProcessingCompleted` | video | any failed rungs | video-api, video-upload-api |
| | `VideoProcessingFailed` | video | — | video-api, video-upload-api |
| `video-events` | `VideoViewed` | video | acting channel, user agent, IP, title | video-view-count-worker, watch-history-api, recommendation-api |
| | `VideoPublished` | video | the indexable fields | video-upload-api, search-api, recommendation-api |
| | `VideoUpdated` | video | the video's current fields, thumbnail version included | search-api, recommendation-api, watch-history-api, video-rate-api, comment-api |
| | `VideoDeleted` | video | — | comment-api, video-rate-api, search-api, recommendation-api, watch-history-api, notification-worker, video-upload-api |
| `video-view-count-events` | `VideoViewCountsUpdated` | video | new count | search-api |
| `video-rate-events` | `VideoRateSet` | video | channel, like or dislike | video-rate-count-worker, recommendation-api |
| | `VideoRateRemoved` | video | channel, what it was | video-rate-count-worker, recommendation-api |
| `comment-events` | `CommentCreated` | comment | video, video's channel and title, parent if a reply | video-comment-count-worker, notification-worker |
| | `ReplyCreated` | parent comment | thread's top-level author, mentioned channel, replier's name, text | comment-reply-count-worker, notification-worker |
| | `CommentDeleted` | comment | video, parent if a reply, when it was created | video-comment-count-worker, comment-rate-api, notification-worker |
| | `ReplyDeleted` | parent comment | when it was created | comment-reply-count-worker |
| `comment-rate-events` | `CommentRateSet` | comment | channel, like or dislike | comment-rate-count-worker |
| | `CommentRateRemoved` | comment | channel, what it was | comment-rate-count-worker |
| `subscription-events` | `SubscriptionCreated` | subscriber | subscribed channel | subscriber-count-worker, notification-worker, recommendation-api |
| | `SubscriptionDeleted` | subscriber | subscribed channel, when it was created | subscriber-count-worker, notification-worker, recommendation-api |
| `watch-history-events` | `WatchHistoryEntryRemoved` | channel | video | recommendation-api |
| | `WatchHistoryCleared` | channel | — | recommendation-api |
| each purge participant's topic | `ChannelPurged` | channel | which service | channel-api |
| `email-requests` | `SendEmail` | recipient account | template, values, an address only for the email-change emails | email-worker |

Why some keys matter:

* **Per-entity order.** Everything about one video, comment or channel lands on one partition and is applied in
  order — a like switched to a dislike, a subscription made and removed.
* **Subscriptions are keyed by the subscriber**, because `recommendation-api` rewrites a Gorse user's labels as a
  whole: one consumer must see all of one subscriber's changes, in order.
* **`SubscriptionDeleted` and `CommentDeleted` carry when the thing was created**, so an open aggregated notification
  counts down only what it counted.

---

## 11. gRPC catalogue

gRPC carries questions — a service that needs an answer inside a request. Every call carries the caller's API key in
`x-api-key`; the server maps it to a caller name and refuses unknown keys. Method names are working names.

| Callee | Method | Answers | Callers |
|---|---|---|---|
| `auth-api` | `GetAccountEmail` | the account's email address, from Keycloak | email-worker |
| | `AddChannelId` · `RemoveChannelId` | edits the `channelIds` claim (idempotent) | channel-api |
| | `DeleteIdentity` | deletes the Keycloak user (idempotent) | account-api |
| | `VerifyPassword` | checks a password with a direct grant | account-api |
| `account-api` | `CreateAccount` · `DeleteAccount` | the account record, for the sign-up saga | auth-api |
| | `GetEmailLanguage` | the account's email language | email-worker |
| `channel-api` | `CreateChannel` · `DeleteChannel` | the first channel, for the sign-up saga | auth-api |
| | `GetAgeRestrictedSetting` | the channel's "Show age-restricted content" (callers cache it a few seconds) | video-api, search-api, recommendation-api |
| | `LookupChannels` | the channels that still exist among the ids, with name, avatar, account id | search-api, recommendation-api, watch-history-api, video-rate-api, comment-api, notification-worker |
| | `ExportChannels` | an account's channels, with any scheduled deletion date | account-api |
| `video-api` | `CreateVideo` | a new unpublished video | video-upload-api |
| | `GetVideoPermission` | exists, may watch, comments and rates allowed, title, channel id | video-rate-api, comment-api |
| | `LookupVisibleVideos` | listing check with card fields | search-api, recommendation-api |
| | `ReportVideoAvailability` | available / private / deleted per id, with card fields | watch-history-api, video-rate-api, comment-api |
| | `ListMostViewed` | the popular fallback's ids | recommendation-api |
| | `ExportVideos` | video metadata with page URLs | account-api |
| `comment-api` | `CommentExists` | exists, and which video | comment-rate-api |
| | `ExportComments` | comments and replies of a set of channels | account-api |
| `comment-rate-api` | `GetChannelRates` | the acting channel's rates on a page of comments | comment-api |
| | `ExportCommentRates` | the rates a set of channels gave | account-api |
| `video-rate-api` | `ExportVideoRates` | the rates a set of channels gave | account-api |
| `subscription-api` | `ExportSubscriptions` | the channels a set of channels subscribe to | account-api |
| `watch-history-api` | `GetPausedChannels` | which of the channels have their history paused | recommendation-api |
| | `ExportWatchHistory` | history rows and the paused flag | account-api |
| `notification-api` | `ExportNotificationPreferences` | preferences, defaults included | account-api |

Two call graphs are worth drawing on their own: the **serve-time checks** (search, the feed, similar videos, watch
history, rated videos and My comments all ask `video-api` and `channel-api` about the page they are about to return)
and the **export fan-out** (`account-api` asks eight services in parallel).

---

## 12. Patterns used everywhere

### 12.1 Transactional outbox

A service never publishes to Kafka inside a request. It writes the event into its own `outbox` table in the same
transaction as the change, and a relay publishes it:

* `outbox(id, topic, key, payload, traceparent, created_at, published_at)`, with a partial index on unpublished rows;
  the payload is stored serialized, so its `eventId` never changes between attempts.
* The relay runs about every second under a Postgres advisory lock — one publisher per service however many instances
  run — reads unpublished rows in `id` order, publishes them with their keys and the stored trace context, marks them
  after the broker acknowledges, and prunes old rows. Kafka being down only delays events; it never fails a request or
  loses a change.

`auth-api` publishes its `SendEmail` events directly: it has no business tables to share a transaction with, and every
such email can be asked for again. `video-processing-worker`, which has no database, publishes its results after the
files are written.

### 12.2 Inbox

Kafka delivers at least once, so every consumer deduplicates in its own database:
`processed_events(consumer, event_id, processed_at)` with the primary key on the first two columns. The consumer inserts
the batch's ids with `ON CONFLICT DO NOTHING RETURNING event_id` inside the same transaction as its writes and handles
only the ids that came back. A repeatable job deletes rows older than 7 days. Consumers that keep copies also ignore an
event older than what they already store.

Details: [kafka-dedup-and-inbox-pattern.md](../explainers/kafka-dedup-and-inbox-pattern.md).

### 12.3 Count workers

Counters are never written per click: the click writes an event, and a worker applies a batch of them at once (§7.1).
The shown number lags by a batch; the button the user pressed is what confirms the action.

### 12.4 Copies, and checking them when serving

Services keep copies of other services' data where reading it on every request would be too costly, and refresh them
from events:

| Copy | Kept by | Refreshed from |
|---|---|---|
| author's channel name and avatar on comments | comment-api | `ChannelUpdated` |
| subscribed channel's name, avatar, description, subscriber count | subscription-api | `ChannelUpdated`, `ChannelSubscriberCountsUpdated` |
| video and channel documents, view counts, subscriber counts | search-api | video, channel and count events |
| video title | watch-history-api, video-rate-api, comment-api | `VideoUpdated` (cleared on `VideoDeleted` in the history) |
| items, feedback, user labels | Gorse, via recommendation-api | video, view, rate, subscription and history events |
| replier's name and comment text | notification-api | never — a notification records what happened, like an email |

A copy lags, so whatever is built from one is checked against the owner when it is served: the search results, the
similar videos and the feed through `video-api.LookupVisibleVideos` and `channel-api.LookupChannels`; the personal
lists through `video-api.ReportVideoAvailability`. A page can come back a little short while a copy catches up;
nothing is skipped or repeated, because the page boundaries come from the copy.

### 12.5 Visibility rules

| Visibility | Watch path | Listing paths (search, feed, similar, channel list) | Personal lists (history, rated, My comments) |
|---|---|---|---|
| public | anyone old enough | shown | shown |
| accessible by link | anyone old enough | **never** — kept out of the index and the feed's candidates | shown |
| private | the author only | never | a "Private video" placeholder |
| deleted | — | never | a "Deleted video" placeholder (history only) |

Age: a viewer too young by `Birthdate`, or a channel with "Show age-restricted content" off, gets no age-restricted
video in any listing, and a refusal with its own code on the watch path. Both are applied when serving, never when
indexing. During a channel's or account's deletion window, all its videos are private and their visibility is locked.

### 12.6 Sagas, fan-outs and scheduled work

| Shape | Where | Undo or report |
|---|---|---|
| Orchestrated saga with compensation | sign-up (`auth-api`) | undo in reverse, ending with deleting the Keycloak user |
| Saga with reports | channel purge (`channel-api`), account purge (`account-api`) | each participant reports `ChannelPurged`; missing ones get the request again; the owner's row goes last |
| Fan-out, no replies | video deletion (`VideoDeleted`), channel updates (`ChannelUpdated`) | none — nothing waits |
| Synchronous fan-out | data export (`account-api` over gRPC) | one failure fails the whole export |
| Delayed job + sweep | channel and account deletion | the Postgres column is the record; the sweep catches lost jobs |
| Repeatable jobs | inbox cleanup, upload expiry, notification cleanup, deletion sweeps | BullMQ keeps the schedule in Redis, so each fires once across instances |

### 12.7 Errors and languages

Every API answers errors with a status, a snake-case `code`, `details` and per-field errors; the UI turns codes into
localized messages, falling back to English and to a generic message for an unknown code. An error from a service
called over gRPC keeps its code. Languages (`en`, `uk`) are defined once in `lib` and shared by the UI, sign-up, the
email language setting and `email-worker`.

---

## 13. Flows

Each flow names the protocol at every step. `HTTP` means through the gateway unless said otherwise.

### 13.1 Sign-up (saga)

1. Browser → `POST /auth/sign-up` (public) → `auth-api`, with the email, password, channel name, date of birth and
   interface language.
2. `auth-api` → Keycloak admin: create the user with the `birthdate` attribute. A taken email ends here with `409`.
3. `auth-api` → `account-api.CreateAccount` (gRPC): the account record, with the language as its email language.
4. `auth-api` → `channel-api.CreateChannel` (gRPC): the first channel.
5. `auth-api` → Keycloak admin: write the channel id into `channelIds`, so the first token already carries it.
6. `auth-api` → Keycloak direct grant: log in; store the session's device row; set the cookies.
7. `auth-api`: confirmation token and cooldown into Redis, `SendEmail` → Kafka → `email-worker` (§13.19).
8. If a step after the first fails, undo in reverse — `DeleteChannel`, `DeleteAccount` — ending with deleting the
   Keycloak user, so no half-made account is left.

### 13.2 Login, requests, refresh, logout

* **Login**: `POST /auth/login` (public) → Keycloak direct grant (brute force protection applies) → session row →
  cookies. An account with several channels goes to the channel selection page.
* **Any request**: the browser sends the cookies and `X-Channel-Id`; the gateway verifies the token and sets the
  identity headers (§4.4).
* **Refresh**: a `401` makes the UI's API client start one shared refresh; concurrent requests wait for it.
  `POST /auth/refresh` (public) → Keycloak rotates the refresh token → new cookies → the waiting requests are retried.
  If Keycloak refuses, the UI goes to the login page — or to sign-up when `auth-api` answers with the deleted-account
  code.
* **Logout**: `POST /auth/logout` → Keycloak ends the `Session-ID` session → cookies cleared → other tabs are told.

### 13.3 Email confirmation

1. The token from sign-up (24 h) is in the email; `GET /auth/email-confirmation` gives the page the status and the
   resend cooldown, and `POST …/resend` replaces the token.
2. The link's page needs a session: without one the user logs in (and picks a channel) and comes back to it.
   `POST /auth/email-confirmation/confirm` → the token must belong to the signed-in account → consumed from Redis →
   Keycloak admin sets `email_verified` → the current session is refreshed, since `email_verified` travels in the
   token.

### 13.4 Password reset, email change, password change

* **Reset**: `POST /auth/password-reset/request` (public) → cooldown for the address → if the account exists, token
  (30 min) and `SendEmail`; the same answer either way. The link's page → `POST /auth/password-reset/confirm` →
  password rules checked → token consumed → Keycloak sets the password and `email_verified` → every session ends.
* **Email change**: `POST /auth/email-change` → address free in Keycloak? → token bound to the new address (5 min),
  cooldown (5 min), `SendEmail` to the new address. The link's page → `POST /auth/email-change/confirm` (public) →
  address still free? → Keycloak changes the email, keeping it verified → every session ends → `SendEmail` notice to
  the old address → the page asks for the password and logs in with the new address. No domain event.
* **Password change**: `PUT /auth/password` → rules → current password checked by a direct grant (that session ended
  at once) → new password set → every other session ended → the current one refreshed. No domain event.

### 13.5 Channels: create, switch, update

* **Create**: `POST /channels` → `channel-api` checks the 10-channel limit → one transaction: the row and
  `ChannelCreated` in the outbox → `auth-api.AddChannelId` (gRPC, synchronous, before answering; if it fails the
  channel is deleted again) → the UI refreshes its tokens, acts as the new channel, uploads the avatar if one was
  chosen, and reloads. `search-api` indexes the channel from `ChannelCreated`.
* **Switch**: the UI stores the id (localStorage + cookie) and reloads; no token, no server call. A `403` from the
  gateway drops the stored id and opens the channel selection page.
* **Update**: `PUT /channels/current` or `PUT /channels/current/avatar` (image resized, stored in `avatars`, the old
  object deleted) → `ChannelUpdated` in the outbox → `comment-api`, `subscription-api` and `search-api` refresh their
  copies.

### 13.6 Upload

1. The file selection page checks the format and the 10 GB limit.
2. `POST /video-uploads/initialize` → `video-upload-api` checks type and size → `video-api.CreateVideo` (gRPC) → the
   `upload_pending` session → the video id comes back → the browser opens `/upload/{videoId}`.
3. The uploading page loads `GET /video-uploads/{videoId}` and opens the SSE stream (§13.8).
4. `tus-js-client` → `POST /tus/` → gateway (token, identity headers, webhook secret) → tusd → `pre-create` hook:
   `video-upload-api` checks the secret, that the video is the user's and waiting, and the size, and sets the object
   path `{videoId}/original.{ext}`.
5. `PATCH` chunks → tusd → MinIO multipart upload; `post-receive` updates the bytes received and runs an `ffprobe`
   check where it can; a dropped connection resumes from where it stopped.
6. `post-finish` → the session becomes `processing`, `VideoUploadCompleted` → Kafka.
7. Meanwhile the author fills in the details: `PUT /videos/{videoId}`, `PUT /videos/{videoId}/thumbnail`.
8. Processing runs (§13.7). When the lowest quality is ready, "Publish" becomes available.
9. `POST /videos/{videoId}/publish` → `video-api` marks it published → `VideoPublished` →
   `video-upload-api` drops the session (the uploading page is gone), `search-api` indexes the video if it is public,
   `recommendation-api` adds the Gorse item.
10. A session older than a day expires (repeatable job, `VideoUploadExpired`); the video stays, and the page offers a
    fresh upload: `initialize` with the video's id opens a new session, and the file is sent again from the start.

### 13.7 Processing

1. `video-processing-worker` consumes `VideoUploadCompleted`, probes the original from MinIO and plans the rungs.
2. It creates a BullMQ flow: thumbnails, previews and one encode per rung, under one parent.
3. Thumbnails → `thumbnails/` → `VideoThumbnailsGenerated`. Previews → `hls/previews/`.
4. Each encode → `master/master_{rung}.mp4` → its package job → `hls/{rung}/…`, `master.m3u8` rewritten →
   `VideoQualityReady`. A failing rung is retried, then left out.
5. The parent → `VideoProcessingCompleted`, or `VideoProcessingFailed` when even the lowest rung failed (the video
   cannot be published).
6. `video-api` stores renditions, duration, thumbnails and state from these events; `video-upload-api` updates the
   session and tells the page.

### 13.8 Progress across instances (SSE + Redis pub/sub)

1. The browser's `EventSource` reaches one `video-upload-api` instance; it subscribes to `upload-progress:{videoId}`
   **first**, then sends the current state from Postgres, then forwards what arrives.
2. A processing event is consumed by whichever instance Kafka gives it to; that instance updates Postgres and publishes
   a small message on the video's channel.
3. The instance holding the connection forwards it over SSE; the page replaces its single alert.
4. On reconnect the same order repeats. Pub/sub carries notifications, never state, so the state always comes from
   the database first. Two instances run from the start, because with one everything works even without pub/sub.

Details: [sse-progress-and-redis-pubsub.md](../explainers/sse-progress-and-redis-pubsub.md).

### 13.9 Watch

1. `GET /videos/{videoId}/watch` → `video-api` checks: published, not private unless the viewer is the author, the
   viewer old enough (`Birthdate`), and the acting channel's age setting (`channel-api.GetAgeRestrictedSetting`,
   cached). A blocked, age-setting-off, processing or deleted video gets its own state, and the page loads nothing else.
2. `video-api` computes the token and returns the playlist URL, the previews URL, the details, counts and allow flags —
   and in the same transaction writes `VideoViewed` to the outbox.
3. The player loads `/hls/{expires}/{token}/{videoId}/master.m3u8` → gateway `secure_link` check → cache or
   `s3-gateway-videos` → MinIO. Every quality playlist and segment goes the same way, with no call to any service.
4. `VideoViewed` → `video-view-count-worker` (24-hour dedup key, count, `VideoViewCountsUpdated` → `search-api`),
   `watch-history-api` (records it unless paused), `recommendation-api` (`watch` feedback unless paused).
5. The page's sections load separately: comments, similar videos, the rate buttons, the subscribe button, downloads.
   A failure in one of them shows in that section only.

### 13.10 Rating a video

1. The button changes at once. `POST` or `DELETE /video-rates/{videoId}` → `video-rate-api` →
   `video-api.GetVideoPermission` (exists, may watch, rates allowed).
2. One transaction: the rate (unique per channel and video) and `VideoRateSet` / `VideoRateRemoved` in the outbox.
3. `video-rate-count-worker` applies the counts in a batch; `recommendation-api` writes `like` / `dislike` feedback.
4. A failed request puts the button back and shows a toast.

### 13.11 Comments

* **List**: `GET /comments?videoId&sort` → the acting channel's own top-level comments pinned on page one, then a
  keyset page → `comment-rate-api.GetChannelRates` for the channel's rates. A `?comment=` link loads its thread
  separately (`GET /comments/{id}/thread`) and the list leaves that thread out.
* **Post**: `POST /comments/{videoId}` → `video-api.GetVideoPermission` → one transaction: the comment and
  `CommentCreated` → `video-comment-count-worker` (+1), `notification-worker` (New comments).
* **Reply**: `POST /comments/{commentId}/replies` → the same check → the mentioned channel worked out from the reply
  being answered → `CommentCreated` + `ReplyCreated` → the video total, the reply count, Reply and Mention
  notifications.
* **Delete**: `DELETE /comments/{commentId}` → one transaction: the comment with its replies, and their deleted
  events → the counts come down, `comment-rate-api` deletes the rates on them, notifications count down. The page
  lowers its own counts at once.

### 13.12 Search and similar videos

* **Videos**: `GET /search/videos` → `search-api` → `GetAgeRestrictedSetting` → Elasticsearch `multi_match` over the
  three language fields and the tags, range filters, the age filter, the order → `video-api.LookupVisibleVideos`
  drops what went private meanwhile and supplies the current view counts and thumbnail versions.
* **Channels**: `GET /search/channels` → Elasticsearch → `channel-api.LookupChannels` drops channels that are gone.
* **Similar**: `GET /search/videos/{videoId}/similar` → `more_like_this` pointed at the stored document, with the age
  filters inside the query → `LookupVisibleVideos`. A video not in the index gets an empty list; the list is never
  padded.
* **Channel page search**: `GET /videos/for-channel/{channelId}/search` runs in `video-api` on Postgres, because the
  author's own list includes videos the index never holds.

### 13.13 Feed

1. `GET /feed` without a cursor → `recommendation-api` asks Gorse for up to about 200 recommendations (short timeout).
2. `video-api.ListMostViewed` → popular videos appended after Gorse's, duplicates and already-watched videos dropped.
3. `video-api.LookupVisibleVideos` → keep what the viewer may see, leave out the acting channel's own videos, cut to
   size → store the ordered ids in Redis under a new snapshot id.
4. Each page (`GET /feed?cursor=`) reads the next 24 ids from the snapshot → `LookupVisibleVideos` again (a video that
   went private drops out) → `channel-api.LookupChannels` for names and avatars → cards and the next cursor.
5. No history, or Gorse down → the snapshot is all popular videos; the feed never fails because of Gorse. An expired
   snapshot ends the list.

### 13.14 Watch history, rated videos, My comments

* **Recording**: `VideoViewed` → `watch-history-api` (skips a paused channel, and watches older than the last clear) →
  one row per channel and video, moved to the top by a repeat watch.
* **Lists**: the history, `GET /video-rates` and `GET /comments/current` page their own rows, then ask
  `video-api.ReportVideoAvailability` and `channel-api.LookupChannels`; unavailable videos come back as "Private
  video" or "Deleted video" placeholders.
* **Remove / clear / pause**: `DELETE /watch-history/{videoId}` or `DELETE /watch-history` →
  `WatchHistoryEntryRemoved` / `WatchHistoryCleared` → `recommendation-api` deletes that `watch` feedback in Gorse.
  Pausing is a flag both consumers read — locally in `watch-history-api`, through `GetPausedChannels` (cached) in
  `recommendation-api`. Views are still counted while paused.

### 13.15 Notifications

1. Subscription and comment events → `notification-worker` → the preference check → an upsert into the one open
   notification per key, or a new row for a reply or mention (§7.3).
2. Removals count an open notification down only by what it counted (event times compared); reading or hiding closes
   it, so the next event opens a new one.
3. The UI loads the unread count with the page, lists with `GET /notifications`, and marks read, hides or reads all;
   `activity_at` changes only on new activity.
4. Replies and mentions with email on → the first in a thread is emailed straight away, the rest in the next 15
   minutes gathered into one follow-up (§7.3).

### 13.16 Channel deletion and purge

1. **Request**: `POST /channels/current/deletion` (confirmed email; not the last channel) → token (5 min) →
   `SendEmail`.
2. **Confirm**: the link's page (a session is needed, as for every email link) → `POST /channels/deletion/confirm` →
   one transaction:
   `deletion_scheduled_at` a week ahead, a cancel token, `ChannelDeletionScheduled` in the outbox → a BullMQ delayed
   job → `SendEmail` with the date and a cancel link.
3. **The week**: `video-api` makes every video of the channel private (storing each one's visibility), locks
   visibility, publishes new videos as private, and writes a `VideoUpdated` per video, so the index and Gorse drop them.
   Everything else stays live.
4. **Cancel**: from the email (with the token) or from the settings → the column cleared,
   `ChannelDeletionCancelled`, the job removed → `video-api` restores each visibility, unless the account's deletion
   is also scheduled.
5. **Purge**, when the job fires or the sweep finds an overdue row:
    1. `channel-api` writes a purge record listing the nine participants and publishes `ChannelPurgeRequested`.
    2. Each participant deletes what it owns and publishes `ChannelPurged`:

        | Participant | Deletes |
        |---|---|
        | video-api | the channel's videos (a `VideoDeleted` each), files by a background job |
        | comment-api | every comment and reply the channel wrote (with deleted events) |
        | comment-rate-api | the comment rates it gave (with decrements) |
        | video-rate-api | the video rates it gave (with decrements) |
        | subscription-api | its subscriptions both ways (with `SubscriptionDeleted` each) |
        | watch-history-api | its history and paused flag |
        | notification-api | what it received, its preferences, and the reply and mention notifications it caused |
        | search-api | its channel document and video documents |
        | recommendation-api | its Gorse user, feedback and items |

    3. The per-video `VideoDeleted` events cascade further: other channels' comments on those videos, the rates on them,
       the titles in other channels' watch histories, the video's notifications.
    4. Participants missing after a while get `ChannelPurgeRequested` again; every step is idempotent.
    5. Once all have reported: delete the avatar object → `auth-api.RemoveChannelId` → delete the channel row, last.
6. A user still acting as the channel gets `403` from the gateway once their token no longer lists it, and goes to the
   channel selection page.

### 13.17 Account deletion and purge

1. **Request and confirm** mirror the channel's: `POST /accounts/current/deletion` → email → the link's page →
   `POST /accounts/deletion/confirm` → `deletion_scheduled_at` a week ahead, `AccountDeletionScheduled`, a
   delayed job, the second email.
2. **The week**: `video-api` marks the account, makes every video of every channel of the account private, locks
   visibility and publishes new videos as private — the account and every channel stay usable. A banner shows on every
   page.
3. **Cancel**: `AccountDeletionCancelled` → `video-api` restores the videos whose channel has no deletion of its own.
   The two schedules are independent.
4. **Purge**:
    1. `account-api` writes a purge record and publishes `AccountPurgeRequested`.
    2. `channel-api` runs the channel purge (§13.16) for every channel of the account, reusing any already running, and
       publishes `AccountChannelsPurged` when all are done.
    3. `account-api` deletes the stored export archive and its job.
    4. `account-api` → `auth-api.DeleteIdentity` → Keycloak deletes the user; every refresh token dies with it, and
       access tokens expire within minutes.
    5. `account-api` deletes the account row, last.
5. The next refresh gets the deleted-account code, and the UI opens the sign-up page. The email address is free again.

### 13.18 Data export

1. `POST /accounts/current/export` with the password → `auth-api.VerifyPassword` (gRPC; brute force protection
   applies).
2. An export less than an hour old → a presigned URL for the stored archive, expiring when the archive does.
3. Otherwise → `channel-api.ExportChannels` → in parallel, the export methods of `video-api`, `comment-api`,
   `video-rate-api`, `comment-rate-api`, `subscription-api`, `watch-history-api`, `notification-api` → the account
   record added → one JSON file per kind of data, zipped in memory → overwrite the account's object in `exports` → set
   the last export time → a delayed job deletes the object in an hour → a presigned URL with
   `Content-Disposition`.
4. Any failure fails the whole export and stores nothing. The UI opens the URL in a new tab, with a visible link as the
   fallback for popup blockers.

### 13.19 Sending an email

Producer → `SendEmail` on `email-requests` → `email-worker`: dedup key → `auth-api.GetAccountEmail` and
`account-api.GetEmailLanguage` (gRPC) → Handlebars template in that language → nodemailer → SMTP (Mailpit in preview
and development). A failed send is retried and never reaches the producer.

---

## 14. Front end

`apps/ui`: Next.js (App Router), TypeScript, Tailwind and shadcn/ui, built with `output: "standalone"` and served
behind the gateway on the same origin as the API.

* **Structure**: `features/<context>/{domain,application,infrastructure,presentation}` mirroring the back end, plus
  shared `components/` and `lib/`. Two route groups: `(app)` with the navbar and the sidebar, and a layout-free group
  for the auth pages, the channel selection page and the pages opened from email links. All paths in one constants
  file.
* **Data**: page data is fetched in the browser with TanStack Query; the server renders only the shell, from cookies
  (interface language, sidebar state, current channel). The theme is set before the first paint by `next-themes`'
  script. Forms with TanStack Form, toasts with sonner.
* **API client**: one axios client for `/api`, sending the cookies and `X-Channel-Id` from one getter. Errors become a
  typed object with the status, `code`, `details` and field errors; a request that never reached the API is its own
  kind. A `401` starts **one** shared refresh that concurrent requests wait on; a failed refresh clears the session and
  opens the login page (or sign-up for a deleted account).
* **Middleware**: a page that needs a session, opened without one, goes to the login page before it renders, with the
  page it asked for kept as the return address. After login — through the channel selection page when the account has
  several channels — the user lands back on that page and its flow continues; email-link pages included. Only the auth
  pages, the password reset page and the email change confirmation page work without a session. With a session but no
  current channel, any page goes to the channel selection page. A return address outside the app is ignored. The
  middleware reads a plain session marker cookie; the tokens themselves are httpOnly and the refresh cookie is scoped
  to `/api/auth`.
* **Building blocks**:
    * theme: light/dark via `next-themes`, a two-state toggle;
    * i18n: `en` and `uk` catalogues, the language switched without a reload, dates, counts and plurals through `Intl`
      (the library is chosen by a Spike);
    * errors: a retry and a reload error state for pages and sections, error boundaries per route group, failed actions
      as toasts, field errors under their fields, one function turning a code into a localized message;
    * layout: collapsible sidebar (a drawer on mobile), banners for an unconfirmed email and for scheduled deletions,
      each dismissible for 24 hours per browser.
* **Media**: Plyr with hls.js (autoplay off, seek previews from the WEBVTT), `tus-js-client` for uploads, `EventSource`
  for processing progress.
* **Rules the pages follow**: page data failing → a full-page error with a retry; a section failing → its own error
  state; an action failing → a toast. Lists people browse use infinite scroll (feed, comments); lists people scan use
  page controls (search, channel videos, history, rated videos, My comments, notifications).

---

## 15. Environments and deployment

Three environments, one `docker compose up` each; `COMPOSE_FILE` in a machine's `.env` picks one
([environments-explained.md](../explainers/environments-explained.md)).

| Environment | File | Postgres | Apps |
|---|---|---|---|
| Preview | `compose.yaml` | one shared server, a database and user per service | built images, in Docker |
| Production | `compose.prod.yaml` | one server per service that needs one | built images, in Docker |
| Development | `compose.dev.yaml` | one shared server, a database and user per service | on the host, `yarn dev`, hot reload |

The top-level files assemble pieces from `docker/compose/`:

| Piece | Contains |
|---|---|
| `infra.yaml` | nginx gateway, Keycloak, Kafka and Kafka UI, Redis, MinIO, the s3-gateways, tusd, Elasticsearch, Gorse, the mail catcher, the init containers for topics and buckets |
| `postgres.shared.yaml` · `postgres.isolated.yaml` | one server with an init script creating every database and user · one server per service |
| `migrations.yaml` | one dbmate container per database, run once — included by all three environments |
| `apps.yaml` | every API, worker and the UI, from `docker/Dockerfile.nest` (`ARG APP`) and `docker/Dockerfile.ui` |
| `observability.yaml` | behind `--profile observability` (§16) |

**Startup order**: infrastructure → healthy → init containers finished (migrations, topics and users, buckets) →
apps → healthy → the gateway. Every infrastructure container and every app has a healthcheck; apps depend on them with
`service_healthy` and `service_completed_successfully`.

**Development specifics**: Kafka's external listener for apps on the host; the gateway and tusd reach host apps
through `host.docker.internal` (on Linux via `extra_hosts`), with the upstream addresses in environment variables;
Keycloak's pinned hostname works from both sides; presigned URLs use `storage.localhost`.

**Configuration**: the same variable names everywhere with different values, a committed `.env.example`, a `.env.ci`
with dummy values, no service branching on `NODE_ENV`. Shared secrets: `HLS_SECURE_LINK_SECRET` (gateway and
`video-api`), `TUS_WEBHOOK_SECRET` (gateway and `video-upload-api`), one gRPC API key per service, one Kafka SCRAM
password per service, Keycloak admin credentials (`auth-api` only), SMTP settings (`email-worker`).

**Scaling**: APIs are stateless behind the gateway; consumers scale up to their topics' partition counts; the outbox
relay and scheduled jobs run once however many instances there are; tusd stays single until its Spike; production is
one machine — isolation, not redundancy
([scaling-to-multiple-instances.md](../explainers/scaling-to-multiple-instances.md)).

---

## 16. Observability

```text
services & workers ──OTLP (traces, metrics)──►┐
container stdout (JSON logs) ─────────────────► Alloy ──► Loki (logs)
Kafka lag, Postgres, Redis, nginx, MinIO,   ──►        ──► Prometheus (metrics)
Keycloak metrics                                       ──► Tempo (traces)
                                                              │
                                                           Grafana (dashboards, search, alerts)
```

* **Start**: `grafana/otel-lgtm` in one container; later Alloy, Loki, Prometheus, Tempo and Grafana separately, with
  configuration under `docker/observability/`, provisioned data sources and dashboards, and retention (traces 3 days,
  logs 7, metrics 15 with a size cap).
* **Conventions**: `service.name` is the container name; JSON log lines with `trace_id` and `span_id`; Loki labels only
  `service`, `level`, `environment`; Prometheus labels are route templates, never ids; cookies, tokens and passwords are
  never logged.
* **Traces**: OpenTelemetry auto-instrumentation (HTTP, NestJS, `pg`, `ioredis`, `kafkajs`) loaded before the app; the
  outbox relay publishes with the stored `traceparent`, so a request and the consumers of its events share one trace;
  batch consumers link to each message's trace; the gateway adds its own spans with `ngx_otel_module` (after a Spike).
* **Metrics**: requests per service and route; count worker batches; BullMQ queue depth, job duration and failures;
  open SSE connections; Kafka consumer lag per group (the most important one); Postgres, Redis, nginx, MinIO, Keycloak.
* **Dashboards**: Services, Kafka workers, Video pipeline, Infrastructure.
* **Alerts**: consumer lag growing for minutes, failed count-worker batches, error rate per service, failed BullMQ
  jobs, disk use of the MinIO and Postgres volumes — shown in Grafana, later pushed to a Telegram or Discord webhook,
  never through the platform itself.

Details: [observability-plan.md](observability-plan.md),
[observability-explained.md](../explainers/observability-explained.md).

---

## 17. Security

| Boundary | Control |
|---|---|
| Browser → gateway | Tokens in httpOnly, `Secure`, `SameSite` cookies; the gateway verifies every access token against Keycloak's keys; the identity headers are stripped from client requests and set only by the gateway; `X-Channel-Id` checked against the token |
| Gateway → HLS | `secure_link` tokens, recomputed per request, generous expiry, every video tokenized; only `hls/` and `thumbnail.jpg` exposed |
| Gateway → tusd → hooks | `Tus-Webhook-Secret` injected by the gateway and checked by every hook; the upload bound to its video once, at `pre-create` |
| Service → service (gRPC) | a per-service API key in `x-api-key`, mapped to a caller name, unknown keys refused |
| Service → Kafka | SASL/SCRAM-SHA-512, one user per service and worker |
| Service → Postgres | a database and user per service; `CONNECT` revoked from `PUBLIC` |
| Service → Keycloak | only `auth-api`, with the admin credentials |
| Passwords | Keycloak's brute force protection covers login, password change and the export's password check |
| Emailed links | single-use tokens with short lifetimes in Redis, checked against the signed-in account; the deletion cancel tokens live with the scheduled row; only password reset and email change work without a session |
| Downloads and exports | short-lived presigned URLs, issued only after the permission or password check |
| Email content | user text rendered only through Handlebars `{{ }}` |

---

## 18. CI

Two GitHub Actions workflows ([ci-with-github-actions.md](../explainers/ci-with-github-actions.md)):

* **`checks`** on every push: `yarn install --immutable`, lint (Biome), typecheck and unit tests across every
  workspace — Jest for the Nest apps and `lib`, Vitest for the UI.
* **`preview-smoke`** on pull requests and on demand: start the whole preview environment from `.env.ci` with
  `--scale video-upload-api=2`, wait for every healthcheck, generate a 5-second FFmpeg test video, and run
  `scripts/smoke-test.sh`: sign up → initialise an upload → tus upload → poll until the lowest quality is ready →
  publish → watch → fetch the master playlist. On failure the Compose logs are kept as an artifact.

The smoke path crosses the gateway, Keycloak, the sign-up saga, tusd and its hooks, Kafka, BullMQ, FFmpeg, MinIO and
the HLS token check in one run.
