## video-processing-worker: Generate the thumbnails

Needs: [Task-10 — video-processing-worker: Probe the upload and plan the rungs](Task-10-video-processing-worker-Probe-the-upload-and-plan-the-rungs.md)

Add the job that takes three frames — at 25%, 50% and 75% of the duration — writes them to the private `thumbnails/`
prefix, and publishes `VideoThumbnailsGenerated`.

Seek with `-ss` before `-i`, as in
[ffmpeg-processing-parameters.md](../../../../../explainers/ffmpeg-processing-parameters.md), Part 9.

Why: the opening seconds are usually black, a title card or a logo, so the suggestions come from further in. Seeking
before the input jumps to the nearest keyframe instead of decoding the whole file up to that point — on a long video
that is the difference between a second and several minutes.
