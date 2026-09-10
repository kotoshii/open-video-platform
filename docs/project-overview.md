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

### Monitoring stack (subject to change)

* Prometheus (metrics monitoring)
* Grafana (metrics visualization)
* Loki (logs)
* OpenTelemetry (traces)

---

### Epics:

UI/UX

* [Dark theme support](user-stories/ui-ux/US-UI-UX-01-Dark-theme-support.md)
* [User-friendly readable error messages](user-stories/ui-ux/US-UI-UX-02-User-friendly-errors.md)
  (notifications/toasts)

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

Video uploading

* Upload videos

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

* See liked videos in one place
* See own comments in one place
* See watch history

Subscriptions

* Subscribe to other channels
* Manage own subscriptions
* See content from subscriptions in one place

Notifications

* In-App notifications about new content, comment replies/mentions, interactions with my videos etc
* Email notifications about new content, comment replies/mentions, interactions with my videos etc
* Ability to configure notifications: types (i.e. notifs about what I want to receive), channels (email/in-app)

I18n

* Language selector in UI (changes only language of the UI)
* Localized error messages

Logs & Monitoring (stack below - subject to change)

* Grafana
* Loki
* OpenTelemetry
* Prometheus

=== IDEAS FOR LATER ===

* Playlists
* Save videos (like "Watch later")
* Post pics/gifs in comments
* "Translate comment" / "translate description" / "translate title" - you got the idea, buttons to translate different
  types of content EVERYWHERE
* Ability to use the app anonymously (i.e. without logging in into account)
* List of your subscribers (opens when clicked on subcriber amount link on channel page; paginated + ability to search
  by channel name + sort by subscription date ("recently subscribed" - default) or their own sub amount (
  "most popular"))