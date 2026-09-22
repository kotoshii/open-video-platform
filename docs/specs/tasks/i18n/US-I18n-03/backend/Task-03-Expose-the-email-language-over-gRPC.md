## Expose the email language over gRPC

Needs: [Task-02 — Store and change the account's email language](Task-02-Store-and-change-the-accounts-email-language.md)

Add a gRPC method to `account-api` that returns an account's email language. The email worker calls it for every email
it sends ([_platform infrastructure Task-24](../../../_platform/infrastructure/Task-24-Look-up-the-address-and-language-when-sending.md)).

Branch — there is no such account:

1. Answer that it is unknown, so the worker drops the email instead of retrying it forever.

Why: the worker reads the language when it sends, so an email held back by the notification batching window goes out in
the language that is current then, not the one from when the event was produced.
