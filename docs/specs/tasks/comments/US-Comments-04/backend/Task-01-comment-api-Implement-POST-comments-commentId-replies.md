## comment-api: Implement POST /comments/{commentId}/replies

Needs: [US-Comments-03 Task-03 — comment-api: Implement POST /comments/{videoId}](../../US-Comments-03/backend/Task-03-comment-api-Implement-POST-comments-videoId.md),
[US-Videos-04 Task-02 — video-api: Expose a video's rate permission over gRPC](../../../videos/US-Videos-04/backend/Task-02-video-api-Expose-a-videos-rate-permission-over-gRPC.md),
[US-Comments-02 Task-03 — comment-reply-count-worker: Apply the reply counts](../../US-Comments-02/backend/Task-03-comment-reply-count-worker-Apply-the-reply-counts.md)

`POST /comments/{commentId}/replies` — body `{ text, inReplyToId?, mentionKept? }`

Main flow:

1. The parent in the path is always a top-level comment; enforce that in the schema, so a reply can never point at
   another reply.
2. Ask `video-api` over gRPC whether the parent's video exists, may be watched by this viewer, and allows comments —
   the same check a new comment makes.
3. When the reply answers another reply and the prefilled mention was kept, work out the mentioned channel from that
   reply's author and store it as structured data.
4. In one transaction, insert the reply and write both events to the outbox: the one the video's comment count follows,
   and the one the reply count follows.

Branch — the author turned comments off, the video does not exist, or the viewer may not watch it:

1. Reject with its code, as for a comment. Hiding "Reply" in the UI is not the enforcement.

Branch — the mention was removed:

1. Store no mentioned channel, so nobody is notified.

Branch — the text is empty or over 5000 characters, the mention included:

1. A field-level error.

Why: the mentioned channel is worked out here rather than taken from the request — accepting a channel id would let
anyone notify any channel. A name is never parsed out of the text either: names are not unique and the prefilled text
can be edited.
