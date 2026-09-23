## comment-api: Implement POST /comments/{videoId}

Needs: [US-Comments-01 Task-01 — comment-api: Implement GET /comments](../../US-Comments-01/backend/Task-01-comment-api-Implement-GET-comments.md),
[US-Videos-04 Task-02 — video-api: Expose a video's rate permission over gRPC](../../../videos/US-Videos-04/backend/Task-02-video-api-Expose-a-videos-rate-permission-over-gRPC.md),
[Task-02 — channel-api: Look up channels by id over gRPC](Task-02-channel-api-Look-up-channels-by-id-over-gRPC.md)

`POST /comments/{videoId}` — body `{ text }`

Main flow:

1. Take the author from the `Channel-ID` header the gateway set — never from the body.
2. Ask `video-api` over gRPC whether the video exists, may be watched by this viewer, and allows comments.
3. Ask `channel-api` over gRPC for the author's name and avatar, which the comment keeps a copy of.
4. In one transaction, insert the comment and write the comment-created event to the outbox.
5. Return the stored comment, with the author's name and avatar.

Branch — the text is empty or longer than 5000 characters:

1. A field-level error with the limit; nothing is stored.

Branch — the author turned comments off, or the video does not exist:

1. Reject with its code. Hiding the box in the UI is not the enforcement.

Why: the response carries the whole comment so the page can render it at the top without reloading the list, which is
what keeps a new comment visible under any sort order.
