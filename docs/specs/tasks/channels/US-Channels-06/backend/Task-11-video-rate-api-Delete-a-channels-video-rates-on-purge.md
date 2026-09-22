## video-rate-api: Delete a channel's video rates on purge

Needs: [Task-07 — channel-api: Run the purge as a saga](Task-07-channel-api-Run-the-purge-as-a-saga.md)

Consume the purge event: delete every video rate the channel gave, writing a deleted event for each so the counts on
other channels' videos come down, then report back.

Why: the same shape as the comment rates, and for the same reason — the counts are maintained by a worker from events,
so rows removed without events would leave the numbers permanently too high.
