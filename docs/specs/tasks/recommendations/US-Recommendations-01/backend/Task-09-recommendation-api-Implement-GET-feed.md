## recommendation-api: Implement GET /feed

Needs: [Task-08 — recommendation-api: Build the feed snapshot](Task-08-recommendation-api-Build-the-feed-snapshot.md),
[US-Comments-03 Task-02 — channel-api: Look up channels by id over gRPC](../../../comments/US-Comments-03/backend/Task-02-channel-api-Look-up-channels-by-id-over-gRPC.md)

`GET /feed?cursor=...` — a page of 24 video cards and the cursor for the next one

Main flow:

1. Without a cursor, build a new snapshot and serve its first page.
2. With one, read the next slice of the snapshot it points at.
3. Ask `video-api` for the page's videos — it leaves out any that stopped being visible since the snapshot was built —
   and `channel-api` for their channels' names and avatars.
4. Return the cards in snapshot order, and the next cursor, or none after the last page.

Branch — the snapshot has expired, or belongs to another channel than the one acting:

1. Return an empty page with no cursor; the list ends there. The next visit to the homepage starts a new snapshot.

Branch — nothing is left after filtering:

1. An empty list with no cursor. The page shows its empty state; this is not an error.

Why: a page can come back short when a video went private in the meantime, but nothing is skipped or repeated, because
the page boundaries come from the snapshot and not from the filter. 24 fills whole rows in both the 3- and 4-column
grids.
