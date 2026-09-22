## auth-api: Implement GET /auth/current-user

Needs: [Task-01 — Migrate auth-api to the new structure](Task-01-Migrate-auth-api-to-the-new-structure.md)

`GET /auth/current-user`

Main flow:

1. Take the account from the `User-ID` header the gateway set.
2. Read the identity from Keycloak: the email, whether it is confirmed, the date of birth and the ids of the account's
   channels.
3. Return them.

Why: the cookies are httpOnly, so the app cannot read the token and needs an endpoint to learn who it is acting as. The
channels' names and avatars are not here — `channel-api` owns those
([US-Channels-02](../../../../user-stories/channels/US-Channels-02-freely-switch-between-channels.md)) — and the
account's own settings come from `account-api` ([US-I18n-03](../../../../user-stories/i18n/US-I18n-03-Localized-emails.md)).
