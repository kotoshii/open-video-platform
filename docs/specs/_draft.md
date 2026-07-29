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

General UI & UX

* Dark theme support

Auth

* Account creation and authentication (via email and password)
* Account confirmation (via email)
* Ability to reset password (via email)
* Session persistence (JWT rotation/refresh)
* Session management
* Ability to log out

Channels

* Ability to create multiple channels on one account and switch between them freely
* Manage own channel info/content preferences
* Upload user pic (avatar)
* Delete own channel

Account settings

* Delete account (incl. all channels)
* Change email
* Change password

Feed (Recommendations)

* Feed (video recommendations on homepage - both for authenticated and anonymous)
* Similar videos on the video page

Search

* Search videos (query + optional filters + sorting)
* Search channels (query + sorting: relevancy or subscriber count)

Videos

* Watch videos
* Download videos
* Manage own videos
* Like/dislike videos

Video uploading

* Upload videos

Comments (needs refinement + decision on nested replies)

* See other users' comments (incl. likes/dislikes; support sorting)
* Load replies
* Post comments
* Reply to comments
* Manage own comments/replies (edit, delete)
* Like/dislike comments/replies
* Mention other users in comments/replies

My activity

* See liked videos in one place
* See own comments in one place
* See watch history

Subscriptions

* Subscribe to other channels
* Manage own subscriptions
* See content from subscriptions in one place

Emails

* Receive email confirmation to verify the created account
* Receive email confirmation to reset password
* Receive email confirmation to change email
* Receive email confirmation to change password
* Receive email confirmation to delete account
* Receive email confirmation to delete channel

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