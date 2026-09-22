## auth-api: Store device and location for each session

Needs: [US-Auth-01 Task-08 — auth-api: Implement POST /auth/login](../../US-Auth-01/backend/Task-08-auth-api-Implement-POST-auth-login.md)

Record what Keycloak does not. When a session starts — at sign-up or at login — store a row keyed by the Keycloak
session id with the raw user agent, the OS and device parsed from it, the IP address, and the country and city from a
GeoIP lookup.

Branch — the GeoIP lookup finds nothing:

1. Store the session without a location; the list shows it as unknown.

Why: the lookup runs once, when the session starts, rather than on every listing — and the raw user agent is kept
alongside the parsed values because parsing one is always a guess.
