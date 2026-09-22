## video-processing-worker: Finish a video when its jobs are done

Needs: [Task-12 — video-processing-worker: Package a rendition as HLS](Task-12-video-processing-worker-Package-a-rendition-as-HLS.md),
[Task-13 — video-processing-worker: Generate the thumbnails](Task-13-video-processing-worker-Generate-the-thumbnails.md),
[Task-14 — video-processing-worker: Generate the seek previews](Task-14-video-processing-worker-Generate-the-seek-previews.md)

Make every job for one video a child of one parent job, so the parent runs when they have all finished. The parent
publishes `VideoProcessingCompleted`.

Branch — a rung failed for good:

1. Finish anyway, with the qualities that exist, and say which rung failed.

Branch — the lowest rung failed:

1. Publish a processing-failed event instead. Publishing is gated on that rung, so the author has to be told rather
   than left waiting.

Why: the flow is the worker's only state, which is what keeps it without a database. Qualities finish in any order —
720p can beat 360p — so nothing may assume a sequence.
