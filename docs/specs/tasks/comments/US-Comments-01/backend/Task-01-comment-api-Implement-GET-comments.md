## comment-api: Implement GET /comments

Needs: [US-Videos-03 Task-01 — Migrate comment-api to the new structure](../../../videos/US-Videos-03/backend/Task-01-Migrate-comment-api-to-the-new-structure.md),
[US-Videos-04 Task-02 — video-api: Expose a video's rate permission over gRPC](../../../videos/US-Videos-04/backend/Task-02-video-api-Expose-a-videos-rate-permission-over-gRPC.md)

`GET /comments?videoId=...&sort=...` — a page of a video's top-level comments, up to 30

Main flow:

1. Order by newest, oldest, most likes or most dislikes, and page with a keyset cursor built from the ordering value
   and the comment id.
2. Leave replies out; they have their own endpoint
   ([US-Comments-02](../../../../user-stories/comments/US-Comments-02-Load-replies.md)).
3. On the first page, put the acting channel's own top-level comments on top, whatever the sorting, and exclude them
   from the paginated part.
4. Ask `comment-rate-api` over gRPC for this channel's rates on the comments being returned, and include them.

Branch — the video does not exist, the viewer may not watch it, or its author turned comments off:

1. Answer with its code and serve nothing — asked of `video-api` over gRPC. Hiding the section is not the enforcement.

Branch — the sort is by likes or dislikes:

1. Page on the count plus the id. The counts lag by a worker batch, so the order is approximate either way.

Why: offsetting into a list that shifts as comments arrive skips and repeats rows; a keyset cursor reads from where the
last page ended. Pinned own comments are excluded from the paginated part, or they appear a second time when the scroll
reaches their real position.
