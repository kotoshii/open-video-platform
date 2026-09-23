## comment-api: Implement GET /comments/current

Needs: [Task-01 — comment-api: Store the video title on each comment](Task-01-comment-api-Store-the-video-title-on-each-comment.md),
[US-My-activity-01 Task-04 — video-api: Report video availability over gRPC](../../US-My-activity-01/backend/Task-04-video-api-Report-video-availability-over-gRPC.md),
[US-Search-02 Task-03 — channel-api: Look up channels by id over gRPC](../../../search/US-Search-02/backend/Task-03-channel-api-Look-up-channels-by-id-over-gRPC.md)

`GET /comments/current?query=...&page=...` — a page of the acting channel's comments and replies, and its total

Main flow:

1. Page the channel's comments and replies together, newest first. With a query, keep the ones whose text or stored
   video title contains it.
2. Ask `video-api` about their videos, and `channel-api` for the names of the available videos' channels.
3. Return each with its id, text, posted time, the author's stored name and, for a top-level comment, its reply count.
   Its video comes as a card — thumbnail, title and channel name — or as a placeholder when it is private.

Why: the page opens the video with `?comment=<id>`, and the thread endpoint resolves a reply's id to its top-level
comment by itself ([US-Comments-01](../../../../user-stories/comments/US-Comments-01-See-comments.md)) — so the list
needs no parent ids to build its links.
