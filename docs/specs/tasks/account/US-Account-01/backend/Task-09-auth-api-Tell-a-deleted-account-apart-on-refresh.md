## auth-api: Tell a deleted account apart on refresh

Needs: [Task-07 — auth-api: Delete an account's identity over gRPC](Task-07-auth-api-Delete-an-accounts-identity-over-gRPC.md),
[US-Auth-04 Task-02 — auth-api: Implement POST /auth/refresh](../../../auth/US-Auth-04/backend/Task-02-auth-api-Implement-POST-auth-refresh.md)

When Keycloak rejects a refresh, check through the admin API whether the user still exists. If it does not, clear both
cookies and answer 401 with a code of its own instead of the usual one.

Why: the lookup runs only when a refresh has already failed, which is rare, so every ordinary refresh stays one call to
Keycloak.
