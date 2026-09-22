## Set the Keycloak token and session lifespans

Needs: [US-Auth-01 Task-03 — Set up the Keycloak realm and its claims](../../US-Auth-01/backend/Task-03-Set-up-the-Keycloak-realm-and-its-claims.md)

In the realm file: an access token that lives 5 minutes, SSO Session Idle of 30 days, and SSO Session Max raised well
past it.

Why: SSO Session Max defaults to 10 hours and ends every session at that point, however active the user is, which
silently undoes the 30 days. The short access token is what keeps the gap between a session being ended and the device
actually being cut off small ([US-Auth-05](../../../../user-stories/auth/US-Auth-05-Session-management.md)).
