## video-api: Implement PUT /videos/{videoId}

Needs: [Task-04 — video-api: Create a video record over gRPC](Task-04-video-api-Create-a-video-record-over-gRPC.md)

`PUT /videos/{videoId}` — body `{ title, description, tags, allowComments, allowRates, visibility, ageRestricted }`

Main flow:

1. Check the video belongs to the acting channel.
2. Save the details, and write the video-updated event to the outbox in the same transaction.

Branch — the title is empty:

1. A field-level error; nothing is saved.

Branch — it is somebody else's video:

1. 404, the same answer as a video that does not exist.

The uploading page and the edit modal in
[US-Videos-03](../../../../user-stories/videos/US-Videos-03-Manage-own-videos.md) both use this endpoint.

Why: the search index and the recommender update from that event, which is why the UI warns that a change takes a
while to show up in search and the feed. Turning comments or rates off hides them and deletes nothing — it is a flag
checked when serving and when writing.
