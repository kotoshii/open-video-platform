## Migrate channel-api to the new structure

Move `channel-api` to the new module layout, and wire it into Compose, the database init, the migration container, its
Kafka topics and the gateway route.

* It keeps channels and their settings; what a channel holds grows with
  [US-Channels-01](../../../../user-stories/channels/US-Channels-01-create-multiple-channels.md) and
  [US-Channels-03](../../../../user-stories/channels/US-Channels-03-current-channel-settings.md).
* Its events go through the outbox in `lib` instead of straight to the Kafka producer.

Why: sign-up creates the account's first channel here, so this service is in the way from the very first story.
