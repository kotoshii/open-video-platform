## channel-api: Implement POST /channels

Needs: [Task-01 — auth-api: Add a channel id over gRPC](Task-01-auth-api-Add-a-channel-id-over-gRPC.md),
[Task-02 — channel-api: Implement GET /channels/mine](Task-02-channel-api-Implement-GET-channels-mine.md)

`POST /channels` — body `{ name, description }`

Main flow:

1. Take the account from the `User-ID` header.
2. Refuse if it already has 10 channels.
3. In one transaction, insert the channel and write the channel-created event to the outbox.
4. Ask `auth-api` over gRPC to add the id to the account's channels, before answering.
5. Return the channel.

Branch — the name is empty:

1. Field-level error; nothing is created.

Branch — the account already has 10 channels:

1. Reject with its code, which is what the unavailable button in the UI says.

Branch — `auth-api` cannot be reached:

1. Delete the channel again, write the matching event, and fail the request. Both events go through the outbox in
   order, so consumers see the creation and the deletion in that order.

Why: the claim is written synchronously because the front end refreshes its tokens straight after this call. The event
is for everyone else — the search index picks a new channel up from it
([US-Search-02](../../../../user-stories/search/US-Search-02-Search-channels.md)).
