## Serve every API's docs from one page

Needs: [Task-01 — Make Swagger match the gateway](Task-01-Make-Swagger-match-the-gateway.md)

Serve one Swagger UI behind the gateway, for example at `/api/docs`, with a dropdown of every API's OpenAPI document, and
route each API's document through the gateway.

Why: thirteen APIs with a docs page each, on ports of their own, are too many places to look.
