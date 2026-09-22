## video-upload-api: Implement the tus hooks

Needs: [Task-05 — video-upload-api: Implement POST /video-uploads/initialize](Task-05-video-upload-api-Implement-POST-video-uploads-initialize.md),
[_platform infrastructure Task-10 — Run tusd behind the gateway](../../../_platform/infrastructure/Task-10-Run-tusd-behind-the-gateway.md)

Implement the three hooks tusd calls. Each one verifies the `Tus-Webhook-Secret` header first.

**pre-create:** check that the video exists, belongs to this user and has a session waiting, and that the size is within
the limit. Set the upload path to `{videoId}/original.{ext}`.

**post-receive:** update how much has arrived, and check with `ffprobe` that what is there is really a video as soon as
enough of it exists.

**post-finish:** set the status to `processing`, notify the client, and publish `VideoUploadCompleted`.

Branch — a check fails:

1. Reject the hook, so tusd refuses the request, and mark the session failed.

Why: the upload is bound to a video once, in `pre-create`, and everything after that is authorised from the record tusd
already holds. The tus protocol identifies an upload by its URL, so re-sending `Upload-Metadata` on every `PATCH` would
only add a header a client must remember and an attacker could vary.
