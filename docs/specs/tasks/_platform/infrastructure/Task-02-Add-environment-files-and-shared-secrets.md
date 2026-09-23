## Add environment files and shared secrets

Needs: [Task-01 — Split the Compose setup into per-environment files](Task-01-Split-the-Compose-setup-into-per-environment-files.md)

Add a committed `.env.example` listing every variable the Compose files read, and keep the real `.env` files out of
git. Every environment uses the same variable names with different values, and no service works out where its database
is from `NODE_ENV`.

Include the secrets two components share: `HLS_SECURE_LINK_SECRET` for the gateway and video-api, and
`TUS_WEBHOOK_SECRET` for the gateway and video-upload-api.

Why: a service that only reads the settings it is given has no environment-specific branch that can behave differently
in production ([environments-explained.md](../../../../explainers/environments-explained.md), Part 2).
