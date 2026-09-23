## Create the API client

Needs: [Task-01 — Create the Next.js app](Task-01-Create-the-Nextjs-app.md),
[foundation Task-03 — Define the API error codes in lib](../foundation/Task-03-Define-the-API-error-codes-in-lib.md)

Create the one axios client that every feature's repository uses. It calls the gateway on the same origin, under
`/api`, with cookies.

* Add the `X-Channel-Id` header from the current channel on every request, read through one getter — where the channel
  is stored is decided in
  [US-Channels-02](../../../user-stories/channels/US-Channels-02-freely-switch-between-channels.md).
* Turn error responses into one typed error with the status, the `code`, the `details` and the `fields`.
* Turn failures with no response — a dropped connection, a timeout — into the same error type with a kind of its own,
  so the UI can pick a generic message ([US-I18n-02](../../../user-stories/i18n/US-I18n-02-Localized-error-messages.md)).

Why: the headers, the error shape and the token refresh are then written once, not per feature.
