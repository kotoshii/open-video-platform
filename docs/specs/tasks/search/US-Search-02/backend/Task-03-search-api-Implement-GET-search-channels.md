## search-api: Implement GET /search/channels

Needs: [Task-02 — search-api: Index channels from their events](Task-02-search-api-Index-channels-from-their-events.md)

`GET /search/channels?query=...&order=...&page=...`

Main flow:

1. Match the query against the channel name through its language fields, and the description.
2. Order by relevance or by subscriber count.
3. Ask `channel-api` over gRPC whether the page's channels still exist, and drop the ones that do not.
4. Page the same way as video search, with the same cap on reachable pages.

Why: a channel with a deletion scheduled is still a live channel, so it is found as usual until its purge — the check
here is about a channel that has already gone, which the index has not caught up with.
