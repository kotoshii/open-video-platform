## video-view-count-worker: Count a view once per day

Needs: [Task-02 — Migrate video-view-count-worker to the new structure](Task-02-Migrate-video-view-count-worker-to-the-new-structure.md),
[_platform known-issues Task-04 — Add the video id to the view dedup key](../../../_platform/known-issues/Task-04-Add-the-video-id-to-the-view-dedup-key.md)

Consume the viewed events in batches and apply the counts: reserve a Redis key per viewer and video with a 24-hour
lifetime, drop the events whose key was already taken, and add the rest to the videos' view counts.

Branch — the same viewer watches the same video again within the day:

1. The view is not counted. The watch history still moves the video to the top, because it is written from every watch
   event rather than from this count
   ([US-My-activity-01](../../../../user-stories/my-activity/US-My-activity-01-Watch-history.md)).

Why: this Redis key is the business rule — one view per viewer per video per day — while the inbox next to it is about
Kafka delivering a batch twice. They look similar and answer different questions.
