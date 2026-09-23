## video-processing-worker: Probe the upload and plan the rungs

Needs: [Task-03 — Create video-processing-worker](Task-03-Create-video-processing-worker.md),
[Task-06 — video-upload-api: Implement the tus hooks](Task-06-video-upload-api-Implement-the-tus-hooks.md)

Consume `VideoUploadCompleted` and start the work for that video.

Main flow:

1. Probe the original with `ffprobe`: dimensions, duration, frame rate and whether there is an audio stream, reading
   them from the video stream rather than the first stream in the file.
2. Pick the rungs: every rung of the ladder whose short side is at most the source's short side, so nothing is upscaled.
3. Schedule the jobs — thumbnails, previews, and an encode per rung — as children of the video's parent job.

Branch — the source is smaller than the lowest rung:

1. Encode exactly one rung at the source's own size, with the lowest rung's bitrate settings, so a small clip can still
   be published.

The ladder and every parameter are in
[ffmpeg-processing-parameters.md](../../../../../explainers/ffmpeg-processing-parameters.md), Parts 2 and 3.

Why: the rung is the short side of the frame, so a portrait video gets a sensible ladder instead of a set of nearly
square postage stamps.
