## Upload and publish the seed videos

Needs: [Task-02 — Seed accounts and channels](Task-02-Seed-accounts-and-channels.md),
[Task-03 — Generate test videos with FFmpeg](Task-03-Generate-test-videos-with-FFmpeg.md)

Upload the generated videos across the channels with the same flow the UI uses.

Main flow:

1. Initialise the upload and send the file with tus.
2. Fill in the details: title, description and tags from faker, mixing English and Ukrainian.
3. Poll the status until the lowest quality is ready.
4. Publish.

Most videos stay public; make a few private, a few accessible by link and a few age-restricted.

Branch — a video never reaches its lowest quality before the deadline:

1. Log it and move on to the next one.

Why: mixed English and Ukrainian text gives both search analyzers something to work on
([US-Search-01](../../../user-stories/search/US-Search-01-Search-videos.md)), and every visibility gets a video to test
the listings with.
