## channel-api: Expose the age-restricted setting over gRPC

Needs: [Task-02 — channel-api: Implement PUT /channels/current](Task-02-channel-api-Implement-PUT-channels-current.md)

Add the gRPC method that returns a channel's "Show age-restricted content" setting. Every service that serves a listing
calls it for the acting channel — search, the feed, similar videos, the channel page, the watch page — and caches the
answer for a few seconds.

Why: the setting can change at any moment, so listings read it when they serve rather than at index time, and a short
cache stops one page load asking several times. The viewer's age needs no call at all: it comes from the `Birthdate`
header, because age changes on its own while a stored "is adult" flag would not.
