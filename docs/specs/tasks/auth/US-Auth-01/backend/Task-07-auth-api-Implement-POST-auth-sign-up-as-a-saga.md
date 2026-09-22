## auth-api: Implement POST /auth/sign-up as a saga

Needs: [Task-03 — Set up the Keycloak realm and its claims](Task-03-Set-up-the-Keycloak-realm-and-its-claims.md),
[Task-04 — account-api: Create and delete the account over gRPC](Task-04-account-api-Create-and-delete-the-account-over-gRPC.md),
[Task-05 — channel-api: Create and delete a channel over gRPC](Task-05-channel-api-Create-and-delete-a-channel-over-gRPC.md),
[Task-06 — auth-api: Return the token pair in httpOnly cookies](Task-06-auth-api-Return-the-token-pair-in-httpOnly-cookies.md)

`POST /auth/sign-up` — body `{ email, password, channelName, dateOfBirth, language }`

Main flow:

1. Create the Keycloak user with the email, the password and the date of birth as its `birthdate` attribute.
2. Ask `account-api` for the account record, passing the language as the account's email language
   ([US-I18n-03](../../../../user-stories/i18n/US-I18n-03-Localized-emails.md)).
3. Ask `channel-api` for the account's first channel.
4. Write that channel's id into the user's `channelIds` attribute in Keycloak.
5. Log the user in and return the token pair in cookies.

Branch — the email is already taken:

1. Return 409 with its code, as a field-level error on the email.

Branch — any step after the Keycloak user fails:

1. Undo what was already done, in reverse, ending with deleting the Keycloak user, and fail the request.

Why: three services and a real undo is what the saga pattern is for. Compensating in that order means a failed sign-up
never leaves an identity without an account or a channel — the state the old code could produce.
