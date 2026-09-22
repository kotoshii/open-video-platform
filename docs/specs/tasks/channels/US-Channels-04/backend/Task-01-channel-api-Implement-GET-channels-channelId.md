## channel-api: Implement GET /channels/{channelId}

Needs: [US-Channels-03 Task-01 — channel-api: Implement GET /channels/current](../../US-Channels-03/backend/Task-01-channel-api-Implement-GET-channels-current.md)

`GET /channels/{channelId}`

Returns a channel's public data: avatar, name, description and subscriber count.

Main flow:

1. Return the channel, with the stored subscriber count the `subscriber-count-worker` maintains
   ([US-Subscriptions-01](../../../../user-stories/subscriptions/US-Subscriptions-01-Subscribe-to-other-channels.md)).

Branch — no such channel, or it has been purged:

1. 404 with its code, which the page turns into a full-page error state.

Why: the video count is deliberately not here. It comes with the video list, so the number above the list and the list
itself are produced by one query — the subscriber count can stay a stored counter because it has no per-viewer filter.
