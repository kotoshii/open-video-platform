## video-api: Expose a video's rate permission over gRPC

Needs: [US-Videos-05 Task-17 — video-api: Implement PUT /videos/{videoId}](../../US-Videos-05/backend/Task-17-video-api-Implement-PUT-videos-videoId.md)

Add the gRPC method that answers whether a video exists, whether the caller may watch it, and whether its author allows
rates. Return the video's title and its channel id with the answer: `video-rate-api` and `comment-api` store the title
next to their rows, so the rated videos and My comments pages can search by it
([US-My-activity-02](../../../../user-stories/my-activity/US-My-activity-02-Rated-videos.md),
[US-My-activity-03](../../../../user-stories/my-activity/US-My-activity-03-My-comments.md)), and a new comment's event
names the video's owner, who is notified about it
([US-Notifications-01](../../../../user-stories/notifications/US-Notifications-01-Notifications-config.md)).

Why: `video-rate-api` cannot read the videos table, and a rate on a video that does not exist — or on one whose author
turned rates off — must be refused rather than stored and counted.
