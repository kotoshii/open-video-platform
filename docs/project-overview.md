Figma: https://www.figma.com/design/VGVNL768fIPaiAKDH5bYNU/Open-Video-Platform-Mockups
Specs Draft (Google docs): https://docs.google.com/document/d/1w3OGQFO0zOfoknIgTX-Ki5ODx26wtgLixMBieLUYlbw/edit

### Tech Stack:

* TypeScript
* Next.js + shadcn/ui (FE)
* Nest.js (BE)
* PostgreSQL (Primary DB)
* Redis (caching, Kafka events dedup)
* Kysely (DB query builder)
* Dbmate (DB migration tool)
* Docker
* Docker compose
* Nginx (API Gateway)
* Kafka
* Tus (resumable file uploading)

### Monitoring stack

* Grafana (dashboards, log and trace search, alerts)
* Alloy (collector: receives, collects and forwards all telemetry)
* Loki (logs)
* Prometheus (metrics)
* Tempo (traces)
* OpenTelemetry (instrumentation library inside the services, not a separate service)

See [observability-explained.md](observability-explained.md) and [observability-plan.md](observability-plan.md).

---

### Epics:

Logs & Monitoring

* Grafana
* Alloy
* Loki
* Prometheus
* Tempo
* OpenTelemetry

Setup plan: [observability-plan.md](observability-plan.md)

UI/UX

* [Dark theme support](user-stories/ui-ux/US-UI-UX-01-Dark-theme-support.md)
* [User-friendly readable error messages](user-stories/ui-ux/US-UI-UX-02-User-friendly-errors.md)
  (notifications/toasts)
* [Global layout](user-stories/ui-ux/US-UI-UX-03-Global-layout.md) (navbar and sidebar)

Auth

* [Account creation and authentication](user-stories/auth/US-Auth-01-Account-creation-and-login.md) (via email and
  password)
* [Account confirmation](user-stories/auth/US-Auth-02-Account-confirmation.md) (via email)
* [Ability to reset password](user-stories/auth/US-Auth-03-Password-reset.md) (via email)
* [Session persistence](user-stories/auth/US-Auth-04-Session-persistence.md) (JWT rotation/refresh)
* [Session management](user-stories/auth/US-Auth-05-Session-management.md)
* [Ability to log out](user-stories/auth/US-Auth-06-Logging-out.md)

Channels

* [Ability to create multiple channels on one account](/docs/user-stories/channels/US-Channels-01-create-multiple-channels.md)
* [Ability to switch between channels freely](/docs/user-stories/channels/US-Channels-02-freely-switch-between-channels.md)
* [Manage own channel info/content preferences](/docs/user-stories/channels/US-Channels-03-current-channel-settings.md)
* [Ability to see own channel and other users' channels](/docs/user-stories/channels/US-Channels-04-see-own-and-other-channels.md)
* [Upload user pic](/docs/user-stories/channels/US-Channels-05-upload-user-pic.md) (avatar)
* [Delete own channel](/docs/user-stories/channels/US-Channels-06-delete-own-channel.md)

Account settings

* [Delete account](/docs/user-stories/account/US-Account-01-Delete-own-account.md) (incl. all channels)
* [Change email](/docs/user-stories/account/US-Account-02-Change-email.md)
* [Change password](/docs/user-stories/account/US-Account-03-Change-password.md)

Recommendations

* [Feed](/docs/user-stories/recommendations/US-Recommendations-01-Feed.md)
* [Similar videos on the video page](/docs/user-stories/recommendations/US-Recommendations-02-Similar-videos.md)

Search

* [Search videos](/docs/user-stories/search/US-Search-01-Search-videos.md) (query + optional filters + sorting)
* [Search channels](/docs/user-stories/search/US-Search-02-Search-channels.md) (query + sorting: relevancy or subscriber
  count)
* [Search videos on a specific channel](/docs/user-stories/search/US-Search-03-Search-videos-on-channel-page.md)
  (similar to global videos search, but requires channel ID and possibly returns
  smaller response - not all fields may be necessary)

Videos

* [Watch videos](/docs/user-stories/videos/US-Videos-01-Watch-videos.md)
* [Download videos](/docs/user-stories/videos/US-Videos-02-Download-videos.md)
* [Manage own videos](/docs/user-stories/videos/US-Videos-03-Manage-own-videos.md)
* [Like/dislike videos](/docs/user-stories/videos/US-Videos-04-Like-dislike-videos.md)
* [Upload videos](/docs/user-stories/videos/US-Videos-05-Upload-videos.md)

Comments (nested replies - 1 level: root comment and its flat replies, replying to a reply goes to the same parent
comment)

* [See other users' comments](/docs/user-stories/comments/US-Comments-01-See-comments.md) (incl. likes/dislikes; support
  sorting)
* [Load replies](/docs/user-stories/comments/US-Comments-02-Load-replies.md)
* [Post comments](/docs/user-stories/comments/US-Comments-03-Post-comment.md)
* [Reply to comments/replies](/docs/user-stories/comments/US-Comments-04-Reply-to-comments.md) (replying to a reply
  prefills an @mention of its author)
* [Manage own comments/replies](/docs/user-stories/comments/US-Comments-05-Manage-own-comments.md) (edit, delete)
* [Like/dislike comments/replies](/docs/user-stories/comments/US-Comments-06-Like-dislike-comments.md)

My activity

* [See watch history](/docs/user-stories/my-activity/US-My-activity-01-Watch-history.md)
* [See rated videos in one place](/docs/user-stories/my-activity/US-My-activity-02-Rated-videos.md) (likes and dislikes)
* [See own comments in one place](/docs/user-stories/my-activity/US-My-activity-03-My-comments.md)

Subscriptions

* [Subscribe to other channels](/docs/user-stories/subscriptions/US-Subscriptions-01-Subscribe-to-other-channels.md)
* [Manage own subscriptions](/docs/user-stories/subscriptions/US-Subscriptions-02-Manage-own-subscriptions.md)
* [See content from subscriptions in one place](/docs/user-stories/subscriptions/US-Subscriptions-03-Subscription-content-page.md)

Notifications

* [Configure notifications](/docs/user-stories/notifications/US-Notifications-01-Notifications-config.md): types (new
  subscribers, new comments on my videos, replies to my comments, mentions) and channels (in-app, email)
* [In-app notifications](/docs/user-stories/notifications/US-Notifications-02-In-app-channel.md)
* [Email notifications](/docs/user-stories/notifications/US-Notifications-03-Email-channel.md) (replies and mentions
  only)

I18n

* [Language selector](/docs/user-stories/i18n/US-I18n-01-Language-selector.md) (changes only the language of the UI
  and error/success messages)
* [Localized error messages](/docs/user-stories/i18n/US-I18n-02-Localized-error-messages.md)
* [Localized emails](/docs/user-stories/i18n/US-I18n-03-Localized-emails.md)

=== IDEAS FOR LATER ===

* Playlists
* Save videos (like "Watch later")
* Post pics/gifs in comments
* "Translate comment" / "translate description" / "translate title" - you got the idea, buttons to translate different
  types of content EVERYWHERE
* Ability to use the app anonymously (i.e. without logging in into account)
* Notifications about new videos from subscriptions and about likes on my videos
* List of your subscribers (opens when clicked on subcriber amount link on channel page; paginated + ability to search
  by channel name + sort by subscription date ("recently subscribed" - default) or their own sub amount (
  "most popular"))