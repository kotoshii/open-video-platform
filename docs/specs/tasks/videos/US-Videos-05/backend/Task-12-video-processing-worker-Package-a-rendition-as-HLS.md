## video-processing-worker: Package a rendition as HLS

Needs: [Task-11 — video-processing-worker: Encode a rendition](Task-11-video-processing-worker-Encode-a-rendition.md)

Add the job that follows each encode: cut the rendition into HLS segments with `-c copy` and `-hls_time 4`, upload them
to `hls/{rung}/`, rewrite `hls/master.m3u8` with every rung that exists so far, ordered by bandwidth, and publish
`VideoQualityReady` with what the rendition turned out to be — its size in bytes, its real resolution, its bitrate and
its codec string.

* Build `CODECS` from the profile and level `ffprobe` reports for the file, never a hardcoded string.
* Match `-hls_time` to the keyframe interval from Task-11.

Branch — another rung finishes while this one rewrites the master playlist:

1. Rewriting is per video, so serialise it — two jobs writing that file at once lose a rendition.

The details are in [ffmpeg-processing-parameters.md](../../../../../explainers/ffmpeg-processing-parameters.md),
Parts 7 and 8.

Why: the MP4 already has keyframes on the grid, so this is a remux rather than a second encode — seconds instead of
minutes, and no quality lost. A quality counts as ready here rather than after the encode, because an MP4 alone is not
something the player can play.
