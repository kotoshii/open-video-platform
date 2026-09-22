## Spike: Verify Keycloak tokens in the nginx gateway

The gateway has to verify the RS256 access token against Keycloak's JWKS, check `X-Channel-Id` against the token's
`channelIds` claim, and pass the claims on to the services as headers. Open-source nginx can't verify a JWT on its own —
its `auth_jwt` module is NGINX Plus only.

Find out how to do it in the gateway: njs with its WebCrypto API (the official nginx image already ships njs), a
third-party JWT module, or OpenResty. Check how the keys are cached and refetched when Keycloak rotates them.

Write the decision into [infrastructure.md](../../../infrastructure.md), gateway prerequisites, in place of the
`/auth/verify` item.

Why: `infrastructure.md` and the gateway template still describe a subrequest to `auth-api` for every request, which
this replaces.
