## video-api: Implement POST /videos/{videoId}/publish

Needs: [Task-16 — video-api: Store what processing produced](Task-16-video-api-Store-what-processing-produced.md),
[Task-17 — video-api: Implement GET and PUT /videos/{videoId}](Task-17-video-api-Implement-GET-and-PUT-videos-videoId.md)

`POST /videos/{videoId}/publish`

Main flow:

1. Check the video belongs to the acting channel and that its lowest quality is ready.
2. Mark it published and write the published event to the outbox.
3. `video-upload-api` consumes that event and drops its upload session, which is what makes the uploading page
   unavailable afterwards.

Branch — no quality is ready yet:

1. Reject with its code; the button is not the enforcement.

Branch — the channel has a deletion scheduled:

1. The video is published as private, like the rest of that channel's videos
   ([US-Channels-06](../../../../user-stories/channels/US-Channels-06-delete-own-channel.md)).

Why: one quality is enough to publish, so a published video may still be gaining renditions — the player works from
whatever the master playlist currently offers.
