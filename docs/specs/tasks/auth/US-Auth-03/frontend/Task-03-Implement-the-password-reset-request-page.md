## Implement the password reset request page

Needs: [Task-01 — auth-api: Implement POST /auth/password-reset/request](../backend/Task-01-auth-api-Implement-POST-auth-password-reset-request.md)

Build the page behind the "Forgot password?" link, outside the layout: an email field and a "Request password reset"
button.

Main flow:

1. User submits a valid address.
2. The page says a link has been sent, and the button is disabled with a countdown to the next attempt.

Branch — the address is not a valid email:

1. A field-level error, and nothing is sent.

Branch — the server answers that the cooldown is still running:

1. The page shows that countdown instead of its own.

Branch — the page is reloaded:

1. It starts fresh; the server rejects an early second attempt with the real remaining time.

Why: the page keeps nothing between reloads on purpose — the server is the only thing that knows when the next attempt
is allowed.
