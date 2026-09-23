## Verify access tokens in the gateway

Needs: [Task-16 — Spike: Verify Keycloak tokens in the nginx gateway](Task-16-Spike-Verify-Keycloak-tokens-in-the-nginx-gateway.md),
[Task-15 — Run Keycloak with an imported realm](Task-15-Run-Keycloak-with-an-imported-realm.md)

Verify the access token from its cookie in the gateway, the way the Spike decided, replace the `auth_request`
subrequests in the gateway template, and pass the result on as headers.

Main flow:

1. Read the access token from its cookie.
2. Verify its signature against Keycloak's cached JWKS, and its expiry and issuer.
3. If the request has `X-Channel-Id`, check it is in the token's `channelIds` claim.
4. Set `User-ID`, `Channel-ID`, `Session-ID` (from `sid`), `Birthdate` and `Email-Verified` on the proxied request.

Branch — the token is missing, malformed, expired or badly signed:

1. Return `401`.

Branch — `X-Channel-Id` is not one of the account's channels:

1. Return `403`.

Branch — a token signed with a key the gateway hasn't cached:

1. Fetch the JWKS again once, then verify.

Branch — a public route (the ones the auth stories mark public, such as login and refresh):

1. Skip the verification.

On every route, clear those five headers from the client's request first, so a client can never send its own.

Why: checking a signature against cached keys needs no call to Keycloak or to a service per request
([US-Auth-04](../../../user-stories/auth/US-Auth-04-Session-persistence.md)), and the services never see or parse the
token.
