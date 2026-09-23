## video-api: List the most viewed videos over gRPC

Needs: [US-Search-01 Task-04 — video-api: Look up the visible videos over gRPC](../../../search/US-Search-01/backend/Task-04-video-api-Look-up-the-visible-videos-over-gRPC.md)

Add the gRPC method that returns the ids of the most viewed videos a viewer may see in a listing — published, public
and allowed by their age and their channel's setting, the same rule as the lookup — ordered by all-time view count, up
to a limit. Add an index that serves this order.

Why: this is the feed's popularity fallback, and it has to answer when Gorse cannot — so it comes from `video-api`'s own
data rather than from Gorse's popular recommender. The age filter goes into the query, so the videos returned are ones
the viewer can see rather than a list trimmed afterwards.
