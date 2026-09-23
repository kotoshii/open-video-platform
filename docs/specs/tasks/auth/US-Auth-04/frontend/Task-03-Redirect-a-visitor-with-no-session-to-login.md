## Redirect a visitor with no session to login

Needs: [_platform frontend Task-02 — Set up the route groups](../../../_platform/frontend/Task-02-Set-up-the-route-groups.md)

Add the check to the app's middleware: a request for a page that needs a session and carries no session cookie is
redirected to the login page, with the page it asked for kept in the address as the place to return to.

Main flow:

1. The login page, after a successful login, goes to that address — through the channel selection page first when the
   account has several channels
   ([US-Channels-07](../../../../user-stories/channels/US-Channels-07-channel-selection-page.md)).
2. The page opens and its flow continues, email-link pages included: the confirmation link confirms, the deletion links
   confirm or cancel.

Branch — the page works without a session (the auth pages, the password reset page, the email change confirmation
page):

1. It renders as usual.

Branch — the return address points outside the app:

1. Ignore it and go to the homepage, so the login page cannot be used to send people elsewhere.

Why: without it the page renders, its first request comes back 401, and the user watches an empty layout before the
redirect. The session marker cookie only tells us that somebody was signed in here — the token itself is still
verified at the gateway on every request.
