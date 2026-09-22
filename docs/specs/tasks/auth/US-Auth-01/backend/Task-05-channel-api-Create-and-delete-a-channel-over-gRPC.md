## channel-api: Create and delete a channel over gRPC

Needs: [Task-02 — Migrate channel-api to the new structure](Task-02-Migrate-channel-api-to-the-new-structure.md)

Add the gRPC methods the sign-up saga calls: create a channel for an account, with the name from the sign-up form, and
delete one when a later step fails. Both are idempotent, for the same reason as Task-04.

Why: the first channel is created together with the account rather than through the normal creation flow
([US-Channels-01](../../../../user-stories/channels/US-Channels-01-create-multiple-channels.md)), so there is no channel
limit to check here — and this path does not ask `auth-api` to add the id to the token, because the saga does that
itself as its next step.
