## account-api: Run the account purge as a saga

Needs: [Task-04 — account-api: Sweep for account deletions whose job was lost](Task-04-account-api-Sweep-for-account-deletions-whose-job-was-lost.md),
[Task-06 — channel-api: Purge every channel of an account](Task-06-channel-api-Purge-every-channel-of-an-account.md),
[Task-07 — auth-api: Delete an account's identity over gRPC](Task-07-auth-api-Delete-an-accounts-identity-over-gRPC.md)

Main flow:

1. The delayed job fires, or the sweep picks the account up.
2. Write a purge record and publish the account purge event.
3. Once `channel-api`'s event says every channel is purged, ask `auth-api` to delete the identity.
4. Delete the account row.

[US-Account-04](../../../../user-stories/account/US-Account-04-Download-own-user-data.md) adds one step before the
identity: deleting the stored data export.

Branch — `channel-api` has not reported after a while:

1. Publish the purge again. Every step is idempotent, so doing a part twice changes nothing.

Why: the account row goes last, as the channel row does, so a retry always finds the account it answers for. The
identity goes just before it, because deleting it is what signs every device out.
