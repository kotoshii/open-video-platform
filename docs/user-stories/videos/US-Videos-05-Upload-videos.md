## US-Videos-05 — Upload videos

**Description**

As a registered user with a verified account, I want to upload a video, fill in its details while it uploads and
processes, and publish it once it is ready, so that my content appears on my channel.

**User flows**

Upload a video — main flow:

1. User presses the "Upload" button in the navbar, or in the sidebar on mobile.
2. A dedicated page opens with a drag-and-drop area on desktop, or a "Select" button on mobile. The area itself
   states the supported formats and the maximum file size, and the text under it explains what comes next and that the
   video stays invisible to everyone until processing finishes and the author publishes it.
3. User drops a file or selects one.
4. The upload starts immediately and the user is redirected to the uploading page for that video.
5. The uploading page shows the details form on the left and, on the right, a status box with the upload percentage,
   the video's own link with a control to copy it, the file name and its size, and the "Save" and "Publish" buttons.
6. Until the upload finishes, a warning says that closing the tab will interrupt it.
7. Once the file is uploaded, the warning turns into a green alert saying so: the user can stay and publish, or close
   the tab and publish later.
8. Processing starts.
9. When the thumbnails are ready, they appear for the user to choose from.
10. When the lowest quality (240p) is ready, the alert says so and the "Publish" button becomes available.
11. Every further quality that becomes ready is reflected in the alert.
12. User clicks "Publish".
13. The video is published and the page confirms it.

Edit the details while uploading:

1. At any point the user can edit the title, the description, the tags, the allowed interactions (comments and rates),
   the thumbnail, the visibility (public, accessible by link, private) and the audience — a yes or no answer to whether
   the video contains material unsuitable for younger viewers, which is what restricts it to viewers over 18.
2. The thumbnail area offers an "Upload your own" tile next to the suggestions generated from the video; until those
   are ready, the suggestion tiles are empty placeholders.
3. User presses "Save" to store what they entered. Saving interrupts neither the upload nor the processing, and does
   not publish the video — the page states this next to the button.

Leave the page before the upload finishes:

1. The video appears on the user's channel with the corresponding status.
2. Clicking it opens the same uploading page, showing the drag-and-drop area or the select button again.
3. Selecting the same file resumes the upload from where it stopped.
4. An upload can be resumed for one day. After that, the whole file has to be uploaded from the beginning.
5. The video item stays on the channel even after that day has passed.

Leave the page after the upload but before processing finishes:

1. The video is still on the channel.
2. Clicking it opens the uploading page again, where the user can keep watching the processing progress.

Upload a video — branches:

* **Unsupported format or file too large** (step 3) — the file is rejected with a readable message and no upload
  starts.
* **File is not actually a video** (step 4 onwards) — the upload is rejected and what was received is discarded.
* **Opening the uploading page for a published video** — the page is no longer available for it, even through a saved
  link; the user is sent to the watch page instead.
* **Opening the uploading page for someone else's video** — the page is not available and the user is sent to the
  homepage.
* **Request fails** — the default toast behaviour applies
  ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).

**Acceptance criteria**

Selecting a file:

* The navbar has an "Upload" button, and the sidebar has one on mobile.
* The file selection page offers drag-and-drop on desktop and a "Select" button on mobile.
* The supported formats are `.mp4`, `.mov`, `.mkv`, `.webm`, `.avi`, `.flv`, `.wmv`, `.mpeg`, `.3gp`, `.m4v`.
* The maximum file size is 10 GB.
* The drop area states the supported formats and the maximum size.
* The text under it explains that details are filled in next, that a thumbnail can be uploaded or chosen from
  suggestions, and that the video stays invisible to everyone until processing finishes and the author publishes it.
* A file that is not a supported video is rejected with a readable message.
* Selecting a valid file starts the upload immediately and moves the user to the uploading page.

While uploading and processing:

