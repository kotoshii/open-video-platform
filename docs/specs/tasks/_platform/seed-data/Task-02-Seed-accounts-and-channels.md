## Seed accounts and channels

Needs: [Task-01 — Create the seed script](Task-01-Create-the-seed-script.md),
[US-Auth-01 Task-07 — auth-api: Implement POST /auth/sign-up as a saga](../../auth/US-Auth-01/backend/Task-07-auth-api-Implement-POST-auth-sign-up-as-a-saga.md),
[US-Auth-02 Task-05 — auth-api: Implement POST /auth/email-confirmation/confirm](../../auth/US-Auth-02/backend/Task-05-auth-api-Implement-POST-auth-email-confirmation-confirm.md),
[US-Channels-01 Task-03 — channel-api: Implement POST /channels](../../channels/US-Channels-01/backend/Task-03-channel-api-Implement-POST-channels.md),
[US-Channels-05 Task-01 — channel-api: Implement PUT /channels/current/avatar](../../channels/US-Channels-05/backend/Task-01-channel-api-Implement-PUT-channels-current-avatar.md)

Sign up about 10 accounts, keeping each one's cookies, then create extra channels until there are about 20. Names and
descriptions come from faker; avatars are single frames of an FFmpeg test source.

* Give the accounts a spread of dates of birth, a few of them under 18.
* Confirm about half of the emails by reading the confirmation link from the mail catcher's API.

Why: under-age and unconfirmed accounts are what exercise the age filters and the features that need a confirmed email.
