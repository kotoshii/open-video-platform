## auth-api: Add a channel id over gRPC

Needs: [US-Auth-01 Task-01 — Migrate auth-api to the new structure](../../../auth/US-Auth-01/backend/Task-01-Migrate-auth-api-to-the-new-structure.md)

Add the gRPC method that adds a channel id to the account's `channelIds` attribute in Keycloak. `channel-api` calls it
while creating a channel, before it answers.

Branch — the id is already there:

1. Answer as a success, so a retried call changes nothing.

Why: only `auth-api` writes to Keycloak, and the claim has to be in place before the front end refreshes its tokens.
Announcing it with an event instead would race that refresh and hand back a token without the new channel.
