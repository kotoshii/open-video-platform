## auth-api: Expose the account's email over gRPC

Needs: [US-Auth-01 Task-01 — Migrate auth-api to the new structure](../../US-Auth-01/backend/Task-01-Migrate-auth-api-to-the-new-structure.md)

Add the gRPC method that returns an account's email address, read from Keycloak. `email-worker` calls it for every email
it sends ([_platform infrastructure Task-24](../../../_platform/infrastructure/Task-24-Look-up-the-address-and-language-when-sending.md)).

Branch — there is no such account:

1. Answer that it is unknown, so the worker drops the email instead of retrying it forever.

Why: the address lives only in Keycloak, and only `auth-api` talks to Keycloak — so every service that needs one asks
here rather than keeping a copy that would go stale on the next email change
([US-Account-02](../../../../user-stories/account/US-Account-02-Change-email.md)).
