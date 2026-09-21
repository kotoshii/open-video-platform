# Service map

Which service owns which stories, which data, and which workers — and the rules that decide it. The stories describe
behaviour; this file decides where that behaviour lives.

"Exists" means the service is in the repository today and has to be migrated to the new structure before new work
goes into it. "New" means it has to be created.

---

## Rules

1. **Each service owns its database, and nothing else writes to it.** A worker belongs to the service whose table it
   writes, not to the service that emits the events it consumes, and it uses that service's database credentials.
2. **Only `auth-api` talks to Keycloak.** Every other service that needs something from the identity provider asks
   `auth-api` over gRPC. Keycloak is an external system, and one boundary around it means one set of admin credentials,
   one place with Keycloak-specific code, and one service to change if it is ever replaced.
3. **Kafka for events, gRPC for questions.** Something that other services react to is an event. Something a service
   needs an answer to inside a request is a gRPC call.
4. **Age filtering data:**
    * the viewer's date of birth travels in the token as Keycloak's standard `birthdate` claim, so every service
      computes age locally, with no call. It is a date rather than an "is adult" flag, because age changes over time;
    * the acting channel's "Show age-restricted content" setting belongs to `channel-api`. Listing services fetch it
      over gRPC and cache it briefly, since it can change at any moment.
5. **The email address is stored only in Keycloak**, so anything that needs it asks `auth-api`.

## Services

| Service              | Status                   | Owns                                                                                                        | Stories                                                                                             |
|----------------------|--------------------------|-------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| `auth-api`           | exists                   | Identity: sign-up, login, tokens, sessions, passwords, the email address and its confirmation, every write to Keycloak (`channelIds`, `birthdate`, `email_verified`, deleting the user) | Auth-01, 02, 03, 04, 05, 06 · Account-02, 03                                                         |
| `account-api`        | exists, as **`user-api`** — rename | The account record, the email language, the account deletion schedule and purge, data export        | Account-01, 04 · I18n-03                                                                            |
| `channel-api`        | exists                   | Channels, their settings including "Show age-restricted content", the channel deletion schedule and purge   | Channels-01, 02, 03, 04 (header), 05, 06, 07                                                        |
| `video-upload-api`   | exists                   | Upload sessions, the tus hooks, upload and processing progress over SSE                                     | Videos-05 (upload)                                                                                  |
| `video-api`          | exists                   | Videos and their visibility, publishing, watching, downloads, a channel's video list and its search         | Videos-01, 02, 03, 05 (record, publish) · Channels-04 (video list, count) · Search-03 · Subscriptions-03 (video list) |
| `video-rate-api`     | exists                   | Video likes and dislikes                                                                                     | Videos-04 · My-activity-02                                                                          |
| `comment-api`        | exists                   | Comments and replies, their threads, pinning, `?comment=<id>` links                                         | Comments-01, 02, 03, 04, 05 · My-activity-03                                                        |
| `comment-rate-api`   | exists                   | Comment likes and dislikes                                                                                   | Comments-06                                                                                         |
| `subscription-api`   | exists                   | Subscriptions                                                                                                | Subscriptions-01, 02, 03 (avatar row)                                                               |
| `watch-history-api`  | new                      | Watch history and its pause flag                                                                             | My-activity-01                                                                                      |
| `notification-api`   | new                      | Notification preferences, in-app notifications, batching of notification emails                             | Notifications-01, 02, 03                                                                            |
| `search-api`         | new                      | The Elasticsearch index — videos and channels                                                                | Search-01, 02 · Recommendations-02                                                                  |
| `recommendation-api` | new                      | The feed, and the feedback sent to Gorse                                                                     | Recommendations-01                                                                                  |
| `ui`                 | exists as an empty folder | The Next.js frontend                                                                                        | UI-UX-01, 02, 03 · I18n-01 · every story's frontend part                                           |

Shared code in `lib/`: the error codes every API returns and the frontend translates (I18n-02, UI-UX-02), Kafka,
configuration, and the other cross-service building blocks.

## Workers

| Worker                        | Belongs to        | Status | Does                                                                                           |
|-------------------------------|-------------------|--------|------------------------------------------------------------------------------------------------|
| `video-view-count-worker`     | `video-api`       | exists | Counts views, deduplicated per viewer per video per 24 hours                                   |
| `video-rate-count-worker`     | `video-api`       | exists | Applies video like and dislike counts                                                          |
| `video-comment-count-worker`  | `video-api`       | exists | Applies each video's comment total, replies included                                           |
| `comment-rate-count-worker`   | `comment-api`     | exists | Applies comment like and dislike counts                                                        |
| `comment-reply-count-worker`  | `comment-api`     | new    | Applies each comment's reply count                                                             |
| `subscriber-count-worker`     | `channel-api`     | exists | Applies each channel's subscriber count                                                        |
| `video-processing-worker`     | the video pipeline | new   | Probes, encodes and packages uploads, generates thumbnails and previews (BullMQ, FFmpeg)       |
| `email-worker`                | —                 | new    | Sends every email: consumes "send this email" events, owns the templates and nodemailer, looks up the address from `auth-api` and the language from `account-api` when it sends |
| notification worker           | `notification-api` | new   | Creates and aggregates notifications, counts them down, flushes batched emails                 |

## Flows that cross services

* **Sign-up** is a saga run by `auth-api`: create the Keycloak user, then ask `account-api` for the account record and
  `channel-api` for the first channel. If either fails, delete what was already created, starting with the Keycloak
  user. This is the kind of multi-service flow with a real undo that the saga pattern is for.
* **Creating a channel**: `channel-api` asks `auth-api` to add the channel id to `channelIds` — synchronously, before
  it responds — and the frontend then refreshes its tokens, so the new token carries the new channel.
* **Channel purge**, run by `channel-api`: a fan-out over Kafka in which every service deletes the data it owns, and
  `auth-api` removes the channel id. The full list is in US-Channels-06.
* **Account purge**, run by `account-api`: the channel purge for every channel of the account, then `auth-api`
  deletes the identity.
* **Video deletion**, run by `video-api`: a fan-out over Kafka, each service deleting what it owns (US-Videos-03).
* **Data export**, run by `account-api`: `auth-api` checks the password, then a parallel gRPC fan-out collects every
  service's data. It is a read, so there is nothing to undo.
* **Email change and confirmation** stay inside `auth-api`: it writes the address and the verified flag, ends
  sessions, and returns fresh tokens in the same response.
