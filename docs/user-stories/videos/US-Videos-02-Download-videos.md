## US-Videos-02 — Download videos

**Description**

As a registered user with a verified account, I want to download a video in a quality of my choice, so that I can keep
it and watch it without the platform.

**User flows**

Download a video — main flow:

1. User opens a video page by clicking a video item on some page.
2. The page loads the video info and the player ([US-Videos-01](./US-Videos-01-Watch-videos.md)).
3. User sees the download button under the player.
4. User clicks it.
5. A dialog opens with the list of available qualities, each with its format (MP4), file size and duration.
6. User clicks the desired quality.
7. The download starts.
8. User ends up with a playable MP4 file.

Download a video — branches:

* **User closes the dialog** (step 6) — nothing is downloaded and nothing changes.
* **The quality list fails to load** (step 5) — the dialog shows an error with a retry action
  ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)); the page behind it keeps working.
* **The download fails part-way** (step 7) — this is out of the app's hands. Either the browser supports resuming the
  download and the user continues it, or the download is lost and the user starts again.

**Acceptance criteria**

* The video page has a download button under the player.
* Clicking it opens a dialog listing the qualities available for that video, each with its format (MP4), file size and
  duration.
* Choosing a quality starts the download of that rendition.
* The downloaded file is a playable MP4.
* The file is named after the video and the chosen quality, not after an internal id.
* A user can download exactly the videos they are allowed to watch — the same rules as
  [US-Videos-01](./US-Videos-01-Watch-videos.md).
* Downloading does not increase the view count.
* Closing the dialog without choosing a quality does nothing.
* A failure loading the quality list is shown inside the dialog and can be retried.
* Failures during the transfer itself are not handled by the app.

**Tech notes**

* Processing produces two things per quality, both in the same bucket: an HLS playlist with its segments, used for
  playback ([US-Videos-01](./US-Videos-01-Watch-videos.md)), and a progressive MP4, used for downloads. HLS segments
  cannot be handed to the user as one playable file, which is why the MP4s exist.
* Downloads therefore serve a stored file. Nothing is remuxed or assembled per request, so the size shown in the dialog
  is the real file size rather than an estimate.
* Store the byte size of each rendition when it is produced, so the dialog reads a stored number instead of measuring
  anything at request time.
* Serve the file straight from S3 (MinIO) through a short-lived presigned URL rather than proxying it through the API —
  a large transfer must not occupy an API process for its whole duration.
* Authorization happens when the URL is issued, using the same visibility rules as watching. The URL's lifetime should
  be short enough that it does not become a durable public link to the file.
* Set the download filename through the response headers (presigned URLs can override `Content-Disposition`), built
  from the video title and the chosen quality.
* Downloading emits no view event; the view was already registered when the video page loaded.
* Every quality has an MP4, so the download dialog offers the same set of qualities the player does. The cost is that
  each video is stored twice over — once as HLS, once as MP4.
* This story depends on the Video uploading epic producing those MP4 renditions in the first place (see
  [project-overview.md](../../project-overview.md)).

**Links**

* [Figma mockups](https://www.figma.com/design/VGVNL768fIPaiAKDH5bYNU/Open-Video-Platform-Mockups?node-id=18-722&p=f&t=0uaBWT7mgjLi4HBf-0)
* [US-Videos-01 — Watch videos](./US-Videos-01-Watch-videos.md)
* [US-UI-UX-02 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)

**Tasks**

BE:

* TODO

FE:

* TODO
