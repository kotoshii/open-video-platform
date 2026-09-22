## video-upload-api: Expire upload sessions after a day

Needs: [Task-05 — video-upload-api: Implement POST /video-uploads/initialize](Task-05-video-upload-api-Implement-POST-video-uploads-initialize.md)

Add a repeatable job that marks upload sessions older than a day as expired, so their uploads can no longer be resumed.

The bytes are the bucket's problem: the lifecycle rule that aborts incomplete multipart uploads removes them
([_platform infrastructure Task-07](../../../_platform/infrastructure/Task-07-Create-MinIO-buckets-and-lifecycle-rules.md)).

Why: expiry clears the session, never the video. The video stays on the channel with its state, it simply cannot be
resumed — and the author can delete it or upload the file again from the start.
