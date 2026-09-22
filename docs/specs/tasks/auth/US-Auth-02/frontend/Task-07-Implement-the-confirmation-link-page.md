## Implement the confirmation link page

Needs: [Task-05 — auth-api: Implement POST /auth/email-confirmation/confirm](../backend/Task-05-auth-api-Implement-POST-auth-email-confirmation-confirm.md)

Build the page the emailed link opens, outside the layout: it takes the token from the URL, calls the confirm endpoint,
then sends the user to the homepage with a success notification shown once.

Branch — the link is expired, invalid or already used:

1. The user lands on the confirmation page with a message saying what happened, and can send a new link from there.

Why: the page is public, because the link may be opened in a browser that is not signed in — the token in it is what
authorises the confirmation, and the response signs that browser in.
