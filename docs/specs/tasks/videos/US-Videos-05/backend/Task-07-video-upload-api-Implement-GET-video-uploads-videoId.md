## video-upload-api: Implement GET /video-uploads/{videoId}

Needs: [Task-06 — video-upload-api: Implement the tus hooks](Task-06-video-upload-api-Implement-the-tus-hooks.md)

`GET /video-uploads/{videoId}`

Returns everything the uploading page needs about the upload itself: the status, how much of the file has arrived, the
file name and size, which qualities are ready, and whether the thumbnails exist.

Main flow:

1. Check the video belongs to the acting channel.
2. Return the session's current state.

Branch — the video is published, so its session has been dropped:

1. Return 404 with its code, which the page turns into a redirect to the watch page.

Branch — it is somebody else's video:

1. Return 404 as well, rather than saying it exists.

Why: the page reads this on every load and reconnect, and only then follows the live stream — the record is the truth,
and the stream is just a way to hear about changes sooner.
