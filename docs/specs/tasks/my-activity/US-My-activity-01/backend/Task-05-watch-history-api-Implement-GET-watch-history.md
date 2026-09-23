## watch-history-api: Implement GET /watch-history

Needs: [Task-02 — watch-history-api: Record watches from the viewed event](Task-02-watch-history-api-Record-watches-from-the-viewed-event.md),
[Task-04 — video-api: Report video availability over gRPC](Task-04-video-api-Report-video-availability-over-gRPC.md),
[US-Comments-03 Task-02 — channel-api: Look up channels by id over gRPC](../../../comments/US-Comments-03/backend/Task-02-channel-api-Look-up-channels-by-id-over-gRPC.md)

`GET /watch-history?query=...&page=...` — a page of the acting channel's history, its total, and whether it is paused

Main flow:

1. Page the channel's rows by watched time, newest first. With a query, keep the rows whose stored title contains it;
   escape `%` and `_` in the query before it goes into `ILIKE`.
2. Ask `video-api` about the page's videos, and `channel-api` for the channel names of the available ones.
3. Return an available row as a card — thumbnail, title, channel name, view count and when it was watched — and any
   other as a placeholder that says whether the video is private or deleted, with only the watched time.

Why: whether a row is a placeholder is decided while serving, so a video made private becomes one with nothing written
anywhere. No row is ever dropped from a page, so the page boundaries and the total stay exact.
