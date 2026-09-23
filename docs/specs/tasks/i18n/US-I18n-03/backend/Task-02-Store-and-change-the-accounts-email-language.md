## Store and change the account's email language

Needs: [Task-01 — Migrate user-api to the new structure as account-api](Task-01-Migrate-user-api-to-the-new-structure-as-account-api.md),
[_platform foundation Task-05 — Define the supported languages in lib](../../../_platform/foundation/Task-05-Define-the-supported-languages-in-lib.md)

Add the email language to the account record in `account-api`, and let the settings page read and change it.

`GET /accounts/current` — the caller's account; the email language for now, with later stories adding to it

`PUT /accounts/current/email-language` — body `{ "language": "en" }`

Main flow:

1. Take the account from the `User-ID` header the gateway set.
2. Check the language against the shared list of supported languages.
3. Store it and return the account.

Branch — the language is not one of the supported ones:

1. Reject the request with its error code; nothing is stored.

The column defaults to English, and sign-up sets it from the interface language in use at that moment
([US-Auth-01](../../../../user-stories/auth/US-Auth-01-Account-creation-and-login.md)).

Why: the setting belongs to the account rather than to a channel, because every channel of an account shares one inbox.
