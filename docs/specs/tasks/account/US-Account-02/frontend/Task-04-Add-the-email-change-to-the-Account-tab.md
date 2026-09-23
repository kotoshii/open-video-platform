## Add the email change to the Account tab

Needs: [Task-02 — auth-api: Implement GET /auth/email-change](../backend/Task-02-auth-api-Implement-GET-auth-email-change.md),
[US-Channels-03 Task-04 — Build the settings page with its tabs](../../../channels/US-Channels-03/frontend/Task-04-Build-the-settings-page-with-its-tabs.md)

Add the email section to the Account tab: the input pre-filled with the current address, a hint that a confirmation
email will be sent and that the change ends every active session, and a "Save" of its own.

Main flow:

1. The user enters a new address and saves.
2. "Save" becomes disabled and counts down to the next allowed attempt.

Branch — the format is invalid:

1. A validation error under the field, and nothing is sent.

Branch — the address is taken:

1. A field-level error, as on sign-up.

Branch — the page is reloaded during the cooldown:

1. "Save" comes back disabled with the remaining time the server returns.

Why: the countdown always starts from the server's number, never from a timer the page started, which is what survives
a reload.
