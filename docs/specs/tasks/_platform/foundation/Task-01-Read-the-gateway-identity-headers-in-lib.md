## Read the gateway identity headers in lib

Needs: [infrastructure Task-17 — Verify access tokens in the gateway](../infrastructure/Task-17-Verify-access-tokens-in-the-gateway.md)

The gateway verifies the access token and passes what the services need as headers: `User-ID`, `Channel-ID`,
`Session-ID`, `Birthdate` and `Email-Verified`. Replace the JWT guard in `lib/api/auth` with decorators that read those
headers, and drop the JWT config builder and `addGlobalJwtAuthGuard` from the app builder.

* Keep a way to mark endpoints that work without a channel, like today's `@NoChannel()`. Every other endpoint rejects a
  request that has no `Channel-ID`.
* Parse `Email-Verified` into a boolean once, here.
* Add a helper that tells from `Birthdate` whether the viewer is an adult. Every listing that hides age-restricted
  videos uses it ([service-map.md](../../../service-map.md), rule 4).

Why: the token is verified in one place — the gateway — and every service trusts the same set of headers instead of
parsing a token itself. The gateway overwrites these headers on every request, so a client can never send its own.
