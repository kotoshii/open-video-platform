## Migrate user-api to the new structure as account-api

Move the service to the new module layout — `domain`, `application`, `infrastructure` and `presentation` per bounded
context — and rename it to `account-api`, along with its database, its user, its gRPC package and its gateway route.

* It keeps the account record and nothing else: the email, the date of birth and the password move to Keycloak with
  [US-Auth-01](../../../../user-stories/auth/US-Auth-01-Account-creation-and-login.md), and the "can access NSFW" check
  is replaced by the viewer's birthdate in the token plus the channel's own setting
  ([US-Channels-03](../../../../user-stories/channels/US-Channels-03-current-channel-settings.md)).
* Add it to Compose, the database init, the migration container, its Kafka topics and the gateway route, the way the
  platform tasks set those up.

Why: everything else in this service is built on the new structure, and the rename reaches every service that calls it —
which is cheaper now than after the new work lands.
