## Migrate auth-api to the new structure

Move `auth-api` to the new module layout — `domain`, `application`, `infrastructure` and `presentation` per bounded
context — and rebuild it around Keycloak.

* Its own token issuing, the session and refresh token tables, the password hashing and the channel-scoped token
  endpoint all go. Keycloak owns identity now, and the acting channel travels in a header
  ([US-Channels-02](../../../../user-stories/channels/US-Channels-02-freely-switch-between-channels.md)).
* The service keeps its database, with no tables of its own until
  [US-Auth-05](../../../../user-stories/auth/US-Auth-05-Session-management.md) stores a session's device and location.
* Add the Keycloak admin client it talks through, and wire the service into Compose, the migration container, its Kafka
  topics and the gateway route, the way the platform tasks set those up.

Why: every endpoint in this epic goes through Keycloak, so the old identity code goes before the new arrives rather than
sitting beside it.
