## auth-api: Delete an account's identity over gRPC

Add the gRPC method that deletes the account's user from Keycloak. A user that is already gone is a success.

Why: this is what ends every session — the refresh tokens have no user left to belong to. An access token already
issued still passes the gateway until it expires, a few minutes at most. The address is free for a new sign-up from
this moment, with no reservation of its own needed.
