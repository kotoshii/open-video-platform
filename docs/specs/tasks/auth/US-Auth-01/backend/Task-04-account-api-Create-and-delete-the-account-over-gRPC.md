## account-api: Create and delete the account over gRPC

Needs: [US-I18n-03 Task-01 — Migrate user-api to the new structure as account-api](../../../i18n/US-I18n-03/backend/Task-01-Migrate-user-api-to-the-new-structure-as-account-api.md)

Add the two gRPC methods the sign-up saga calls: one that creates the account record for a new Keycloak user, taking the
account id and the email language, and one that deletes it again when a later step of the saga fails.

Branch — the account record already exists:

1. Answer with the one that is there, so a repeated call does not fail the saga.

Branch — there is nothing to delete:

1. Answer as if it had been deleted.

Why: both sides have to be idempotent, because a saga step can be retried and its compensation can run twice.
