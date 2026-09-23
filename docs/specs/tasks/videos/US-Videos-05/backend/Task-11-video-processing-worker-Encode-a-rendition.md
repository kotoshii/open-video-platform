## video-processing-worker: Encode a rendition

Needs: [Task-10 — video-processing-worker: Probe the upload and plan the rungs](Task-10-video-processing-worker-Probe-the-upload-and-plan-the-rungs.md)

Add the job that encodes one rung into `master/master_{rung}.mp4` with the command in
[ffmpeg-processing-parameters.md](../../../../../explainers/ffmpeg-processing-parameters.md), Part 5 — H.264 High,
AAC-LC stereo, capped CRF, faststart — then uploads it and probes what it produced.

* Map the audio stream optionally, or every silent video fails — and silent video is common.
* Force keyframes every 4 seconds with the expression from Part 6, identically in every rung.
* Scale by the short side with the `-2` expression, so the other side stays even.

Branch — the job fails:

1. Retry it. If it keeps failing, mark that rung failed and leave the others alone: a video with three of four qualities
   is fine.

Why: forcing keyframes on the same grid in every rung is what lets the player switch quality mid-playback. Left to
itself the encoder picks different positions per rendition, and the failures that follow — drift after a switch,
stutter, or a player that never switches at all — report no error and look fine one rendition at a time.
