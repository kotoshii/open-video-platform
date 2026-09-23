## Implement the confirmation link page

Needs: [Task-05 — auth-api: Implement POST /auth/email-confirmation/confirm](../backend/Task-05-auth-api-Implement-POST-auth-email-confirmation-confirm.md)

Build the page the emailed link opens, outside the layout: it takes the token from the URL, calls the confirm endpoint,
then sends the user to the homepage with a success notification shown once.

Branch — the link is expired, invalid or already used:

1. The user lands on the confirmation page with a message saying what happened, and can send a new link from there.

Branch — the link belongs to another account:

1. The page says so and suggests logging out and opening the link again.

Why: the page needs a session, so the middleware sends a visitor without one to log in and back here
([US-Auth-04](../../../../user-stories/auth/US-Auth-04-Session-persistence.md)). Confirming then only has to refresh
the session that already exists, which is what puts the new `email_verified` into the token.
