## auth-api: Remove a channel id over gRPC

Needs: [US-Channels-01 Task-01 — auth-api: Add a channel id over gRPC](../../US-Channels-01/backend/Task-01-auth-api-Add-a-channel-id-over-gRPC.md)

Add the gRPC method that removes a channel id from the account's `channelIds` in Keycloak. The purge calls it as one of
its last steps.

Branch — the id is not there:

1. Answer as a success.

Why: the claim only goes stale when the purge runs — a week after the request, possibly while the user is signed in and
acting as that channel. The gateway then rejects the stale id and the app asks for another channel, which
[US-Channels-02](../../../../user-stories/channels/US-Channels-02-freely-switch-between-channels.md) already covers.
