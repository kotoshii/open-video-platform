## video-api: Create a video record over gRPC

Needs: [Task-01 — Migrate video-api to the new structure](Task-01-Migrate-video-api-to-the-new-structure.md)

Add the gRPC method `video-upload-api` calls when an upload is initialised: it creates the video for the acting channel
with the details entered so far, unpublished, and returns its id.

The video row carries what later tasks fill in: its renditions, its thumbnails, its duration and whether it is
published.

Why: the video exists from the first moment, which is what gives the uploading page a link to show and what lets the
author edit the details while the file is still uploading.
