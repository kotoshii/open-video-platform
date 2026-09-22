## search-api: Implement GET /search/videos

Needs: [Task-03 — search-api: Index videos from their events](Task-03-search-api-Index-videos-from-their-events.md),
[US-Channels-03 Task-03 — channel-api: Expose the age-restricted setting over gRPC](../../../channels/US-Channels-03/backend/Task-03-channel-api-Expose-the-age-restricted-setting-over-gRPC.md)

`GET /search/videos?query=...&uploadedWithin=...&duration=...&order=...&page=...`

Main flow:

1. Query the title and description through all three language fields with `multi_match`, and the tags.
2. Translate the UI's buckets into range queries: upload date, and duration.
3. Order by relevance, upload date or view count.
4. Leave out age-restricted videos when the viewer is too young by the `Birthdate` header, or their acting channel has
   the setting off.
5. Ask `video-api` over gRPC whether the page's ids are still visible to this viewer, and drop the ones it rejects.

Branch — the requested page is past the index's paging limit:

1. Reject with its code. Cap the reachable pages so the controls never offer one that errors.

The serve-time check can leave a page slightly short while the index catches up. Nothing is skipped or repeated,
because the page boundaries come from the index.

Why: the index lags behind the databases by however long re-indexing takes, so a video made private a second ago would
still be a hit — and the check is what keeps that from leaking it.
