## Pick a thumbnail on the uploading page

Needs: [Task-18 — video-api: Implement PUT /videos/{videoId}/thumbnail](../backend/Task-18-video-api-Implement-PUT-videos-videoId-thumbnail.md),
[Task-24 — Implement the video details form](Task-24-Implement-the-video-details-form.md)

Add the thumbnail area to the details form: an "Upload your own" tile next to the suggestions generated from the video,
with the current choice marked. On mobile the tiles scroll horizontally, starting with "Upload your own".

Main flow:

1. Until the suggestions exist, the tiles are empty placeholders.
2. When they arrive through the event stream, they appear for choosing.
3. Choosing one, or uploading an image, sets the video's thumbnail.

Branch — the uploaded image is rejected:

1. A readable message, and the current thumbnail stays.

Why: the suggestions and the video's own processing finish at different times, so the area has to be usable while they
are still missing.
