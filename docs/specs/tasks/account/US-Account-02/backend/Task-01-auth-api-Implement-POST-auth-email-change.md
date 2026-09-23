## auth-api: Implement POST /auth/email-change

Needs: [_platform infrastructure Task-24 — Look up the address and language when sending](../../../_platform/infrastructure/Task-24-Look-up-the-address-and-language-when-sending.md)

`POST /auth/email-change` — body `{ email }`

Main flow:

1. Take the account from the `User-ID` header.
2. Check that no other account uses the address in Keycloak.
3. Mint a single-use token for the account and the new address, keep it in Redis for 5 minutes, and start the
   account's 5-minute cooldown.
4. Publish the send-email event to the new address. Add the template to `email-worker`, in both languages.

Branch — the cooldown is still running:

1. Refuse with the seconds left.

Branch — the address is taken:

1. `409` with the field-level code, as on sign-up.

Why: the link goes to the new address because opening it is what proves the user owns it — nothing changes until then.
The event carries the address itself, since the account does not have it yet
([infrastructure.md](../../../../infrastructure.md), email module).
