# Open decisions

Everything the user stories deliberately left unanswered, in one place. Each item says where it is written up in full.

This is not a list of bugs — those live in [known-issues.md](./known-issues.md). These are choices that have to be made
before or while the corresponding story is built.

## Blocking — a story cannot be finished without these

| What | Where |
|---|---|
| The watch endpoint does not return the HLS playlist URL (`// TODO` in `watchVideoByIdOrThrow`). Nothing can play until it does. | [US-Videos-01](./user-stories/videos/US-Videos-01-Watch-videos.md) |
| Whether Keycloak can end a single session or only all of them. Six stories assume one or the other; the answer changes them. | [US-Auth-06](./user-stories/auth/US-Auth-06-Logging-out.md) |
| `comment-reply-count-worker` does not exist and has to be built, following the same pattern as the other counters. | [US-Comments-02](./user-stories/comments/US-Comments-02-Load-replies.md) |

## Values to settle

| What | Where |
|---|---|
| Account confirmation: resend cooldown and link lifetime (the original draft used 5 minutes for both). | [US-Auth-02](./user-stories/auth/US-Auth-02-Account-confirmation.md) |
| Password reset: cooldown and link lifetime (the story suggests ~10 minutes for the cooldown). | [US-Auth-03](./user-stories/auth/US-Auth-03-Password-reset.md) |
| Access and refresh token lifetimes, and what "remember me" does. | [US-Auth-04](./user-stories/auth/US-Auth-04-Session-persistence.md) |
| Maximum number of channels per account. | [US-Channels-01](./user-stories/channels/US-Channels-01-create-multiple-channels.md) |
| View deduplication TTL — this is what "one view per viewer" actually means. | [US-Videos-01](./user-stories/videos/US-Videos-01-Watch-videos.md) |

## Behaviour to decide

| What | Where |
|---|---|
| Turning off comments or rates on a video: are the existing ones hidden, or just frozen so no new ones arrive? | [US-Videos-03](./user-stories/videos/US-Videos-03-Manage-own-videos.md) |
| Video deletion: soft or hard. No restore flow exists, which points at hard — but the files are large, so removing them from S3 may belong in a background job rather than the request. | [US-Videos-03](./user-stories/videos/US-Videos-03-Manage-own-videos.md) |
| Does a thumbnail change need re-indexing? Search does not rank on it, but the video list and the feed cache show it. Ride along on the same event, or handle separately? | [US-Videos-03](./user-stories/videos/US-Videos-03-Manage-own-videos.md) |
| Does the feed exclude videos the channel has already watched? | [US-Recommendations-01](./user-stories/recommendations/US-Recommendations-01-Feed.md) |
| Are recommendations cached per channel, and for how long? Gorse already caches its own results, so a second cache may be redundant. | [US-Recommendations-01](./user-stories/recommendations/US-Recommendations-01-Feed.md) |
| The random top-up for similar videos — same-channel or trending would read better next to a video the user chose deliberately. | [US-Recommendations-02](./user-stories/recommendations/US-Recommendations-02-Similar-videos.md) |
| Channel page counts (subscribers, videos): read live, or denormalized counters updated by events? | [US-Channels-04](./user-stories/channels/US-Channels-04-see-own-and-other-channels.md) |
| Is a Kafka event fired when an email changes? Depends on whether any service other than Keycloak stores the address. | [US-Account-02](./user-stories/account/US-Account-02-Change-email.md) |

## Technical approach to pick

| What | Where |
|---|---|
| Where avatar downscaling to 160x160 happens: in the browser before upload, in the Channels service, or in an async worker. GIFs must keep their animation. | [US-Channels-05](./user-stories/channels/US-Channels-05-upload-user-pic.md) |
| How server-rendered pages get the current channel, given localStorage is not readable during SSR (e.g. mirror it into a cookie). | [US-Channels-02](./user-stories/channels/US-Channels-02-freely-switch-between-channels.md) |
| Which embedding model produces the vectors for content-based similar videos — an external API or a local one. | [US-Recommendations-02](./user-stories/recommendations/US-Recommendations-02-Similar-videos.md) |
| How SSE progress updates reach the right instance. A connection is held by one video-upload instance while the Kafka events feeding it may be consumed by another — needs sticky routing or a shared pub/sub. | [US-Videos-05](./user-stories/videos/US-Videos-05-Upload-videos.md) |

## Gaps — something is missing rather than undecided

| What | Where |
|---|---|
| Similar videos depend on videos carrying tags, category and language. The edit dialog supplies tags; the upload story has to capture them from the start. | [US-Recommendations-02](./user-stories/recommendations/US-Recommendations-02-Similar-videos.md) |

## Traps — decided, but easy to get wrong while building

| What | Where |
|---|---|
| **Accessible by link** is enforced on the *listing* paths, not the watch path: the video must be kept out of the search index, feed candidates and the channel's video list, while the watch path treats it like a public video. Missing one listing leaks the video. | [US-Videos-03](./user-stories/videos/US-Videos-03-Manage-own-videos.md) |
| Pinned own comments must be excluded from the paginated list, or they appear twice once infinite scroll reaches their real position. | [US-Comments-01](./user-stories/comments/US-Comments-01-See-comments.md) |
| Elasticsearch caps how deep `from`/`size` paging can go (`index.max_result_window`); past it the query errors instead of returning an empty page. Cap the reachable pages or use `search_after`. | [US-Search-01](./user-stories/search/US-Search-01-Search-videos.md) |
| Recommendations plus infinite scroll need a result set fixed on the first request and paged over, not re-asked per batch — otherwise duplicates appear as the user scrolls. | [US-Recommendations-01](./user-stories/recommendations/US-Recommendations-01-Feed.md) |
| The original file and the private thumbnails share a prefix with the publicly served `hls/`. The Nginx routes must be an explicit allowlist (`hls/` and the public `thumbnail.jpg` only) — a wildcard under the prefix exposes the full-quality source. | [US-Videos-05](./user-stories/videos/US-Videos-05-Upload-videos.md) |
| The public thumbnail path stays the same when the author changes the thumbnail, so it needs a version or content hash in the URL — otherwise caches keep serving the old image. | [US-Videos-05](./user-stories/videos/US-Videos-05-Upload-videos.md) |
| Quality-ready events do not arrive in order — 1080p can finish before 480p. State has to be per quality, never a sequence. | [US-Videos-05](./user-stories/videos/US-Videos-05-Upload-videos.md) |
| A video can be published once one quality exists, so a published video may still be gaining qualities. The player has to work with whatever the HLS master playlist currently offers. | [US-Videos-05](./user-stories/videos/US-Videos-05-Upload-videos.md) |
