## channel-api: Look up channels by id over gRPC

Needs: [US-Auth-01 Task-02 — Migrate channel-api to the new structure](../../../auth/US-Auth-01/backend/Task-02-Migrate-channel-api-to-the-new-structure.md)

Add the gRPC method that takes a list of channel ids and returns the ones that still exist, with their name, avatar and
account id.

`comment-api` is the first to call it, for the author's name and avatar it stores with a new comment. Later stories
use it too: the search index for a newly published video's channel, channel search for every page it serves, the feed
and the personal lists for the names and avatars on their cards
([US-Recommendations-01](../../../../user-stories/recommendations/US-Recommendations-01-Feed.md)), and notification
emails to find the account to send to
([US-Notifications-03](../../../../user-stories/notifications/US-Notifications-03-Email-channel.md)).

Why: existence is the whole check. A channel with a deletion scheduled still has its row and is shown as usual; the
purge deletes the row last, once every other service has removed its data
([US-Channels-06](../../../../user-stories/channels/US-Channels-06-delete-own-channel.md)).
