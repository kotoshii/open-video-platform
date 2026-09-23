## Implement the sign-up page

Needs: [Task-07 — auth-api: Implement POST /auth/sign-up as a saga](../backend/Task-07-auth-api-Implement-POST-auth-sign-up-as-a-saga.md),
[_platform frontend Task-03 — Create the API client](../../../_platform/frontend/Task-03-Create-the-API-client.md),
[US-I18n-02 Task-02 — Show field-level errors under their fields](../../../i18n/US-I18n-02/frontend/Task-02-Show-field-level-errors-under-their-fields.md)

Build the sign-up page in the route group without the layout, with the form: email, channel name, date of birth with a
tooltip saying why it is asked, password, and password confirmation. It links to the log in page.

Main flow:

1. Every field is validated as the user goes, with the message under it — the password at least 8 characters, and the
   confirmation matching.
2. On submit the app calls the sign-up endpoint, sending the interface language with it.
3. A success notification appears and the user lands on the confirmation page
   ([US-Auth-02](../../../../user-stories/auth/US-Auth-02-Account-confirmation.md)).

Branch — the email is already taken:

1. The error appears under the email field and the user stays on the form, with what they typed.

Branch — anything else fails:

1. The default toast behaviour applies.

Why: the same rules are checked on the server, so the client-side validation is there to save a round trip rather than
to enforce anything.
