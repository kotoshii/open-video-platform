## Look up the address and language when sending

Needs: [Task-23 — Create email-worker](Task-23-Create-email-worker.md),
[US-I18n-03 Task-03 — Expose the email language over gRPC](../../i18n/US-I18n-03/backend/Task-03-Expose-the-email-language-over-gRPC.md)

Before sending, ask `auth-api` over gRPC for the account's email address and `account-api` for its email language.

Branch — the account no longer exists:

1. Drop the email and log it.

Branch — `auth-api` or `account-api` can't be reached:

1. Retry the send later, like a failed delivery.

Why: looking both up at send time means an email that waited in a batching window still goes to the current address, in
the language that is current when it is sent ([US-I18n-03](../../../user-stories/i18n/US-I18n-03-Localized-emails.md)).
The address lives only in Keycloak, so `auth-api` is the one service to ask.
