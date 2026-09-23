## US-Channels-05 — Upload user pic (avatar)

**Description**

As an authenticated user, I want to upload a picture for my current channel, so that my channel
is recognisable everywhere it appears in the app.

**User flows**

Upload a user pic — main flow:

1. User opens the settings page on the Channel tab ([US-Channels-03](./US-Channels-03-current-channel-settings.md)).
2. User sees the upload form: a drop area saying "Drop a file here" (desktop) or an "Upload" button (mobile).
3. User drops a file or selects one with the button.
4. User presses "Save".
5. The image is uploaded to the server.
6. Every avatar component on the page updates and shows the new image.
7. Other pages (comments, channel, videos) use the new image as well.

Upload a user pic — branches:

* **File too large or of an unsupported format** (step 3) — the user sees a readable error and nothing is uploaded.
* **Upload fails** (step 5) — the default error flow applies
  ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)); the previous picture stays in place. The name and
  description are not saved either: the picture is uploaded first, and the rest is saved only once that succeeds.

**Acceptance criteria**

* The Channel tab has an avatar upload form: a drop area on desktop, an upload button on mobile.
* The picture is applied together with the channel's name and description, with the "Save" button.
* Files up to 5 MB are accepted; a larger file is rejected with a readable error before anything is uploaded.
* The commonly used image formats are supported, GIF included.
* Stored pictures are at most 160x160 px.
* After saving, every avatar on the current page shows the new image immediately.
* Avatars rendered from data owned by other services (comments, videos) may still show the old image for a short time
  ([US-Channels-03](./US-Channels-03-current-channel-settings.md)).

**Tech notes**

* Pictures are stored in an S3 bucket (MinIO).
* 5 MB is the upload limit and 160x160 px is the stored size, so what arrives has to be downscaled. That happens **in
  the Channels service, during the upload request**, using `sharp`. Five megabytes is small enough to process inline,
  so no worker or queue is needed.
* GIF is supported, so the downscaling step must preserve animation instead of flattening it to a single frame. `sharp`
  keeps every frame when the image is opened with its `animated` option; without it, only the first frame survives.
* Replacing a picture must not leave orphaned objects in the bucket.
* A new avatar URL is part of the channel-updated event
  ([US-Channels-03](./US-Channels-03-current-channel-settings.md)), so the other services replace their stored copy the
  same way they do for the channel name.

**Links**

* [US-Channels-01 — Create multiple channels](./US-Channels-01-create-multiple-channels.md)
* [US-Channels-03 — Current channel settings](./US-Channels-03-current-channel-settings.md)

**Tasks**

BE:

* [Task-01 — channel-api: Implement PUT /channels/current/avatar](../../tasks/channels/US-Channels-05/backend/Task-01-channel-api-Implement-PUT-channels-current-avatar.md)

FE:

* [Task-02 — Add the avatar upload to the Channel tab](../../tasks/channels/US-Channels-05/frontend/Task-02-Add-the-avatar-upload-to-the-Channel-tab.md)
* [Task-03 — Add the avatar to the create channel modal](../../tasks/channels/US-Channels-05/frontend/Task-03-Add-the-avatar-to-the-create-channel-modal.md)