* The uploading page shows the upload progress as a percentage, and then the processing progress.
* From the moment it opens, the page shows the video's own link with a control to copy it, the file name and the size.
* The user can edit the title, description, tags, allowed interactions, thumbnail, visibility and audience at any time.
* Audience is a yes or no answer to whether the video contains material unsuitable for younger viewers; "yes"
  restricts it to viewers over 18.
* The thumbnail area offers "Upload your own" alongside the generated suggestions, which stay placeholders until they
  are ready.
* "Save" stores the entered details without publishing, and the page says so next to the button.
* While the file is uploading, the page warns that closing the tab will interrupt it.
* When the file has finished uploading, that warning is replaced by a message saying the upload is complete and the
  user may leave and publish later.
* Thumbnails appear for selection as soon as they are generated.
* There is a single alert, and its content is replaced at each milestone: the upload finishing, then each quality as
  it becomes available. It shows the current state, not a history of what happened.

Publishing:

* The "Publish" button becomes available once the lowest quality (240p) is ready, not before.
* Publishing makes the video visible according to the visibility that was set.
* After publishing, the uploading page is no longer reachable for that video and leads to the watch page instead.

Interruptions:

* A video whose upload did not finish appears on the user's channel with a status showing that.
* Opening it offers the file selection again, and choosing the same file resumes the upload where it stopped.
* An upload can be resumed for one day; afterwards the file has to be uploaded again from the start.
* The video item stays on the channel after that day, it simply can no longer be resumed.
* A video that is uploaded but still processing is on the channel too, and opening it shows the processing progress.
* The uploading page of another user's video is not accessible.

**Tech notes**

The approach that is no longer used:

