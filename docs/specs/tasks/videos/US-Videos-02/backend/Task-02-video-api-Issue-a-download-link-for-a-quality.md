## video-api: Issue a download link for a quality

Needs: [Task-01 — video-api: Implement GET /videos/{videoId}/downloads](Task-01-video-api-Implement-GET-videos-videoId-downloads.md)

`POST /videos/{videoId}/downloads/{quality}`

Main flow:

1. Check the viewer may watch the video, as when the list was served.
2. Return a short-lived presigned URL for that rendition's MP4, with `Content-Disposition` set to a file name built
   from the video's title and the quality.

Branch — that quality does not exist yet:

1. Reject with its code.

Why: the file is served straight from MinIO rather than through the API, so a large transfer never occupies an API
process for its whole duration. Authorization happens when the URL is issued, which is why it is short-lived — long
enough to start the download, not long enough to become a public link to the file.
