## comment-api: Keep the author's name and avatar fresh

Needs: [US-Channels-03 Task-02 — channel-api: Implement PUT /channels/current](../../../channels/US-Channels-03/backend/Task-02-channel-api-Implement-PUT-channels-current.md)

Store the author's channel name and avatar on the comment row, and consume the channel-updated event to refresh them.

* Deduplicate through the inbox, and ignore an event older than the copy already stored.

Why: a comment list renders without calling `channel-api` once per row, which is the whole point of the copy. The cost
is that a renamed channel shows its old name on comments for a while — deliberate, and what the settings page warns
about.
