## Implement the confirmation page

Needs: [Task-03 — auth-api: Implement GET /auth/email-confirmation](../backend/Task-03-auth-api-Implement-GET-auth-email-confirmation.md),
[Task-04 — auth-api: Implement POST /auth/email-confirmation/resend](../backend/Task-04-auth-api-Implement-POST-auth-email-confirmation-resend.md)

Build the page the user lands on after signing up, outside the layout: it says a link has been sent and to which
address, and offers "Resend link" and "Continue to the app".

Main flow:

1. The page loads its state from the server.
2. The resend button is disabled, with the seconds left counting down.
3. When the countdown ends the button becomes available; clicking it sends a new link, shows a notification and starts
   the countdown again.

Branch — the email is already confirmed:

1. The page sends the user to the homepage.

Branch — the user chooses "Continue to the app":

1. The homepage opens, with the banner reminding them to confirm.

Why: the countdown comes from the server on every load, so reloading the page cannot shorten it.
