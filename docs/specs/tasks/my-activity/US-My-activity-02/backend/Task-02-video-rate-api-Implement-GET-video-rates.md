## video-rate-api: Implement GET /video-rates

Needs: [Task-01 — video-rate-api: Store the video title on each rate](Task-01-video-rate-api-Store-the-video-title-on-each-rate.md),
[US-My-activity-01 Task-04 — video-api: Report video availability over gRPC](../../US-My-activity-01/backend/Task-04-video-api-Report-video-availability-over-gRPC.md),
[US-Comments-03 Task-02 — channel-api: Look up channels by id over gRPC](../../../comments/US-Comments-03/backend/Task-02-channel-api-Look-up-channels-by-id-over-gRPC.md)

`GET /video-rates?onlyLiked=...&query=...&page=...` — a page of the acting channel's rates and its total

Main flow:

1. Page the channel's rates by when they were last set, newest first, likes only when `onlyLiked` is set. With a query,
   keep the rates whose stored title contains it.
2. Ask `video-api` about the page's videos, and `channel-api` for the channel names of the available ones.
3. Return an available one as a card — thumbnail, title, channel name, view count, when it was rated and the rate — and
   a private one as a placeholder with only the rated time and the rate.

Why: a switched rate moves to the top on the next load, and the "only liked" filter applies only then — which is why a
video switched to a dislike stays where it is until the list is loaded again.
