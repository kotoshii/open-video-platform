# Open decisions

Everything the user stories deliberately left unanswered, in one place. Each item says where it is written up in full.

This is not a list of bugs — those live in [known-issues.md](./known-issues.md). These are choices that have to be made
before or while the corresponding story is built.

## Still open

Nothing at the moment.

## Traps — decided, but easy to get wrong while building

| What | Where |
|------|-------|
| Watch history is written from every watch event, not from the deduplicated view count — a repeat watch must still move the video to the top. And pausing the history must not stop views from being counted. | [US-My-activity-01](./specs/user-stories/my-activity/US-My-activity-01-Watch-history.md) |
| **Accessible by link** is enforced on the *listing* paths, not the watch path: the video must be kept out of the search index, feed candidates and the channel's video list, while the watch path treats it like a public video. Missing one listing leaks the video. | [US-Videos-03](./specs/user-stories/videos/US-Videos-03-Manage-own-videos.md) |
| Pinned own comments, and a thread opened with `?comment=<id>`, must be excluded from the paginated list, or they appear twice once infinite scroll reaches their real position. | [US-Comments-01](./specs/user-stories/comments/US-Comments-01-See-comments.md) |
| Elasticsearch caps how deep `from`/`size` paging can go (`index.max_result_window`); past it the query errors instead of returning an empty page. Cap the reachable pages or use `search_after`. | [US-Search-01](./specs/user-stories/search/US-Search-01-Search-videos.md) |
| Recommendations plus infinite scroll need a result set fixed on the first request and paged over, not re-asked per batch — otherwise duplicates appear as the user scrolls. | [US-Recommendations-01](./specs/user-stories/recommendations/US-Recommendations-01-Feed.md) |
| The original file and the private thumbnails share a prefix with the publicly served `hls/`. The Nginx routes must be an explicit allowlist (`hls/` and the public `thumbnail.jpg` only) — a wildcard under the prefix exposes the full-quality source. | [US-Videos-05](./specs/user-stories/videos/US-Videos-05-Upload-videos.md) |
| The public thumbnail path stays the same when the author changes the thumbnail, so it needs a version or content hash in the URL — otherwise caches keep serving the old image. | [US-Videos-05](./specs/user-stories/videos/US-Videos-05-Upload-videos.md) |
| Quality-ready events do not arrive in order — 1080p can finish before 480p. State has to be per quality, never a sequence. | [US-Videos-05](./specs/user-stories/videos/US-Videos-05-Upload-videos.md) |
| A video can be published once one quality exists, so a published video may still be gaining qualities. The player has to work with whatever the HLS master playlist currently offers. | [US-Videos-05](./specs/user-stories/videos/US-Videos-05-Upload-videos.md) |
| Redis must run with `maxmemory-policy noeviction`: BullMQ keeps its jobs in Redis, and an eviction policy such as `allkeys-lru` can silently delete queued jobs under memory pressure. TTL-based keys (tokens, cooldowns, view deduplication) expire on their own and do not need eviction. A cache that relies on eviction belongs in a separate Redis instance. | [US-Videos-05](./specs/user-stories/videos/US-Videos-05-Upload-videos.md) |
| Redis pub/sub for upload progress carries notifications, never state. It is at-most-once, so the client must receive the current status from the database on every connect and reconnect, and only then live updates. Test with at least two video-upload instances — with one, everything works even when the pub/sub step is missing. | [US-Videos-05](./specs/user-stories/videos/US-Videos-05-Upload-videos.md) |
| A notification's `activity_at` must change only on new activity — never on read, hide or decrement — or reading an old notification moves it to the top. A generic last-modified column maintained by the ORM or a trigger is the wrong one. | [US-Notifications-02](./specs/user-stories/notifications/US-Notifications-02-In-app-channel.md) |
| Counting a notification down only applies if the removed subscription or comment was created at or after the notification's first event. Compare event times, never the worker's processing time. | [US-Notifications-01](./specs/user-stories/notifications/US-Notifications-01-Notifications-config.md) |
| The partial unique index on open notifications needs `NULLS NOT DISTINCT`: subscriber notifications have no subject, and a plain unique index never treats two NULLs as equal. | [notification-aggregation.md](explainers/notification-aggregation.md) |
| The mentioned channel is worked out on the server from the reply being answered, never accepted from the client — otherwise anyone can notify any channel. | [US-Comments-04](./specs/user-stories/comments/US-Comments-04-Reply-to-comments.md) |
| A scheduled channel or account deletion must survive Redis losing its data: the BullMQ delayed job is the trigger, never the record. `deletion_scheduled_at` in Postgres is the source of truth, and a periodic sweep has to pick up rows whose job went missing — otherwise a deletion silently never runs and the user believes their data is gone. | [US-Channels-06](./specs/user-stories/channels/US-Channels-06-delete-own-channel.md) |
| Data export: the hour between exports, the link's lifetime and the archive's lifetime are one value. A link issued for an already stored archive must expire when that archive does, not an hour after it was issued, or it stops working while still looking valid. S3 lifecycle rules cannot expire by the hour, so the deletion is a delayed job. | [US-Account-04](./specs/user-stories/account/US-Account-04-Download-own-user-data.md) |
| Keycloak's built-in "Verify Email" required action must stay **off**. With it on, Keycloak refuses to issue tokens to a user whose email is unconfirmed, which quietly undoes letting unconfirmed users into the app. | [US-Auth-02](./specs/user-stories/auth/US-Auth-02-Account-confirmation.md) |
| Confirming an email must re-issue the token pair. Whether the email is confirmed travels in the token's `email_verified` claim, so without a new token the features that need it stay unavailable until the next refresh. | [US-Auth-02](./specs/user-stories/auth/US-Auth-02-Account-confirmation.md) |
| Elasticsearch's `more_like_this` defaults return nothing for this data: `min_term_freq` 2 ignores every word that appears once in a video — which is most title words — and `min_doc_freq` 5 ignores every word found in fewer than five videos, which on a small platform is most of them. Set both to 1, or similar videos come back empty with no error. | [US-Recommendations-02](./specs/user-stories/recommendations/US-Recommendations-02-Similar-videos.md) |
| Keycloak's SSO Session Max defaults to 10 hours and ends every session at that point however active the user is. It has to be raised along with SSO Session Idle, or the 30-day session never happens. | [US-Auth-04](./specs/user-stories/auth/US-Auth-04-Session-persistence.md) |
