## Redirect a visitor with no session to login

Needs: [_platform frontend Task-02 — Set up the route groups](../../../_platform/frontend/Task-02-Set-up-the-route-groups.md)

Add the check to the app's middleware: a request for a page inside the layout that carries no refresh cookie is
redirected to the login page.

Branch — the page is one of the public ones, such as the auth pages or a page opened from an email link:

1. It renders as usual.

Why: without it the page renders, its first request comes back 401, and the user watches an empty layout before the
redirect. The cookie only tells us that somebody was signed in here — the token itself is still verified at the gateway
on every request.
