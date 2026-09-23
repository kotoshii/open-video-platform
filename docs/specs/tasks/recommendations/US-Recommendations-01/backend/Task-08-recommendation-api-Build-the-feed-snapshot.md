## recommendation-api: Build the feed snapshot

Needs: [Task-04 — recommendation-api: Send watches to Gorse](Task-04-recommendation-api-Send-watches-to-Gorse.md),
[Task-07 — video-api: List the most viewed videos over gRPC](Task-07-video-api-List-the-most-viewed-videos-over-gRPC.md)

Build the ordered list of video ids one feed session pages over — candidates, filter, limit — and store it.

Main flow:

1. Ask Gorse for the channel's recommendations, up to the snapshot size (about 200), with a short timeout.
2. Ask `video-api` for the most viewed videos this viewer may see.
3. Append those after Gorse's, dropping duplicates and the videos the channel already has `watch` feedback for in Gorse.
4. Ask `video-api` which of the ids this viewer may see, keep those in order, and cut the list to the snapshot size.
5. Store it in Redis under a new snapshot id, together with the channel id, expiring an hour after its last read.

Branch — Gorse fails or times out:

1. Skip step 1 and the watched filter in step 3; the snapshot is all popular videos. Log it, and do not fail the
   request.

Branch — the channel has no history:

1. Gorse returns nothing and the snapshot is all popular videos — the normal path, not an error.

Why: the list is fixed on the first request and paged over, because Gorse's order shifts whenever it refreshes its
models — asking it again per batch repeats and skips videos as the user scrolls. This is not a cache in front of Gorse:
it saves no work, it only keeps the order still for one session.
