## video-api: Implement PUT /videos/{videoId}/thumbnail

Needs: [Task-16 — video-api: Store what processing produced](Task-16-video-api-Store-what-processing-produced.md)

`PUT /videos/{videoId}/thumbnail` — either which generated suggestion to use, or a custom image as multipart form data

Main flow:

1. Check the video belongs to the acting channel.
2. For a custom image, check its type, size and aspect ratio, and write it into the private `thumbnails/` prefix.
3. Copy the chosen image over the public `thumbnail.jpg`, server-side inside MinIO.
4. Store which one is selected, raise the thumbnail's version, and write the video-updated event to the outbox.

Why: the public copy exists so the hottest path in the app — every feed card, search result and channel row — needs no
lookup and no authorization at all. The version in the URL is what stops caches serving the old picture, since the path
itself never changes. A custom thumbnail needs no resumable upload: it is a small image, so a plain validated upload is
enough.
