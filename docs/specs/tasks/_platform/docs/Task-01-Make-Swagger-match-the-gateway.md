## Make Swagger match the gateway

Needs: [foundation Task-01 — Read the gateway identity headers in lib](../foundation/Task-01-Read-the-gateway-identity-headers-in-lib.md),
[foundation Task-04 — Return error codes from every API](../foundation/Task-04-Return-error-codes-from-every-API.md)

Update `addSwagger` in the app builder so the docs describe the API the way a client sees it through the gateway:

* cookie auth instead of a bearer token, and the `X-Channel-Id` header on every endpoint that needs a channel;
* none of the headers the gateway sets (`User-ID`, `Channel-ID`, ...), since no client sends them;
* the error response with its `code`, on every endpoint.

Why: the docs are only useful if a request built from them works through the gateway.
