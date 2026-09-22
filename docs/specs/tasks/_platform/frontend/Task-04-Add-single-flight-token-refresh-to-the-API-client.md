## Add single-flight token refresh to the API client

Needs: [Task-03 — Create the API client](Task-03-Create-the-API-client.md)

Refresh the tokens in the API client when a request gets `401`, as
[US-Auth-04](../../../user-stories/auth/US-Auth-04-Session-persistence.md) describes. The refresh request itself skips
this logic.

Main flow:

1. A request gets `401`.
2. If no refresh is running, start one and keep its promise; otherwise await the running one.
3. When it succeeds, retry the request once.
4. Clear the promise once it settles.

Branch — the refresh fails:

1. Reject every request waiting on it.
2. Clear the client-side session state and send the user to the login page with the "session expired" message.

Branch — the retried request gets `401` again:

1. Don't refresh a second time; treat it as a failed refresh.

Why: the tokens are in httpOnly cookies, so the client can't read their expiry and can only react to `401`. Refresh
tokens rotate, so five parallel requests starting five refreshes would leave four of them holding a token that no
longer works — one shared promise prevents that.
