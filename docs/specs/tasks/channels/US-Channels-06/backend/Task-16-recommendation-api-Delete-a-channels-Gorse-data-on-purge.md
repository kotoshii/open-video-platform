## recommendation-api: Delete a channel's Gorse data on purge

Needs: [Task-07 — channel-api: Run the purge as a saga](Task-07-channel-api-Run-the-purge-as-a-saga.md),
[US-Recommendations-01 Task-02 — Create recommendation-api](../../../recommendations/US-Recommendations-01/backend/Task-02-Create-recommendation-api.md)

Consume the purge event: delete the channel's Gorse user with the feedback recorded against it, and the items for its
videos, then report back.

Why: the recommender's "user" is the channel, not the account
([US-Recommendations-01](../../../../user-stories/recommendations/US-Recommendations-01-Feed.md)), so one purged
channel leaves the account's other channels untouched.
