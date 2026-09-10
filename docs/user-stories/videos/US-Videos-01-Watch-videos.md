## US-Videos-01 — Watch videos

**Description**

As a registered user with a verified account, I want to open a video page and watch the video with a proper set of
player controls, so that I can actually consume the content the platform hosts.

**User flows**

Watch a video — main flow:

1. User clicks a video item on any page — the feed, a channel page, search results, or the similar videos next to
   another video.
2. A dedicated page opens and loads the video info and the player.
3. User sees:
    * the video player;
    * the title, which wraps onto several lines when it is long;
    * the view count and the upload date;
    * the like and dislike counts with their buttons ([US-Videos-04](./US-Videos-04-Like-dislike-videos.md));
    * the author's avatar, channel name and subscriber count, with a subscribe button (Subscriptions epic in
      [project-overview.md](../../project-overview.md));
    * the video description, collapsed, with a control to expand it;
    * the download button ([US-Videos-02](./US-Videos-02-Download-videos.md));
    * the similar videos on the right
      ([US-Recommendations-02](../recommendations/US-Recommendations-02-Similar-videos.md));
    * the comments section below ([US-Comments-01](../comments/US-Comments-01-See-comments.md)).
4. Nothing starts on its own — autoplay is disabled.
5. User clicks play in the player and the video starts.
6. User works with the player and the full set of features it offers that the platform supports: play and pause, seek,
   see a preview while seeking, change quality, change playback speed, toggle picture-in-picture, toggle fullscreen.

Watch a video — branches:

* **Expanding the description** (step 3) — "See more..." expands the description in place, and it can be collapsed
  again.
* **Video is still processing** (step 2) — the page shows only that state. There is no player, and the video info,
  comments and similar videos are not loaded at all.
* **Viewer is not allowed to watch** (step 2) — the video is private, or it is age-restricted and the viewer is too
  young for it ([US-Auth-01](../auth/US-Auth-01-Account-creation-and-login.md)). The page shows only the corresponding
  state, again with nothing else loaded.
* **Video does not exist** (step 2) — the page shows a full-page error state.
* **Loading fails** (step 2) — a full-page error state ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).
  Failures inside the comments or the similar videos are
  handled by their own stories and do not take the page down.

**Acceptance criteria**

* The video page opens from a video item anywhere in the app and loads the video info and the player.
* The page shows the player, the title, the view count, the upload date, the like and dislike counts with their
  buttons, the author's channel with its subscriber count and a subscribe button, a collapsed description with an
  expand control, a download button, the similar videos and the comments section.
* A long title wraps onto several lines instead of being cut off.
* The description is collapsed by default and expands in place.
* Dates are shown relative to now ("5 months ago"), the same way as everywhere else in the app.
* Autoplay is disabled — the video starts only when the user presses play.
* The player supports play and pause, seeking, a preview while seeking, quality selection, playback speed,
  picture-in-picture and fullscreen.
* A view is registered when the page loads the video for watching, not when playback starts.
* Repeated views by the same viewer within the deduplication window do not increase the view count.
* A video that is still processing shows only that state — no player, no video info, no comments, no similar videos.
* A video the viewer is not allowed to watch shows only the corresponding state, with nothing else loaded.
* A video that does not exist shows a full-page error state.
* Failures loading the page are shown as a full-page error.

**Tech notes**

* Use a third-party player rather than building one. Plyr is preferred: as of September 2026 it is stable, while
  Video.js is at v10 RC with a release planned "by the end of 2026".
* Video is served as HLS — a playlist plus segments, in several renditions, stored in S3 (MinIO) next to the
  progressive MP4 of each quality that downloads use ([US-Videos-02](./US-Videos-02-Download-videos.md)). Plyr plays it
  through hls.js, which picks the rendition by
  itself; the quality control overrides that choice rather than replacing it.
* Playlists and segments are served by Nginx through `nginx-s3-gateway`, which proxies the bucket directly — not by
  the API, and not through presigned URLs. Playback makes one request per segment, so signing each of them and
  rewriting the playlist with URLs that expire mid-video is not workable. Downloads are the opposite shape — one large
  file, one presigned URL ([US-Videos-02](./US-Videos-02-Download-videos.md)).
* Nginx is already the API gateway, so this is a route rather than a new component, and segment responses can be cached
  there.
* That moves access control for segments out of the API, so private and age-restricted videos are protected by a
  **signed token in the path prefix**: the watch endpoint, having already authorized the viewer, returns a playlist URL
  of the form `/hls/{expiry}/{token}/{videoId}/master.m3u8`, and Nginx validates the token by recomputing a hash with a
  shared secret. HLS playlists reference their segments relatively, so every segment request inherits the prefix and
  carries the token without any playlist being rewritten. No database lookup and no subrequest per segment — see
  [hls-segment-protection.md](../../hls-segment-protection.md).
* Only private and age-restricted videos are tokenized. Public ones keep plain URLs, because a tokenized URL is unique
  per viewer and cannot be shared by any cache.
* The expiry has to cover the video plus pauses. If it lapses mid-playback the segments start returning 403, which
  looks like a broken player rather than a permission check.
* The watch endpoint still carries a TODO to put the HLS playlist URL into its response. Nothing can play until that is
  done, so it is the first thing this story needs.
* Visibility is decided on the server, in the same call that returns the video: a video that is not published does not
  exist for anyone but its author, and private or age-restricted videos are refused. The page renders only what the API
  agrees to return, which is why the blocked states show nothing else.
* Watching emits a `VideoViewed` Kafka event keyed by video id, carrying the acting channel as the viewer together with
  the user agent and the IP address.
* The `video-view-count-worker` deduplicates before counting: `ViewsDeduplicationService` reserves a Redis key per
  viewer with a TTL, so repeat views inside that window are ignored. The TTL is what "once per viewer" actually means
  here, so it needs a decided value.
* **The dedup key is built from the viewer alone and does not include the video id**, so counting a view of one video
  currently blocks counting views of every other video for that viewer until the TTL expires — see
  [known-issues.md](../../known-issues.md).
* Seek previews need thumbnail sprites generated while the video is processed, which makes this story depend on the
  Video uploading epic.
* Since anonymous viewing is not planned, the acting channel is always present as the viewer; the IP and user agent
  fallback in the dedup service only matters if anonymous viewing is ever added.

**Links**

* [Figma mockups](https://www.figma.com/design/VGVNL768fIPaiAKDH5bYNU/Open-Video-Platform-Mockups?node-id=18-722&p=f&t=0uaBWT7mgjLi4HBf-0)
* [Plyr](https://github.com/sampotts/plyr)
* [hls-segment-protection.md](../../hls-segment-protection.md)
* [US-Comments-01 — See comments](../comments/US-Comments-01-See-comments.md)
* [US-Recommendations-02 — Similar videos](../recommendations/US-Recommendations-02-Similar-videos.md)
* [US-Videos-02 — Download videos](./US-Videos-02-Download-videos.md)
* [US-Videos-04 — Like/dislike videos](./US-Videos-04-Like-dislike-videos.md)
* [US-UI-UX-02 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)

**Tasks**

BE:

* TODO

FE:

* TODO
