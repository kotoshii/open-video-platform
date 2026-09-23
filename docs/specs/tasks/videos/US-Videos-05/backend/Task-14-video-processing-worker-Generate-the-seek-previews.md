## video-processing-worker: Generate the seek previews

Needs: [Task-10 — video-processing-worker: Probe the upload and plan the rungs](Task-10-video-processing-worker-Probe-the-upload-and-plan-the-rungs.md)

Add the job that builds what the player shows while scrubbing: extract a frame every so many seconds, tile them into
sprite sheets, and write the WEBVTT file that says which rectangle of which sheet belongs to which moment. Put all of it
under `hls/previews/`, so the signed token that covers the playlists covers these too.

* Scale the interval with the duration, so the frame count stays near 150 however long the video is.
* Number the sheets from 0, or every index in the VTT is off by one.
* Build the VTT from the frames that are really on disk, and check the last, partly filled sheet exists.
* Keep the grid size, the thumbnail width, the interval and the VTT writer in one module.

The maths and the file format are in
[ffmpeg-processing-parameters.md](../../../../../explainers/ffmpeg-processing-parameters.md), Part 10.

Why: those four numbers are one set of geometry in four places — when they drift, the previews show the wrong frame,
and each one is wrong by a different amount.
