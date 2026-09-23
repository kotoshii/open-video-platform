## video-api: Store what processing produced

Needs: [Task-12 — video-processing-worker: Package a rendition as HLS](Task-12-video-processing-worker-Package-a-rendition-as-HLS.md),
[Task-15 — video-processing-worker: Finish a video when its jobs are done](Task-15-video-processing-worker-Finish-a-video-when-its-jobs-are-done.md)

Consume the upload and processing events and store what they carry.

* `VideoUploadCompleted`, `VideoUploadFailed`, `VideoUploadExpired` — the upload part of the video's state, which the
  author's channel list shows
  ([US-Channels-04](../../../../user-stories/channels/US-Channels-04-see-own-and-other-channels.md)).
  A new video starts as uploading.

* `VideoQualityReady` — one rendition row per quality: the label, the byte size, the resolution, the bitrate and the
  codec string, plus the video's duration the first time.
* `VideoThumbnailsGenerated` — which suggestions exist.
* `VideoProcessingCompleted` or the failed event — the video's processing state.

Each of these is idempotent, and state is kept per quality rather than as a sequence.

Why: the download dialog reads the stored byte size instead of measuring anything
([US-Videos-02](../../../../user-stories/videos/US-Videos-02-Download-videos.md)), and a published video keeps gaining
renditions, so rows arriving in any order have to be fine.