* An earlier design put every file on a dedicated file-server service with its own Nginx, which served some paths openly
  and gated others behind signed URLs — a path plus a JWT query parameter that the file-server's Nginx validated. **That
  is deprecated.** MinIO behind [nginx-s3-gateway](https://github.com/nginxinc/nginx-s3-gateway) covers the same ground
  with one component instead of two, and the gateway speaks AWS SigV4 to a private bucket. Do not rebuild the
  file-server.

Transport:

* Uploads go through tus (`tus-js-client` on the front end, `tusd` on the back end), which is what makes them
  resumable. A 10 GB limit and a browser tab that can close at any moment leave no realistic alternative.
* Nginx is the gateway for the tus routes as well: it validates the access token, adds `User-ID` and `Channel-ID`,
  strips the `Authorization` header, and adds the `Tus-Webhook-Secret` header. Requests that do not carry what the
  hooks need are rejected there, before they reach tusd.
* `tusd` is configured to forward headers to its hooks, and the video-upload service owns those hooks:
    * **pre-create** — verifies the webhook secret, that the video exists and belongs to this user, and that the size
      is within the limit; then sets the upload path to `{videoId}/original.{ext}`.
    * **post-receive** — the same ownership and size checks, plus a real file check with `ffprobe` where possible.
    * **post-finish** — sets the status to `processing`, notifies the client, and posts `VideoUploadCompleted` to
      Kafka.
* tusd itself knows nothing about these headers — it only forwards them — so the gateway is where a request missing
  them gets rejected. The hooks check again anyway, because Nginx config drifts.
* Bind the upload to a video once, in **pre-create**, and authorize everything after that from the upload record tusd
  already holds. The tus protocol identifies an upload by its URL, so re-sending `Upload-Metadata` on every `PATCH`
  adds a header the client must remember and an attacker could vary, without adding any safety. `pre-create` covers
  `POST`; for `PATCH` the `post-receive` hook fires mid-transfer, which is too late to be a gate.

Initialization:

* `POST /video-upload/initialize` carries the video metadata. The server checks the MIME type — unreliable, but it
  removes obviously wrong files early — creates the video record in the video service over gRPC, creates a local record
  with status `upload_pending`, and returns the video id. The user is then sent to `/upload/{videoId}`.

Processing:

* `video-processing-worker` consumes `VideoUploadCompleted` and schedules BullMQ tasks: one for the thumbnails, and one
  per resolution to produce the master MP4s. Each finished master file schedules a follow-up task that produces the HLS
  playlist and segments for it.
* Events flow back as they happen: `VideoThumbnailsGenerated`, then a `VideoQualityReady` per quality, and finally
  `VideoProcessingCompleted` once every task for that video is done. The worker tracks per-video task state to know
  when that is.
* Processing produces two deliverables per quality, and both are needed: the HLS playlist with its segments for
  playback ([US-Videos-01](./US-Videos-01-Watch-videos.md)), and the progressive MP4 for downloads
  ([US-Videos-02](./US-Videos-02-Download-videos.md)). HLS segments cannot be handed to a user as one playable file,
  which is why the MP4s exist. Store the byte size of each MP4 as it is produced, so the download dialog reads a stored
  number rather than measuring anything.
* Tags entered here are what content-based similar videos are built from
  ([US-Recommendations-02](../recommendations/US-Recommendations-02-Similar-videos.md)), so capturing them at upload is
  a dependency of that story, not a nicety.

Progress updates:

* The client subscribes to the video-upload service over SSE and receives every status change: upload finished,
  thumbnails ready, each quality ready, processing complete.
* SSE needs response buffering turned off in Nginx, otherwise updates arrive in clumps or not at all.

Storage layout:

* Everything belonging to a video lives under **one prefix in one bucket**. Deleting a video is then deleting one
  prefix ([US-Videos-03](./US-Videos-03-Manage-own-videos.md)), and lifecycle rules can be scoped by prefix.
* Splitting thumbnails into their own bucket was considered and rejected: with `nginx-s3-gateway` in front, every
  bucket is private and **Nginx decides access by route**, so a second bucket buys nothing on security while costing
  the single-prefix delete. Avatars stay separate because their lifecycle is unrelated to any video
  ([US-Channels-05](../channels/US-Channels-05-upload-user-pic.md)).

```text
video-bucket/
└── {videoId}/
    ├── original.mkv           <- source; kept, never served to anyone
    ├── master/
    │   ├── master_240.mp4     <- progressive files, served for downloads
    │   ├── master_360.mp4
    │   └── ...
    ├── hls/                   <- served publicly through nginx-s3-gateway
    │   ├── master.m3u8
    │   ├── 240/
    │   │   ├── index.m3u8
    │   │   ├── segment0.ts
    │   │   └── ...
    │   └── ...
    ├── thumbnails/            <- private: the author only, and only while editing
    │   ├── thumbnail1.jpg
    │   ├── thumbnail2.jpg
    │   ├── thumbnail3.jpg
    │   └── custom.jpg
    └── thumbnail.jpg          <- public: a copy of whichever one the author selected
```

Thumbnails:

* The generated variants and any custom upload are private — only the author, and only in the editing context. The one
  the author selected is a separate public object.
* The reason for the copy rather than a redirect: the selected thumbnail is on the hottest path in the app, rendered by
  every feed card, search result and channel row. It has to be servable with **no per-request authorization at all**,
  and a fixed public path does that. Resolving which variant is selected per request would mean a lookup per thumbnail,
  which does not survive a list of twenty videos.
* Which variant is selected is stored on the video, so the editing modal can show the current choice
  ([US-Videos-03](./US-Videos-03-Manage-own-videos.md)). Selecting another one copies it over the public object,
  server-side inside MinIO, so no bytes travel.
* Custom thumbnail uploads do not need tus. They are small images, so a plain validated upload is enough — constrain
  the type, the size and the aspect ratio, and write the result into the private `thumbnails/` folder.

The original file:

* **Keep it.** During development the encoding ladder, segment length, codec flags and thumbnail extraction all get
  changed repeatedly, and the original is the input to every re-run. Deleting it means re-uploading test files after
  every change to the pipeline.
* The same holds later for real reasons: adding a rendition, switching codec, or recovering from a pipeline bug. Re-
  deriving from the highest rendition means encoding lossy output from lossy input.
* Make retention a setting — days, with `0` meaning forever — so changing your mind is configuration rather than code.
  If disk pressure ever appears, a MinIO lifecycle rule on `*/original.*` expires them with no code involved, which is
  the second payoff of the single-prefix layout.

Access control and routing:

* Access is decided by route in Nginx, not by bucket. Public routes: `hls/` and the selected `thumbnail.jpg`. Gated
  routes: everything else.
* Private and age-restricted videos are served under a signed token in the path prefix, validated by Nginx without any
  database lookup ([hls-segment-protection.md](../../hls-segment-protection.md),
  [US-Videos-01](./US-Videos-01-Watch-videos.md)). Public videos keep plain, cacheable URLs.
* Downloads are the exception to route-based serving: they go through a short-lived presigned MinIO URL rather than the
  gateway, because a download is one large file rather than many small requests
  ([US-Videos-02](./US-Videos-02-Download-videos.md)).

Publishing:

* `POST /videos/{videoId}/publish` checks ownership, sets `is_published`, and posts `VideoPublished`. The video-upload
  service consumes it and drops its status record, which is what makes the uploading page 404 afterwards.

Sessions and expiry:

* Only a video in `upload_pending` may open an upload session, so a video that is already uploading or processing
  cannot get a second one.
* Expiring uploads has two halves. The bytes are handled by a MinIO lifecycle rule that aborts incomplete multipart
  uploads — tusd has no expiry of its own, despite the tus protocol describing one. The records are handled by a
  scheduled job that marks sessions older than a day as expired.

Traps to avoid:

* **The original sits in the same prefix as the publicly served `hls/`.** Nginx must expose only `hls/` and the public
  `thumbnail.jpg` — never the prefix root, never a wildcard beneath it. Otherwise the full-quality source file is
  downloadable by anyone who guesses the path. Write the routes as an explicit allowlist. This is the direct cost of
  consolidating everything under one prefix.
* **The public thumbnail path does not change when the image does**, so caches keep serving the old picture after the
  author switches thumbnails. Put a version counter or content hash in the URL.
* **Quality events do not arrive in order** — 1080p can finish before 480p. State has to be per quality, never a
  sequence, and the UI has to cope with qualities appearing in any order.
* **A video can be published while it is still gaining qualities**, since one quality is enough to publish. The player
  has to work with whatever the HLS master playlist currently offers.
* **The video link is shown before publishing**, because the record exists from `initialize`. It is not a working share
  link: an unpublished video is not found for anyone but its author
  ([US-Videos-01](./US-Videos-01-Watch-videos.md)). Do not build it as a share feature.
* **Two tabs can race to create an upload session** for the same video. A check-then-insert loses that race — put a
  unique constraint on the active session and let the database decide.
* **Expiry must clear the session, never the video.** The item stays on the channel after the day passes; it simply can
  no longer be resumed.
* **SSE breaks silently with more than one instance.** A connection is held by one video-upload instance while the
  Kafka events feeding it may be consumed by another. It needs sticky routing or a shared pub/sub the instances publish
  into. With a single instance this works and hides the problem.

Still open:

* All of the above are tracked in [open-decisions.md](../../open-decisions.md).

**Links**

* [US-Videos-01 — Watch videos](./US-Videos-01-Watch-videos.md)
* [US-Videos-02 — Download videos](./US-Videos-02-Download-videos.md)
* [US-Videos-03 — Manage own videos](./US-Videos-03-Manage-own-videos.md)
* [US-Channels-05 — Upload user pic](../channels/US-Channels-05-upload-user-pic.md)
* [US-Recommendations-02 — Similar videos](../recommendations/US-Recommendations-02-Similar-videos.md)
* [US-UI-UX-02 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)
* [open-decisions.md](../../open-decisions.md)
* [known-issues.md](../../known-issues.md)
* [tus resumable upload protocol](https://tus.io/)
* [hls-segment-protection.md](../../hls-segment-protection.md)
* [nginx-s3-gateway](https://github.com/nginxinc/nginx-s3-gateway)

**Tasks**

BE:

* TODO

FE:

* TODO
