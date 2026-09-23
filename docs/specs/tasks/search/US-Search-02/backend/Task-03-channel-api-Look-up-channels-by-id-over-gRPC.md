## channel-api: Look up channels by id over gRPC

Add the gRPC method that takes a list of channel ids and returns the ones that still exist, with their name, avatar and
account id.

Channel search calls it for every page it serves, and the feed uses it for the names and avatars on its cards
([US-Recommendations-01](../../../../user-stories/recommendations/US-Recommendations-01-Feed.md)). Notification emails
use it to find the account to send to
([US-Notifications-03](../../../../user-stories/notifications/US-Notifications-03-Email-channel.md)).

Why: existence is the whole check. A channel with a deletion scheduled still has its row and is shown as usual; the
purge deletes the row last, once every other service has removed its data
([US-Channels-06](../../../../user-stories/channels/US-Channels-06-delete-own-channel.md)).
