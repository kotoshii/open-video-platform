## Spike: Verify Keycloak tokens in the nginx gateway

The gateway has to verify the RS256 access token against Keycloak's JWKS, check `X-Channel-Id` against the token's
`channelIds` claim, and pass the claims on to the services as headers. Open-source nginx can't verify a JWT on its own —
its `auth_jwt` module is NGINX Plus only.

Find out how to do it in the gateway: njs with its WebCrypto API (the official nginx image already ships njs), a
third-party JWT module, or OpenResty. Check how the keys are cached and refetched when Keycloak rotates them.

Write the chosen mechanism into [infrastructure.md](../../../infrastructure.md), gateway prerequisites, into the item
on token verification — what the gateway checks and passes on is already there, only the how is missing.

Why: the gateway template still makes a subrequest to `auth-api` for every request, which this replaces.
