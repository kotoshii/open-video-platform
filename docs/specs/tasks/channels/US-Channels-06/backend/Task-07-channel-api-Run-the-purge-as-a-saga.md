## channel-api: Run the purge as a saga

Needs: [Task-04 — channel-api: Sweep for deletions whose job was lost](Task-04-channel-api-Sweep-for-deletions-whose-job-was-lost.md),
[Task-06 — auth-api: Remove a channel id over gRPC](Task-06-auth-api-Remove-a-channel-id-over-gRPC.md)

Main flow:

1. The delayed job fires, or the sweep picks the channel up.
2. Write a purge record listing every service expected to report.
3. Publish the purge event, keyed by the channel.
4. Mark each service off as its "purged" event arrives.
5. Once all have reported, delete the channel's avatar object, ask `auth-api` to drop the channel id, and delete the
   channel row.

Branch — a service has not reported after a while:

1. Publish the purge again for the ones still missing. Every step is idempotent, so a service doing its part twice
   changes nothing.

Why: the channel row goes last, so a service that was down during the purge still finds the channel to answer for when
it comes back. Everything the channel published is listed in
[US-Channels-06](../../../../user-stories/channels/US-Channels-06-delete-own-channel.md) — that list is the contract
between the services, and the export in
[US-Account-04](../../../../user-stories/account/US-Account-04-Download-own-user-data.md) asks the same ones.
