[Figma](https://www.figma.com/design/VGVNL768fIPaiAKDH5bYNU/Open-Video-Platform-Mockups) \
[Specs Draft](https://docs.google.com/document/d/1w3OGQFO0zOfoknIgTX-Ki5ODx26wtgLixMBieLUYlbw/edit) (Google docs)

### Tech Stack:

* TypeScript
* Next.js + shadcn/ui (FE)
* Nest.js (BE)
* PostgreSQL (Primary DB)
* Redis (BullMQ queues, view deduplication, short-lived tokens and cooldowns, pub/sub for upload progress)
* Kysely (DB query builder)
* Dbmate (DB migration tool)
* Docker
* Docker compose
* Nginx (API Gateway)
* Kafka
* Tus (resumable file uploading)
* gRPC
* MinIO (S3 file storage)
* BullMQ (scheduled jobs)
* FFmpeg (video processing, thumbnail generation)
* Keycloak (identity provider)
* nodemailer (emails)

Setup requirements for the local stack: [infrastructure.md](infrastructure.md) — how environments are organised:
[environments-explained.md](explainers/environments-explained.md)

Explainers:

* [Kafka deduplication and the inbox pattern](explainers/kafka-dedup-and-inbox-pattern.md)
* [Protecting HLS segments without a database lookup](explainers/hls-segment-protection.md)
* [Keeping notifications from turning into a stream](explainers/notification-aggregation.md)
* [Upload progress across several instances: SSE and Redis pub/sub](explainers/sse-progress-and-redis-pubsub.md)
* [Kubernetes, explained](explainers/kubernetes-explained.md)

Trackers:

* [Open decisions](open-decisions.md) — everything the user stories deliberately left unanswered
* [Known issues](known-issues.md) — problems found in the existing implementation

### Monitoring stack

* Grafana (dashboards, log and trace search, alerts)
* Alloy (collector: receives, collects and forwards all telemetry)
* Loki (logs)
* Prometheus (metrics)
* Tempo (traces)
* OpenTelemetry (instrumentation library inside the services, not a separate service)

See [observability-explained.md](explainers/observability-explained.md)
and [observability-plan.md](observability-plan.md).

---

### Work plan:

#### 0. Preparation

Logs & Monitoring

* Grafana
* Alloy
* Loki
* Prometheus
* Tempo
* OpenTelemetry

Setup plan: [observability-plan.md](observability-plan.md)

UI/UX (mostly related to FE work, but worth keeping in mind during BE development too)

* [Dark theme support](user-stories/ui-ux/US-UI-UX-01-Dark-theme-support.md)
* [User-friendly readable error messages](user-stories/ui-ux/US-UI-UX-02-User-friendly-errors.md)
* [Global layout](user-stories/ui-ux/US-UI-UX-03-Global-layout.md)

I18n

* [Language selector](/docs/user-stories/i18n/US-I18n-01-Language-selector.md)
* [Localized error messages](/docs/user-stories/i18n/US-I18n-02-Localized-error-messages.md)
* [Localized emails](/docs/user-stories/i18n/US-I18n-03-Localized-emails.md)

#### 1. MVP

1. [Auth] [Account creation and authentication](user-stories/auth/US-Auth-01-Account-creation-and-login.md)
2. [Auth] [Account confirmation](user-stories/auth/US-Auth-02-Account-confirmation.md)
3. [Auth] [Session persistence](user-stories/auth/US-Auth-04-Session-persistence.md)
4. [Auth] [Ability to reset password](user-stories/auth/US-Auth-03-Password-reset.md)
5. [Auth] [Ability to log out](user-stories/auth/US-Auth-06-Logging-out.md)

6. [Channels] [Ability to create multiple channels on one account](/docs/user-stories/channels/US-Channels-01-create-multiple-channels.md)
7. [Channels] [Ability to switch between channels freely](/docs/user-stories/channels/US-Channels-02-freely-switch-between-channels.md)

8. [Settings] [Manage own channel info/content preferences](/docs/user-stories/channels/US-Channels-03-current-channel-settings.md)
9. [Settings] [Upload user pic](/docs/user-stories/channels/US-Channels-05-upload-user-pic.md)
10. [Settings] [Change email](/docs/user-stories/account/US-Account-02-Change-email.md)
11. [Settings] [Change password](/docs/user-stories/account/US-Account-03-Change-password.md)

12. [Videos] [Upload videos](/docs/user-stories/videos/US-Videos-05-Upload-videos.md)

13. [Channels] [Ability to see own channel and other users' channels](/docs/user-stories/channels/US-Channels-04-see-own-and-other-channels.md)

14. [Videos] [Manage own videos](/docs/user-stories/videos/US-Videos-03-Manage-own-videos.md)
15. [Videos] [Watch videos](/docs/user-stories/videos/US-Videos-01-Watch-videos.md)
16. [Videos] [Like/dislike videos](/docs/user-stories/videos/US-Videos-04-Like-dislike-videos.md)
17. [Videos] [Download videos](/docs/user-stories/videos/US-Videos-02-Download-videos.md)

18. [Comments] [See other users' comments](/docs/user-stories/comments/US-Comments-01-See-comments.md)
19. [Comments] [Post comments](/docs/user-stories/comments/US-Comments-03-Post-comment.md)
20. [Comments] [Load replies](/docs/user-stories/comments/US-Comments-02-Load-replies.md)
21. [Comments] [Reply to comments/replies](/docs/user-stories/comments/US-Comments-04-Reply-to-comments.md)
22. [Comments] [Manage own comments/replies](/docs/user-stories/comments/US-Comments-05-Manage-own-comments.md)
23. [Comments] [Like/dislike comments/replies](/docs/user-stories/comments/US-Comments-06-Like-dislike-comments.md)

24. [Search] [Search videos](/docs/user-stories/search/US-Search-01-Search-videos.md)
25. [Search] [Search channels](/docs/user-stories/search/US-Search-02-Search-channels.md)
26. [Search] [Search videos on a specific channel](/docs/user-stories/search/US-Search-03-Search-videos-on-channel-page.md)

27. [Subscriptions] [Subscribe to other channels](/docs/user-stories/subscriptions/US-Subscriptions-01-Subscribe-to-other-channels.md)
28. [Subscriptions] [See content from subscriptions in one place](/docs/user-stories/subscriptions/US-Subscriptions-03-Subscription-content-page.md)
29. [Subscriptions] [Manage own subscriptions](/docs/user-stories/subscriptions/US-Subscriptions-02-Manage-own-subscriptions.md)

30. [Recommendations] [Similar videos on the video page](/docs/user-stories/recommendations/US-Recommendations-02-Similar-videos.md)
31. [Recommendations] [Feed](/docs/user-stories/recommendations/US-Recommendations-01-Feed.md)

#### 2. V1 (after MVP) - TODO: need to decide the exact order

1. [Auth] [Session management](user-stories/auth/US-Auth-05-Session-management.md)

2. [My activity] [See watch history](/docs/user-stories/my-activity/US-My-activity-01-Watch-history.md)
3. [My activity] [See rated videos in one place](/docs/user-stories/my-activity/US-My-activity-02-Rated-videos.md)
4. [My activity] [See own comments in one place](/docs/user-stories/my-activity/US-My-activity-03-My-comments.md)

5. [Notifications] [Configure notifications](/docs/user-stories/notifications/US-Notifications-01-Notifications-config.md)
6. [Notifications] [In-app notifications](/docs/user-stories/notifications/US-Notifications-02-In-app-channel.md)
7. [Notifications] [Email notifications](/docs/user-stories/notifications/US-Notifications-03-Email-channel.md)

8. [Settings] [Delete own channel](/docs/user-stories/channels/US-Channels-06-delete-own-channel.md) (GDPR)
9. [Settings] [Delete account](/docs/user-stories/account/US-Account-01-Delete-own-account.md) (GDPR)
10. [Settings] (TODO) Download own user data (GDPR)

### Ideas for later

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