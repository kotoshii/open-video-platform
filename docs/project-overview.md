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
| [User stories](specs/user-stories)                         | 48 stories across 12 epics — the specification the build follows |
| [open-decisions.md](open-decisions.md)               | Everything the stories deliberately left unanswered              |
| [known-issues.md](known-issues.md)                   | Problems found in the existing implementation                    |
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
* Elasticsearch (video and channel search)

**Communication**

* Kafka (events between services)
* gRPC (synchronous calls between services)

**Media**

* MinIO (S3 file storage)
* FFmpeg (video processing, thumbnail generation)
* Tus (resumable file uploading)
* Plyr + hls.js (player)
* Gorse (recommendations and similar videos)

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

## Work plan

Three stages: everything in **Preparation** is groundwork the rest leans on, **MVP** is the platform being usable end
to end, and **V1** is what follows once it is.

### 0. Preparation

Logs & Monitoring

* Grafana
* Alloy
* Loki
* Prometheus
* Tempo
* OpenTelemetry

Setup plan: [observability-plan.md](specs/observability-plan.md)

UI/UX (mostly related to FE work, but worth keeping in mind during BE development too)

* [Dark theme support](specs/user-stories/ui-ux/US-UI-UX-01-Dark-theme-support.md)
* [User-friendly readable error messages](specs/user-stories/ui-ux/US-UI-UX-02-User-friendly-errors.md)
* [Global layout](specs/user-stories/ui-ux/US-UI-UX-03-Global-layout.md)

I18n

* [Language selector](specs/user-stories/i18n/US-I18n-01-Language-selector.md)
* [Localized error messages](specs/user-stories/i18n/US-I18n-02-Localized-error-messages.md)
* [Localized emails](specs/user-stories/i18n/US-I18n-03-Localized-emails.md)

### 1. MVP

1. [Auth] [Account creation and authentication](specs/user-stories/auth/US-Auth-01-Account-creation-and-login.md)
2. [Auth] [Account confirmation](specs/user-stories/auth/US-Auth-02-Account-confirmation.md)
3. [Auth] [Session persistence](specs/user-stories/auth/US-Auth-04-Session-persistence.md)
4. [Auth] [Ability to reset password](specs/user-stories/auth/US-Auth-03-Password-reset.md)
5. [Auth] [Ability to log out](specs/user-stories/auth/US-Auth-06-Logging-out.md)

6. [Channels] [Ability to create multiple channels on one account](specs/user-stories/channels/US-Channels-01-create-multiple-channels.md)
7. [Channels] [Ability to switch between channels freely](specs/user-stories/channels/US-Channels-02-freely-switch-between-channels.md)
8. [Channels] [Channel selection page](specs/user-stories/channels/US-Channels-07-channel-selection-page.md)

9. [Settings] [Manage own channel info/content preferences](specs/user-stories/channels/US-Channels-03-current-channel-settings.md)
10. [Settings] [Upload user pic](specs/user-stories/channels/US-Channels-05-upload-user-pic.md)
11. [Settings] [Change email](specs/user-stories/account/US-Account-02-Change-email.md)
12. [Settings] [Change password](specs/user-stories/account/US-Account-03-Change-password.md)

13. [Videos] [Upload videos](specs/user-stories/videos/US-Videos-05-Upload-videos.md)

14. [Channels] [Ability to see own channel and other users' channels](specs/user-stories/channels/US-Channels-04-see-own-and-other-channels.md)

15. [Videos] [Manage own videos](specs/user-stories/videos/US-Videos-03-Manage-own-videos.md)
16. [Videos] [Watch videos](specs/user-stories/videos/US-Videos-01-Watch-videos.md)
17. [Videos] [Like/dislike videos](specs/user-stories/videos/US-Videos-04-Like-dislike-videos.md)
18. [Videos] [Download videos](specs/user-stories/videos/US-Videos-02-Download-videos.md)

19. [Comments] [See other users' comments](specs/user-stories/comments/US-Comments-01-See-comments.md)
20. [Comments] [Post comments](specs/user-stories/comments/US-Comments-03-Post-comment.md)
21. [Comments] [Load replies](specs/user-stories/comments/US-Comments-02-Load-replies.md)
22. [Comments] [Reply to comments/replies](specs/user-stories/comments/US-Comments-04-Reply-to-comments.md)
23. [Comments] [Manage own comments/replies](specs/user-stories/comments/US-Comments-05-Manage-own-comments.md)
24. [Comments] [Like/dislike comments/replies](specs/user-stories/comments/US-Comments-06-Like-dislike-comments.md)

25. [Search] [Search videos](specs/user-stories/search/US-Search-01-Search-videos.md)
26. [Search] [Search channels](specs/user-stories/search/US-Search-02-Search-channels.md)
27. [Search] [Search videos on a specific channel](specs/user-stories/search/US-Search-03-Search-videos-on-channel-page.md)

28. [Subscriptions] [Subscribe to other channels](specs/user-stories/subscriptions/US-Subscriptions-01-Subscribe-to-other-channels.md)
29. [Subscriptions] [See content from subscriptions in one place](specs/user-stories/subscriptions/US-Subscriptions-03-Subscription-content-page.md)
30. [Subscriptions] [Manage own subscriptions](specs/user-stories/subscriptions/US-Subscriptions-02-Manage-own-subscriptions.md)

31. [Recommendations] [Similar videos on the video page](specs/user-stories/recommendations/US-Recommendations-02-Similar-videos.md)
32. [Recommendations] [Feed](specs/user-stories/recommendations/US-Recommendations-01-Feed.md)

### 2. V1 (after MVP)

1. [Auth] [Session management](specs/user-stories/auth/US-Auth-05-Session-management.md)

2. [My activity] [See watch history](specs/user-stories/my-activity/US-My-activity-01-Watch-history.md)
3. [My activity] [See rated videos in one place](specs/user-stories/my-activity/US-My-activity-02-Rated-videos.md)
4. [My activity] [See own comments in one place](specs/user-stories/my-activity/US-My-activity-03-My-comments.md)

5. [Notifications] [Configure notifications](specs/user-stories/notifications/US-Notifications-01-Notifications-config.md)
6. [Notifications] [In-app notifications](specs/user-stories/notifications/US-Notifications-02-In-app-channel.md)
7. [Notifications] [Email notifications](specs/user-stories/notifications/US-Notifications-03-Email-channel.md)

8. [Settings] [Delete own channel](specs/user-stories/channels/US-Channels-06-delete-own-channel.md) (GDPR)
9. [Settings] [Delete account](specs/user-stories/account/US-Account-01-Delete-own-account.md) (GDPR)
10. [Settings] [Download own user data](specs/user-stories/account/US-Account-04-Download-own-user-data.md) (GDPR)

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
