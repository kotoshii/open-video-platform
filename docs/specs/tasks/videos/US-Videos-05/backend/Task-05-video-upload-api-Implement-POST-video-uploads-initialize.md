## video-upload-api: Implement POST /video-uploads/initialize

Needs: [Task-02 — Migrate video-upload-api to the new structure](Task-02-Migrate-video-upload-api-to-the-new-structure.md),
[Task-04 — video-api: Create a video record over gRPC](Task-04-video-api-Create-a-video-record-over-gRPC.md)

`POST /video-uploads/initialize` — body `{ fileName, size, mimeType }`

Main flow:

1. Check the MIME type against the supported list and the size against the 10 GB limit.
2. Ask `video-api` over gRPC for a new video.
3. Create the upload session with status `upload_pending`, storing the file name, the size and the video id.
4. Return the video id, which the app uses as the uploading page's address.

Branch — the type or the size is not allowed:

1. Reject with its code and the limit; no video is created.

Branch — the video already has an active session:

1. Reject. Put a unique constraint on the active session and let the database decide, rather than checking first — two
   tabs can race here.

Why: the MIME type a browser reports is unreliable, but it removes obviously wrong files before 10 GB is uploaded;
what the file really is gets checked again while it arrives.
