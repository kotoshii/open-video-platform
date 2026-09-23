## channel-api: Implement PUT /channels/current/avatar

Needs: [US-Channels-03 Task-02 — channel-api: Implement PUT /channels/current](../../US-Channels-03/backend/Task-02-channel-api-Implement-PUT-channels-current.md),
[_platform foundation Task-07 — Add an S3 client builder to lib](../../../_platform/foundation/Task-07-Add-an-S3-client-builder-to-lib.md)

`PUT /channels/current/avatar` — the image as multipart form data

Main flow:

1. Reject anything over 5 MB or outside the supported image types, GIF included.
2. Downscale it to at most 160×160 with `sharp`, opened with its animated option.
3. Write it to the avatars bucket under a name that changes with every upload, and delete the object it replaces.
4. In one transaction, save the new URL and write the channel-updated event to the outbox.

Branch — the file is too large or of an unsupported type:

1. Reject with its code and the limit, and store nothing.

Why: 5 MB is small enough to resize inside the request, so no queue and no worker are needed. Without the animated
option only a GIF's first frame survives, and a name that changes on every upload is what stops caches serving the old
picture.
